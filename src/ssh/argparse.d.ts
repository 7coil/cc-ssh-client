interface ParseOpt {
  args(count: string | number): ParseOpt;
  description(description: string): ParseOpt;
  default(value: any): ParseOpt;
  // require_command(required: boolean): ParseOpt;
}

interface Option extends ParseOpt {}
interface Argument extends ParseOpt {}
interface Flag extends ParseOpt {}

/**
 * @customConstructor ____argparse
 **/
declare class Argparse {
  constructor();
  usage_max_width(width: number): void;
  help_description_margin(width: number): void;
  help_usage_margin(width: number): void;
  argument(arg: string, description?: string, def?: any): Argument;
  option(arg: string, description?: string, def?: any): Option;
  flag(arg: string, description?: string): Flag;
  parse<Options>(argv?: string[]): Options;
}

export default Argparse