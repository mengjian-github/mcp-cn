import { VALID_CLIENTS } from '../constants';
import chalk from 'chalk';

export async function list(subcommand: string | undefined) {
  switch (subcommand) {
    case 'clients':
    default:
      console.log(chalk.bold('Available clients:'));
      VALID_CLIENTS.forEach((client) => console.log(`  ${chalk.green(client)}`));
      break;
  }
}
