import { findBackground, findForeground } from "./colourMapping";
import { logger } from "./logger";
import {
  Packet,
  PacketType,
  TerminalDisconnectPacket,
  TerminalInstcPacket,
  TerminalInstpPacket,
  TerminalInstxPacket,
} from "./Packet";

const packetHandler = {
  /**
   * Handle the terminal packet.
   * @param packet The packet of information
   */
  handlePacket(packet: Packet): void {
    if (packet.type === PacketType.inst_p)
      this.inst_p(packet as TerminalInstpPacket);
    if (packet.type === PacketType.inst_o) this.inst_o(packet as Packet);
    if (packet.type === PacketType.inst_x)
      this.inst_x(packet as TerminalInstxPacket);
    if (packet.type === PacketType.inst_c)
      this.inst_c(packet as TerminalInstcPacket);
    if (packet.type === PacketType.inst_e) this.inst_e(packet as Packet);
    if (packet.type === PacketType.inst_H) this.inst_H(packet as Packet);
    if (packet.type === PacketType.inst_P) this.inst_P(packet as Packet);
    if (packet.type === PacketType.inst_U) this.inst_U(packet as Packet);
    if (packet.type === PacketType.disconnect)
      this.disconnect(packet as TerminalDisconnectPacket);
  },

  inst_p(packet: TerminalInstpPacket): void {
    // inst_p instructs the tty to print text.
    const terminalInstpPacket = packet as TerminalInstpPacket;
    term.write(terminalInstpPacket.payload.s);
  },
  inst_o(packet: Packet): void {},
  inst_x(packet: TerminalInstxPacket): void {
    // inst_x is special printable characters
    const terminalInstxPacket = packet as TerminalInstxPacket;
    const { flag } = terminalInstxPacket.payload;
    const [x, y] = term.getCursorPos();
    if (flag === "\n") {
      print();
    } else if (flag === "\r") {
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
      speaker.playSound("minecraft:block.bell.use");
    } else if (flag === "\x00") {
      // write(' ')
    }
  },
  inst_c(packet: TerminalInstcPacket): void {
    // inst_c is for cursor operations.
    const terminalInstcPacket = packet as TerminalInstcPacket;
    const { flag, params } = terminalInstcPacket.payload;

    if (flag === "K") {
      const [param] = params;
      const [x, y] = term.getCursorPos();
      const [width, height] = term.getSize();

      if (param === 0) {
        for (let i = x; i <= width; i++) {
          term.setCursorPos(i, y);
          term.write(" ");
        }
        term.setCursorPos(x, y);
      } else if (param === 1) {
        for (let i = 0; i <= x; i++) {
          term.setCursorPos(i, y);
          term.write(" ");
        }
        term.setCursorPos(x, y);
      } else if (param === 2) {
        term.clearLine();
      } else {
        term.clearLine();
      }
    } else if (flag === "H") {
      const [x, y] = params;

      if (y) {
        term.setCursorPos(y, x);
      } else {
        term.setCursorPos(1, 1);
      }
    } else if (flag === "J") {
      const [param] = params;

      const [currentX, currentY] = term.getCursorPos();
      const [maxX, maxY] = term.getSize();

      // Clear from cursor until end of screen.
      if (param === 0) {
        // Clear rest of current line
        for (let i = currentX; i <= maxX; i++) {
          term.setCursorPos(i, currentY);
          term.write(" ");
        }
        for (let i = (currentY + 1); i <= maxY; i++) {
          term.setCursorPos(currentX, i);
          term.clearLine()
        }
        term.setCursorPos(currentX, currentY)
      }
      if (param === 2) {
        term.clear();
      }
      if (typeof param !== 'number') {
        term.clear();
      }
    } else if (flag === "A" || flag === "B" || flag === "C" || flag === "D" || flag === "E" || flag === "F" || flag === "G" ) {
      let [x, y] = term.getCursorPos();
      const [amount] = params;
      if (flag === "A") y -= amount;
      if (flag === "B") y += amount;
      if (flag === "C") x += amount;
      if (flag === "D") x -= amount;
      if (flag === "E") {
        x = 1;
        y += amount;
      };
      if (flag === "F") {
        x = 1;
        y -= amount;
      }
      if (flag === "G") {
        x = amount;
      }
      term.setCursorPos(x, y);
    } else if (flag === "m") {
      params.forEach((param) => {
        const newBackground = findBackground(param)
        const newForeground = findForeground(param)
        if (param === 0) {
          term.setBackgroundColour(colours.black)
          term.setTextColour(colours.white);
        } else if (newBackground) {
          term.setBackgroundColor(newBackground)
        } else if (newForeground) {
          term.setTextColor(newForeground)
        }
      })
    }
  },
  inst_e(packet: Packet): void {},
  inst_H(packet: Packet): void {},
  inst_P(packet: Packet): void {},
  inst_U(packet: Packet): void {},

  disconnect(packet: TerminalDisconnectPacket): void {
    const terminalDisconnectPacket = packet as TerminalDisconnectPacket;
    logger.error("Disconnected: " + terminalDisconnectPacket.payload.s);
    os.exit(1);
  },
};

export default packetHandler;
