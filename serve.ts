import type { Axis, WssParams, WssState } from "./typings/types.ts";
import { serve } from "http/server.ts";
import { join } from "path/win32.ts";
import { ensureDir } from "fs/mod.ts";

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
  enableBlockHistory: false,
  blockHistory: [],
  blockHistoryMaxLength: 500,
  functionLog: join(Deno.cwd(), 'build', 'wss', 'functions')
};

/**
 * Format the position for the command
 * @param x - X coordinate
 * @param y - Y coordinate
 * @param z - Z coordinate
 * @param offsetX - Offset X coordinate
 * @param offsetY - Offset Y coordinate
 * @param offsetZ - Offset Z coordinate
 * @returns Absolute or relative position
 */
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

let connectionUpdateInterval: number | undefined;
let keepAliveInterval: number | undefined;

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

  if (contents.startsWith("history/")) {
    const steps = parseInt(contents.replace("history/", ""), 10);

    state.blockHistory = [];
    state.enableBlockHistory = steps > 0;
    state.blockHistoryMaxLength = steps;
    return;
  }

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

  if (contents.startsWith("log/") && state.functionLog) {
    const fn = contents.replace("log/", "").trim();

    await ensureDir(state.functionLog);

    const [fnName, fnContent] = fn.split("?", 2);
    logFunction(fnName, fnContent);
    console.info('Logged function "%s" to %s', fnName, state.functionLog);
    return;
  }

  if (contents.startsWith("help/")) {
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7Available commands:"`);
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7- §fhelp§7: Show this message"`);
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7- §fread§7: Read a function file"`);
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7- §flr§7: Live reload a function file"`);
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7- §fscript§7: Run a script"`);
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7- §flog§7: Log a function to a file"`);
    queueCommandRequest(`tell ${sender} §c[§fWSS§c] §7- §fhistory§7: Enable/disable block history"`);
    return;
  }

  // Check if command is a queued message sent from the server. Do nothing if it's detected in the queue.
  if (requests.find((r) => r && r.content === contents)) {
    return;
  }

  console.warn("Unknown: %s", contents);
}
/**
 * Load special functions found in `./src/functions/`
 * @param fnNameInput Script source
 */
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

/**
 * Parse a .mcfunction file and queue it for execution
 * @param fnNameInput .mcfunction file name
 */
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

/**
 * Subscribe to events from the server
 * @param socket WebSocket connection to the server
 * @param events List of events to subscribe to
 */
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

/**
 * Queue a command to be sent to the server
 * @param commandLine - Minecraft command to execute
 * @param sendRate - How many commands to send per ms
 */
function queueCommandRequest(commandLine: string, sendRate = 1) {
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

  //sessionStorage.setItem(`request[${uuid}]`, content);

  // Speed up rend rate based on number of requests
  state.sendRate = requests.length > 500 ? Math.max(3, sendRate) : Math.max(1, sendRate);
}

/**
 * Function called upon WebSocket connection open
 * @param socket WebSocket connection
 */
async function onOpenHandler(socket: WebSocket) {
  console.info("ws:open");

  subscribe(socket, ["PlayerMessage", "commandResponse"]);

  // Send whatever is in queue every #ms
  connectionUpdateInterval = setInterval(() => {
    const requestsCount = requests.length;

    if (
      (requestsCount === 0 && !state.updatePending) ||
      requests[state.currentRequestIdx]?.result
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

  // Send a keep alive every 10 seconds
  keepAliveInterval = setInterval(() => {
    if (requests.length > 0) {
      return;
    }

    socket.send(JSON.stringify({
      header: {
        version: 1,
        requestId: crypto.randomUUID(),
        messageType: "commandRequest",
        messagePurpose: "keepAlive",
      },
      body: {},
    }));
  }, 10000);

  // Send a greeting on connect
  setTimeout(() => {
    console.log('%cR%cA%cI%cN%cB%cO%cW server started!', 'color:red;', 'color:orange;', 'color:yellow;', 'color:green;', 'color:blue;', 'color:indigo;', 'color:violet;');
    queueCommandRequest('tellraw @a {"rawtext":[{"text":"§c§o§lR"},{"text":"§6§o§lA"},{"text":"§e§o§lI"},{"text":"§a§o§lN"},{"text":"§b§o§lB"},{"text":"§9§o§lO"},{"text":"§1§o§lW"},{"text":"§r sever connected!"}]}');
  }, 1000);
}

/**
 * Reset blocks in block history
 */
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

/**
 * Remove request from queue. If block history is enabled, add block to history
 * @param msg - Message from server
 * @returns void
 */
function processCommandResponse(msg: { body: any, header: any }) {
  if (!requests) {
    return;
  }

  if (state.enableBlockHistory === true && msg.body.statusMessage === "Block placed" && msg.body.position) {
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

  // const pendingRequest = requests.find((r) => r.uuid === msg.header.requestId);

  // const sessionData = sessionStorage.getItem(`request[${msg.body.requestId}]`);

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
    clearInterval(keepAliveInterval);
    connectionUpdateInterval = undefined;
    console.info("ws:close");
  };

  return response;
}

serve(requestHandler, { port: 3000 });
