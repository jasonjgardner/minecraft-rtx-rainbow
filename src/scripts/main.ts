/// @deno-types="npm:@types/mojang-gametest"
/// @deno-types="npm:@minecraft/server"
/// @deno-types="npm:@minecraft/server-net"
import {
  type Block,
  type Entity,
  GameMode,
  type Player,
  system,
  world,
} from "@minecraft/server";
import {
  http,
  HttpClient,
  HttpHeader,
  HttpRequest,
  HttpRequestMethod,
  type HttpResponse,
} from "@minecraft/server-net";
const $BLOCKS = [];
const SERVER_URL = "http://127.0.0.1:8000/api/bds/commands";
let tickSpeed = 10;

function getBlockName(color: string, material: string, level = 50, tint = 500) {
  return `rainbow:${color}_${tint}_${material}_${level}`;
}

let processing = false;

function requestCommands(params: any) {
  const request = (new HttpRequest(SERVER_URL)).setMethod(
    HttpRequestMethod.POST,
  )
    .setBody(JSON.stringify(params)).setHeaders([
      new HttpHeader("Content-Type", "application/json"),
    ]);

  request.body = JSON.stringify(params);
  request.method = HttpRequestMethod.POST;

  return request;
}

function processCommandResponse({ body }: HttpResponse) {
  const overworld = world.getDimension("overworld");
  const players = overworld.getPlayers({
    excludeGameModes: [GameMode.spectator],
  });
  const { command, target } = JSON.parse(body);
  const commands = command.split(";");
  for (const player of players) {
    if (player.name !== target) {
      continue;
    }

    for (const command of commands) {
      player.runCommand(command);
    }
  }

  processing = false;
}

function getHttpCommand() {
  processing = true;
  // HttpClient.prototype.request(requestCommands({
  //   players,
  // }))
  http.get(SERVER_URL).then(processCommandResponse).catch((err) => {
    console.warn(err);
    processing = false;
  });
}

// function mainTick() {

//   system.run(mainTick);
// }

// system.run(mainTick);

system.runInterval(function intervalTick() {
  getHttpCommand();
}, tickSpeed);

world.afterEvents.projectileHitBlock.subscribe((hitEvent) => {
  console.log(
    `Hit ${hitEvent.location.x}, ${hitEvent.location.y}, ${hitEvent.location.z}`,
  );
  http.get(
    `${SERVER_URL}/hit?x=${hitEvent.location.x}&y=${hitEvent.location.y}&z=${hitEvent.location.z}`,
  ).then(processCommandResponse).catch((err) => {
    console.warn(err);
    processing = false;
  });
});

world.afterEvents.chatSend.subscribe(({ message, sender, getTargets }: {
  message: string;
  sender: Player;
  getTargets: () => Player[];
}) => {
  http.get(
    `${SERVER_URL}/chat?message=${
      encodeURIComponent(message)
    }&sender=${sender.name}&targets=${
      getTargets()?.map(
        (player: Player) => player.name,
      )
    }`,
  ).then(processCommandResponse).catch((err) => {
    console.warn(err);
    processing = false;
  });
});

world.afterEvents.playerPlaceBlock.subscribe(({ block, player }: {
  block: Block;
  player: Player;
}) => {
  http.get(
    `${SERVER_URL}/block?x=${block.x}&y=${block.y}&z=${block.z}&player=${player.name}`,
  ).then(processCommandResponse).catch((err) => {
    console.warn(err);
    processing = false;
  });
});

system.afterEvents.scriptEventReceive.subscribe(({
  id,
  message,
  sourceBlock,
  sourceEntity,
  sourceType,
  initiator,
}: {
  id: string;
  message: string;
  sourceBlock: Block;
  sourceEntity: Entity;
  sourceType: string;
  initiator: Entity;
}) => {
  console.log(
    `Script Event: ${id} ${message} ${sourceBlock} ${sourceEntity} ${sourceType} ${initiator}`,
  );
  http.request(requestCommands({
    id,
    message,
    sourceBlock,
    sourceEntity,
    sourceType,
    initiator,
  })).then(processCommandResponse).catch((err) => {
    console.warn(err);
    processing = false;
  });
});
