import { CommandsOptions } from './interface';

const COMMANDS_CONSTANT: CommandsOptions = {
  pm: 'npm',
};

exports.commands = {
  add: {
    usage: "install a plugin in an already created project",
    lifecycleEvents: ['add'],
    options: {
      "--plugin <plugin>": {
        usage: "Specify a plugin name",
        shortcut: "n",
      },
      "--pm [pm]": {
        usage: "Specify a management tool",
        shortcut: "p",
        config: {
          default: COMMANDS_CONSTANT['pm'],
        },
      },
    },
  },
};
