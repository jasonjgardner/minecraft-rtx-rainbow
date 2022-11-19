import type { Axis } from "./typings/types.ts";
import { decode } from "./src/components/ImagePrinter.ts";
import assemble from "./src/components/_assemble.ts";
import { serve } from "https://deno.land/std@0.164.0/http/server.ts";

type SubscribeEvents =
  | "AdditionalContentLoaded"
  | "AgentCommand"
  | "AgentCreated"
  | "ApiInit"
  | "AppPaused"
  | "AppResumed"
  | "AppSuspended"
  | "AwardAchievement"
  | "BlockBroken"
  | "BlockPlaced"
  | "BoardTextUpdated"
  | "BossKilled"
  | "CameraUsed"
  | "CauldronUsed"
  | "ChunkChanged"
  | "ChunkLoaded"
  | "ChunkUnloaded"
  | "ConfigurationChanged"
  | "ConnectionFailed"
  | "CraftingSessionCompleted"
  | "EndOfDay"
  | "EntitySpawned"
  | "FileTransmissionCancelled"
  | "FileTransmissionCompleted"
  | "FileTransmissionStarted"
  | "FirstTimeClientOpen"
  | "FocusGained"
  | "FocusLost"
  | "GameSessionComplete"
  | "GameSessionStart"
  | "HardwareInfo"
  | "HasNewContent"
  | "ItemAcquired"
  | "ItemCrafted"
  | "ItemDestroyed"
  | "ItemDropped"
  | "ItemEnchanted"
  | "ItemSmelted"
  | "ItemUsed"
  | "JoinCanceled"
  | "JukeboxUsed"
  | "LicenseCensus"
  | "MascotCreated"
  | "MenuShown"
  | "MobInteracted"
  | "MobKilled"
  | "MultiplayerConnectionStateChanged"
  | "MultiplayerRoundEnd"
  | "MultiplayerRoundStart"
  | "NpcPropertiesUpdated"
  | "OptionsUpdated"
  | "performanceMetrics"
  | "PackImportStage"
  | "PlayerBounced"
  | "PlayerDied"
  | "PlayerJoin"
  | "PlayerLeave"
  | "PlayerMessage"
  | "PlayerTeleported"
  | "PlayerTransform"
  | "PlayerTraveled"
  | "PortalBuilt"
  | "PortalUsed"
  | "PortfolioExported"
  | "PotionBrewed"
  | "PurchaseAttempt"
  | "PurchaseResolved"
  | "RegionalPopup"
  | "RespondedToAcceptContent"
  | "ScreenChanged"
  | "ScreenHeartbeat"
  | "SignInToEdu"
  | "SignInToXboxLive"
  | "SignOutOfXboxLive"
  | "SpecialMobBuilt"
  | "StartClient"
  | "StartWorld"
  | "TextToSpeechToggled"
  | "UgcDownloadCompleted"
  | "UgcDownloadStarted"
  | "UploadSkin"
  | "VehicleExited"
  | "WorldExported"
  | "WorldFilesListed"
  | "WorldGenerated"
  | "WorldLoaded"
  | "WorldUnloaded";

const requests: Array<
  { uuid: string; content: string; timestamp: number; result?: boolean }
> = [];
const state = {
  idx: 0,
  updatePending: false,
  material: "plastic_50",
  sendRate: 10,
  offset: [8, 0, -16],
  useAbsolutePosition: false,
  axis: "x" as Axis,
  hasFocus: true,
};

function getBlockLibrary(material: string) {
  return assemble().filter((b) => b.behaviorId.includes(material));
}

let connectionUpdateInterval: number | undefined;

async function watch(fnNameInput: string) {
  const [fnName, _params] = fnNameInput.split("?", 2);

  // TODO: Add params for `watch` command, and remove them before passing to `queueFunctionFile`

  const filepath = `./src/functions/${fnName}.mcfunction`;

  console.log("Watching function file %s", filepath);

  const watcher = Deno.watchFs(filepath);
  const ignoreEvents = ["any", "access"];

  for await (const event of watcher) {
    if (ignoreEvents.includes(event.kind)) {
      continue;
    }

    console.log("File %s changed, reloading", filepath);

    await queueFunctionFile(fnNameInput);
  }
}

