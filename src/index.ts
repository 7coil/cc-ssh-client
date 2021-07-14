import {
  Packet,
  PacketType,
  TerminalDisconnectPacket,
  TerminalInstcPacket,
  TerminalInstpPacket,
  TerminalInstxPacket,
} from "./Packet";

const REMOTE = "ws://127.0.0.1:8080/";

const [websocket, errorMessage] = http.websocket(REMOTE);

if (websocket) {
  websocket.send("Hello!");

  let programRunning = true;

  while (programRunning) {
    const e = os.pullEvent();
    const [event] = e;

    if (event === "websocket_message") {
      const [, url, message] = e as os.Events.WebsocketMessageEvent;

      if (url === REMOTE) {
        const packet = Packet.parse(message);

        if (packet.type === PacketType.inst_p) {
          // inst_p instructs the tty to print text.
          const terminalInstpPacket = packet as TerminalInstpPacket;
          term.write(terminalInstpPacket.payload.s);
        } else if (packet.type === PacketType.inst_x) {
          // inst_x is special printable characters
          const terminalInstxPacket = packet as TerminalInstxPacket;
          const { flag } = terminalInstxPacket.payload;
          const [x, y] = term.getCursorPos();
          if (flag === "\n") {
            print();
          } else if (flag === '\r') {
            term.setCursorPos(1, y);
          } else if (flag === "\b") {
            const [width, height] = term.getSize();
            if (x === 0) {
              term.setCursorPos(width - 1, y - 1);
            } else {
              term.setCursorPos(x - 1, y);
            }
          } else if (flag === "\x07") {
            const speaker = peripheral.find("speaker");
            speaker.playSound('minecraft:entity.player.levelup')
          }
        } else if (packet.type === PacketType.inst_c) {
          // inst_c is for cursor operations.
          const terminalInstcPacket = packet as TerminalInstcPacket;
          const {flag, params} = terminalInstcPacket.payload
          
          if (flag === 'K') {
            const [param] = params;
            const [x, y] = term.getCursorPos();
            const [width, height] = term.getSize();

            if (param === 0) {
              for (let i = x; i < width; i++) {
                term.setCursorPos(i, y)
                term.write(' ')
              }
              term.setCursorPos(x, y);
            } else if (param === 1) {
              for (let i = 0; i <= x; i++) {
                term.setCursorPos(i, y)
                term.write(' ')
              }
              term.setCursorPos(x, y);
            } else if (param === 2) {
              term.clearLine();
            } else {
              term.clearLine();
            }
          } else if (flag === 'H') {
            const [x, y] = params;

            if (y) {
              term.setCursorPos(y, x);
            } else {
              term.setCursorPos(1, 1);
            }
          } else if (flag === 'J') {
            const [param] = params;

            if (param === 2) {
              term.clear()
            }
          } else if (flag === 'A' || flag === 'B' || flag === 'C' || flag === 'D') {
            let [x, y] = term.getCursorPos();
            const [amount] = params;
            if (flag === 'A') y -= amount
            if (flag === 'B') y += amount
            if (flag === 'C') x += amount
            if (flag === 'D') x -= amount
            term.setCursorPos(x, y)
          }

        } else if (packet.type === PacketType.disconnect) {
          // Disconnected. Shame.
          const terminalDisconnectPacket = packet as TerminalDisconnectPacket;
          print(terminalDisconnectPacket.payload.s)
          programRunning = false;
        }
      }
    } else if (event === "key") {
      const [, keycode, held] = e as os.Events.KeyEvent;
      const packet = new Packet(PacketType.keypress, {
        kc: keycode,
        held,
      });

      websocket.send(packet.encode());
    }
  }
} else {
  error(errorMessage || "Unknown error.");
}
