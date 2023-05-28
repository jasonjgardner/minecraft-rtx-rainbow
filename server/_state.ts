import type { Axis, WssParams, WssState } from "../typings/types.ts";
import type { Request} from './_io.ts'
import { join } from "path/win32.ts";
import { queueCommandRequest } from "./_io.ts";
export const requests: Array<
  { uuid: string; content: string; timestamp: number; result?: boolean }
> = [];

const kv = await Deno.openKv();

export const state: WssState = {
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
  functionLog: join(Deno.cwd(), "build", "wss", "functions"),
};

let requestPoolInterval: number | undefined;
let keepAliveInterval: number | undefined;
let sendInterval: number | undefined;

export function clearUpdateInterval() {
  clearInterval(requestPoolInterval);
  clearInterval(keepAliveInterval);
  clearInterval(sendInterval);
  requestPoolInterval = undefined;
}

export function createUpdateInterval(socket: WebSocket) {
  const requests: Request[] = [];
  requestPoolInterval = setInterval(async () => {
    const reqs = kv.list({
      prefix: ["requests"]
    }, {
      limit: 1000,
    });

    if (requests.length > 1000) {
      console.log("Too many requests in queue, clearing...");
      requests.length = 0;
    }

    for await (const { key, value } of reqs) {
      // Send from KV store
      requests.push(value as Request);
    }

    console.log(requests.length)
    // const requestsCount = requests.length;

    // if (
    //   (requestsCount === 0 && !state.updatePending) ||
    //   requests[state.currentRequestIdx]?.result
    // ) {
    //   return;
    // }

    // socket.send(requests[state.currentRequestIdx]?.content ?? "");
    // state.currentRequestIdx++;

    // if (state.currentRequestIdx >= requestsCount) {
    //   state.currentRequestIdx = 0;
    //   requests.length = 0;
    //   console.info("Queue cleared");
    // }
  }, 10000);

  sendInterval = setInterval(() => {
    if (requests.length === 0) {
      return;
    }

    const req = requests.shift();

    if (!req) {
      return;
    }

    socket.send(req.content);
    kv.delete(["requests", req.uuid]);
  }, 5);
}

export function createKeepAliveInterval(socket: WebSocket) {
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
}

/**
 * Reset blocks in block history
 */
export function resetBlocks() {
  // queue command to clear a block from state.blockHistory every 10 seconds

  const q = (sec: number) => {
    const pos = state.blockHistory.shift();
    if (pos) {
      queueCommandRequest(`setblock ${pos.join(" ")} air`);
      setTimeout(q, sec * 1000, sec);
      return;
    }
    state.blockHistory.length = 0;
  };

  q(10);
}
