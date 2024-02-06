import { subscribe } from "../mod.ts";
import { queueCommandRequest } from "../_io.ts";
import { createKeepAliveInterval, createUpdateInterval } from "../_state.ts";
/**
 * Function called upon WebSocket connection open
 * @param socket WebSocket connection
 */
export async function onOpenHandler(socket: WebSocket) {
  console.info("ws:open");

  subscribe(socket, ["PlayerMessage", "commandResponse"]);

  await createUpdateInterval(socket);

  // Send a keep alive every 10 seconds
  createKeepAliveInterval(socket);

  // Send a greeting on connect
  setTimeout(() => {
    console.log(
      "%cR%cA%cI%cN%cB%cO%cW server started!",
      "color:red;",
      "color:orange;",
      "color:yellow;",
      "color:green;",
      "color:blue;",
      "color:indigo;",
      "color:violet;",
    );
    queueCommandRequest(
      'tellraw @a {"rawtext":[{"text":"§c§o§lR"},{"text":"§6§o§lA"},{"text":"§e§o§lI"},{"text":"§a§o§lN"},{"text":"§b§o§lB"},{"text":"§9§o§lO"},{"text":"§1§o§lW"},{"text":"§r sever connected!"}]}',
    );
  }, 1000);
}
