import type { Axis, WssParams, WssState } from "./typings/types.ts";
import { decode } from "./src/components/ImagePrinter.ts";
import assemble from "./src/components/_assemble.ts";
import { serve } from "https://deno.land/std@0.164.0/http/server.ts";
import { join } from "https://deno.land/std@0.164.0/path/win32.ts";
import { ensureDir } from "https://deno.land/std@0.164.0/fs/mod.ts";

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
const state: WssState = {
  currentRequestIdx: 0,
  updatePending: false,
  material: "plastic_50",
  sendRate: 10,
  offset: [8, 0, -16],
  useAbsolutePosition: false,
  axis: "x" as Axis,
  blockHistory: [],
  blockHistoryMaxLength: 500,
  functionLog: join(Deno.cwd(), 'build', 'wss', 'functions')
};

const formatPosition = (x: number, y: number, z: number, offsetX?: number, offsetY?: number, offsetZ?: number) => {
  const { offset, useAbsolutePosition } = state;
  let [ox, oy, oz] = offset || [0, 0, 0];

  if (offsetX) {
    ox += offsetX;
  }

  if (offsetY) {
    oy += offsetY;
  }

  if (offsetZ) {
    oz += offsetZ;
  }

  const [nx, ny, nz] = [x - ox, y - oy, z - oz];

  return useAbsolutePosition ? `${nx} ${ny} ${nz}` : `~${nx} ~${ny} ~${nz}`;
};

function getBlockLibrary(material: string, exclude?: string[]) {
  return assemble(exclude).filter((b) => b.behaviorId.includes(material));
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

/**
 * Generate function on-the-fly from a string of commands, and queue it for execution
 */
function logFunction(fnName: string, content: string) {
  if (!state.functionLog) {
    return;
  }

  const logPath = join(state.functionLog, `${fnName}.mcfunction`);

  Deno.writeTextFileSync(logPath, content, { append: true });

  queueCommandRequest(content)
  
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
    console.info("Axis set to %s", state.axis);
    return;
  }

  if (contents.startsWith("https://") || contents.startsWith("http://")) {
    console.info("Image URL updated to", contents);
    updateContent(contents);
    return;
  }

  if (contents.startsWith("material/")) {
    const material = contents.replace("material/", "").replace(/\s+/g, "_");
    state.material = material;
    console.info("Material updated to", material);
    return;
  }

  if (contents.startsWith("position/")) {
    const position = contents.replace("position/", "").split(/[\s,]+/g, 3).map(
      (v) => parseInt(v, 10),
    ).slice(0, 3) as [number, number, number];

    state.offset = position;
    state.useAbsolutePosition = true;
    console.info("Position updated to %o", position);
    return;
  }

  if (contents.startsWith("log/") && state.functionLog) {
    const fn = contents.replace("log/", "").trim();

    await ensureDir(state.functionLog);

    const [fnName, fnContent] = fn.split("?", 2);
    logFunction(fnName, fnContent);
    console.info('Logged function "%s" to %s', fnName, state.functionLog);
    return;
  }

  console.warn("Unknown: %s", contents);
}
async function loadFunctionScript(fnNameInput: string) {
  const [scriptFile, params] = fnNameInput.split("?", 2);
  try {
    // TODO: Add cache busting to import statement
    const { default: mod } = await import(`./src/functions/${scriptFile}.ts`);
    const wssParams: WssParams = {
      queueCommandRequest,
      parameters: new URLSearchParams(params),
      state,
      formatPosition
    }

    await mod(wssParams);
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
    getBlockLibrary(state.material ?? "plastic_50"),
    state.offset ?? [0, 0, 0],
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

  // sessionStorage.setItem(`request[${uuid}]`, content);

  // Speed up rend rate based on number of requests
  state.sendRate = requests.length > 100 ? 3 : 1;
}

async function onOpenHandler(socket: WebSocket) {
  console.log("ws:open");

  subscribe(socket, ["PlayerMessage", "commandResponse"]);

  // Send whatever is in queue every #ms
  connectionUpdateInterval = setInterval(() => {
    const requestsCount = requests.length;

    if (
      (requestsCount === 0 && !state.updatePending) ||
      requests[state.currentRequestIdx].result
    ) {
      return;
    }

    socket.send(requests[state.currentRequestIdx]?.content ?? "");
    state.currentRequestIdx++;

    if (state.currentRequestIdx >= requestsCount) {
      state.currentRequestIdx = 0;
      requests.length = 0;
      console.info("Queue cleared");
    }
  }, state.sendRate);
}

function resetBlocks() {
  // queue command to clear a block from state.blockHistory every 10 seconds

  const q = (sec: number) => {
    const pos = state.blockHistory.shift();
    if (pos) {
      queueCommandRequest(`setblock ${pos.join(" ")} air`);
      setTimeout(q, sec * 1000, sec);
      return;
    }
    state.blockHistory.length = 0;
  }

  q(10);
}

function processCommandResponse(msg: { body: any, header: any }) {
  if (!requests) {
    return;
  }

  if (msg.body.statusMessage === "Block placed" && msg.body.position) {
    const pos = Object.values(msg.body.position).map((v) => parseInt(`${v}`, 10)).slice(0, 3) as [number, number, number];
    sessionStorage.setItem("lastBlock", JSON.stringify(pos));

    state.blockHistory.push(pos);

    if (state.blockHistory.length > state.blockHistoryMaxLength ?? 1000) {
      resetBlocks();
    }
  }
  
  const { requestId } = msg.header;

  const idx = requests.findIndex((req) => req && req.uuid === requestId);

  if (idx === -1) {
    //console.warn("Unknown request id: %s", requestId);
    return;
  }

  delete requests[idx];

  //const pendingRequest = requests.find((r) => r.uuid === msg.header.requestId);

  //const sessionData = sessionStorage.getItem(`request[${msg.body.requestId}]`);

  // if (pendingRequest) {
  //   pendingRequest.result = true;
  // } else if (!sessionData) {
  //   console.warn("Unknown response!\nHeader: %o\nBody: %o", msg.header, msg.body);
  //   return;
  // }

  // sessionStorage.removeItem(`request[${msg.body.requestId}]`);
  // sessionStorage.setItem(`result[${msg.body.requestId}]`, JSON.stringify(msg.body));
}

export function requestHandler(req: Request) {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onmessage = async (e) => {
    const msg = JSON.parse(e.data);

    if (msg?.header?.eventName === "PlayerMessage") {
      await processMessage(msg.body);
      return;
    }

    if (msg?.header?.messagePurpose === "commandResponse") {
      processCommandResponse(msg);
      return;
    }
    console.warn("Unknown message received: %o", msg);
  };

  socket.onopen = async () => {
    //await updateContent();
    await onOpenHandler(socket);
  };

  socket.onclose = () => {
    clearInterval(connectionUpdateInterval);
    connectionUpdateInterval = undefined;
    console.info("ws:close");
  };

  return response;
}

serve(requestHandler, { port: 3000 });
