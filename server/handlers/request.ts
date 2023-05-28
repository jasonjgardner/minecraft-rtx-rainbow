import { onOpenHandler } from "./onOpen.ts";
import { processMessage } from "../_router.ts";
import { processCommandResponse } from "../_io.ts";
import { clearUpdateInterval } from "../_state.ts";

export function requestHandler(req: Request) {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }
  const { socket, response } = Deno.upgradeWebSocket(req);

  socket.onmessage = async (e) => {
    const msg = JSON.parse(e.data);

    // Outgoing
    if (msg?.header?.eventName === "PlayerMessage") {
      await processMessage(msg.body);
      return;
    }

    // Incoming
    if (msg?.header?.messagePurpose === "commandResponse") {
      await processCommandResponse(msg);
      return;
    }
    console.warn("Unknown message received: %o", msg);
  };

  socket.onopen = async () => {
    //await updateContent();
    await onOpenHandler(socket);
  };

  socket.onclose = () => {
    clearUpdateInterval();
    console.info("ws:close");
  };

  return response;
}
