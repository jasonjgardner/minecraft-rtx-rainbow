import { requests, resetBlocks, state } from "./_state.ts";
const kv = await Deno.openKv();

export type Request = {
  uuid: string;
  content: string;
  timestamp: number;
  result: boolean;
};

function createRequest(
  commandLine: string,
  originType?: "player" | "commandBlock",
) {
  const uuid = crypto.randomUUID();
  return [
    uuid,
    JSON.stringify({
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
          type: originType ?? "player",
        },
      },
    }),
  ];
}

/**
 * Queue a command to be sent to the server
 * @param commandLine - Minecraft command to execute
 */
export async function queueCommandRequest(commandLine: string) {
  const [uuid, content] = createRequest(commandLine);

  const key = ["requests", uuid];

  const res = await kv.set(key, {
    uuid,
    content,
    timestamp: Date.now(),
    result: false,
  });

  if (!res || res.ok !== true) {
    console.error("Failed to queue command: %s", commandLine);
    return;
  }

  console.log("Queued command: %s", commandLine);
}

/**
 * Remove request from queue. If block history is enabled, add block to history
 * @param msg - Message from server
 * @returns void
 */
export async function processCommandResponse(msg: { body: any; header: any }) {
  // const val = await kv.get(["requests", msg.header.requestId]);
  await kv.delete(["requests", msg.header.requestId]);
}