async function processMessage(
  { message, sender }: { message: string; sender: string },
) {
  const contents = message.replace(`[${sender}] `, "").trim();

  // TODO: Add index help function

  // Live reload
  if (contents.startsWith("lr/")) {
    await watch(contents.replace("lr/", "").trim());
    return;
  }

  if (contents.startsWith("read/")) {
    try {
      const fn = contents.replace("read/", "").trim();
      await queueFunctionFile(fn);
    } catch (err) {
      console.error(err);
    }
    return;
  }

  if (contents.startsWith("script/")) {
    try {
      const fn = contents.replace("script/", "").trim();
      await loadFunctionScript(fn);
    } catch (err) {
      console.error(err);
    }
    return;
  }

  if (contents.startsWith("axis/")) {
    state.axis = contents.replace("axis/", "").trim() as Axis;
    console.log("Axis set to %s", state.axis);
    return;
  }

  if (contents.startsWith("https://") || contents.startsWith("http://")) {
    console.log("Image URL updated to", contents);
    updateContent(contents);
    return;
  }

  if (contents.startsWith("material/")) {
    const material = contents.replace("material/", "").replace(/\s+/g, "_");
    state.material = material;
    console.log("Material updated to", material);
    return;
  }

  if (contents.startsWith("position/")) {
    const position = contents.replace("position/", "").split(/[\s,]+/g, 3).map(
      (v) => parseInt(v, 10),
    );
    state.offset = position;
    state.useAbsolutePosition = true;
    console.log("Position updated to %o", position);
    return;
  }

  console.warn("Unknown: %s", contents);
}
async function loadFunctionScript(fnNameInput: string) {
  const [scriptFile, params] = fnNameInput.split("?", 2);
  try {
    // TODO: Add cache busting to import statement
    const { default: mod } = await import(`./src/functions/${scriptFile}.ts`);

    mod({
      queueCommandRequest,
      parameters: new URLSearchParams(params),
      state,
    });
  } catch (err) {
    console.error("Failed loading/executing function script: %s", err);
  }
}

async function queueFunctionFile(fnNameInput: string) {
  const [fnName, fnParams] = fnNameInput.split("?", 2);

  const filepath = `./src/functions/${fnName}.mcfunction`;

  console.log("Loading function file %s", filepath);

  const file = await Deno.readTextFile(filepath);
  const params = fnParams ? fnParams.split("&") : [];
  const lines = file.split("\n").map((l) => {
    if (l.startsWith("#")) {
      return;
    }

    params.forEach((p) => {
      const [key, value] = p.split("=", 2);
      l = l.replace("$" + key, value);
    });

    return l.trim();
  }).filter((l) => l && l.length > 0);

  console.log("Queueing %d lines", lines.length);

  lines.map((c) => c && queueCommandRequest(c));
}

async function updateContent(imgUrl: string) {
  if (imgUrl.length < 4) {
    return;
  }

  state.updatePending = true;
  const commands = await decode(
    new URL(imgUrl),
    getBlockLibrary(state.material),
    state.offset,
    state.axis,
    state.useAbsolutePosition === true,
  );
  requests.length = 0;
  commands.map((c) => queueCommandRequest(c));
  console.info("Queued %d commands", commands.length);
  state.updatePending = false;
}

function subscribe(socket: WebSocket, events: Array<string | SubscribeEvents>) {
  events.forEach((event) => {
    socket.send(JSON.stringify({
      header: {
        version: 1,
        requestId: crypto.randomUUID(),
        messageType: "commandRequest",
        messagePurpose: "subscribe",
      },
      body: {
        eventName: event,
      },
    }));
  });
}

function queueCommandRequest(commandLine: string) {
  const uuid = crypto.randomUUID();
  const content = JSON.stringify({
    header: {
      version: 1,
      requestId: uuid,
      messageType: "commandRequest",
      messagePurpose: "commandRequest",
    },
    body: {
      version: 1,
      commandLine,
      origin: {
        type: "player",
      },
    },
  });

  requests.push({
    uuid,
    content,
    timestamp: Date.now(),
    result: false,
  });

  // Speed up rend rate based on number of requests
  state.sendRate = requests.length > 100 ? 10 : 2;
}

async function onOpenHandler(socket: WebSocket) {
  console.log("ws:open");

  subscribe(socket, ["PlayerMessage", "AppResumed", "AppPaused"]);

  // Send whatever is in queue every #ms
  connectionUpdateInterval = setInterval(() => {
    const requestsCount = requests.length;

    if (!state.hasFocus) {
      console.info("Skipping update, no focus");
      return;
    }

    if (
      (requestsCount === 0 && !state.updatePending) ||
      requests[state.idx].result
    ) {
      return;
    }

    socket.send(requests[state.idx]?.content ?? "");
    state.idx++;

    if (state.idx >= requestsCount) {
      state.idx = 0;
      requests.length = 0;
      console.log("Queue cleared");
    }
  }, state.sendRate);
}

function processCommandResponse({ body }: { body: any }) {
  if (body.blockName) {
    const pendingRequest = requests.find((r) => r.uuid === body.requestId);

    if (pendingRequest) {
      pendingRequest.result = true;
    }
  }
}

export function requestHandler(req: Request) {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onmessage = async (e) => {
    const msg = JSON.parse(e.data);

    if (msg?.header?.eventName === "AppResumed") {
      state.hasFocus = true;
      return;
    }

    if (msg?.header?.eventName === "AppPaused") {
      state.hasFocus = false;
      return;
    }

    if (msg?.header?.eventName === "PlayerMessage") {
      await processMessage(msg.body);
      return;
    }

    if (msg?.header?.messagePurpose === "commandResponse") {
      requests[msg.header.requestId] = msg.body.blockName;
      return;
    }
    console.log("On message %o", msg);
  };

  socket.onopen = async () => {
    //await updateContent();
    await onOpenHandler(socket);
  };

  socket.onclose = () => {
    clearInterval(connectionUpdateInterval);
    connectionUpdateInterval = undefined;
    console.log("ws:close");
    console.log("%o", requests);
  };

  return response;
}

serve(requestHandler, { port: 3000 });
