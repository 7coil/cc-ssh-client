import Argparse from "./argparse";

interface Options {
  destination: string;
  websocket: string;
  username: string;
  verbose: boolean;
}

const RECOGNISED_HELP_FLAGS = [
  "--help",
  "-h",
  "-?",
]

const parsearg = (argv: string[]): Options => {
  const [initialTerminalWidth, initialTerminalHeight] = term.getSize();

  const parser = new Argparse();
  parser.usage_max_width(initialTerminalWidth);
  parser.help_description_margin(11);
  parser.help_usage_margin(0);
  parser
    .argument("destination")
    .description("Hostname/IP");
  parser
    .option("-p --websocket")
    .description("ComputerCraft SSH websocket proxy server")
    .default("ws://127.0.0.1:8080");
  parser
    .option("-u --username")
    .description("Username of the connection")
  parser.flag("-v")
    .description("Display all lua 'argparse' arguments");

  const parsed = parser.parse<Options>(argv);

  const [username, destination] = parsed.destination.split('@')

  if (username && destination) {
    parsed.username = username;
    parsed.destination = destination;
  }

  if (parsed.verbose)
    Object.entries(parsed).forEach(([k, v]) => print(`${k} - ${v}`));

  return parsed;
};

export { parsearg };
