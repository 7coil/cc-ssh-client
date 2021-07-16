import { logger } from "./ssh/logger";
import {
  Packet,
  PacketType, TerminalLoginPacket
} from "./ssh/Packet";
import packetHandler from "./ssh/packetHandler";
import { parsearg } from "./ssh/parsearg";

const exit = (code?: number | undefined): void => {
  programRunning = false;
};
os.exit = exit as any;

const [initialTerminalWidth, initialTerminalHeight] = term.getSize();
let programRunning = true;
const argv = [...$vararg] as string[];

const options = parsearg(argv);

if (programRunning) {
  const [websocket, errorMessage] = http.websocket(options.websocket);

  term.setCursorBlink(true);

  if (websocket) {
    const loginPacket = new Packet(PacketType.login, {
      width: initialTerminalWidth,
      height: initialTerminalHeight,
      remote: options.destination,
      username: options.username,
    }) as TerminalLoginPacket;
    websocket.send(loginPacket.encode());

    let ctrl = false;

    while (programRunning) {
      const e = os.pullEvent();
      const [event] = e;

      if (event === "websocket_message") {
        const [, url, message] = e as os.Events.WebsocketMessageEvent;

        if (url === options.websocket) {
          const packet = Packet.parse(message);
          
          packetHandler.handlePacket(packet);
        }
      } else if (event === "key") {
        const [, keycode, held] = e as os.Events.KeyEvent;

        if (keycode === 341) {
          ctrl = true
        } else if (keycode >= 64 && keycode <= 95) {
          // If a ctrlable letter is being pressed, send the special char.
          if (ctrl) {
            const packet = new Packet(PacketType.char, {
              char: String.fromCharCode(keycode - 64),
            });
  
            websocket.send(packet.encode());
          }
        } else {
          const packet = new Packet(PacketType.keypress, {
            kc: keycode,
            held,
          });
  
          websocket.send(packet.encode());
        }
      } else if (event === "key_up") {
        const [, keycode] = e as os.Events.KeyUpEvent;

        if (keycode === 341) {
          ctrl = false
        }
      } else if (event === "char") {
        const [, char] = e as os.Events.CharEvent;
        const packet = new Packet(PacketType.char, {
          char
        })

        websocket.send(packet.encode());
      }
    }
  } else {
    logger.error("WebSockets: " + errorMessage || "Unknown error.");
  }
}

term.setCursorBlink(false);
