import type { SubscribeEvents } from "./types.d.ts";
/**
 * Subscribe to events from the server
 * @param socket WebSocket connection to the server
 * @param events List of events to subscribe to
 */
export function subscribe(
  socket: WebSocket,
  events: Array<string | SubscribeEvents>,
) {
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
