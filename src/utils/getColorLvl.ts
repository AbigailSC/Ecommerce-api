import chalk from 'chalk';

export const getColorByLvl = (lvl: string): string => {
  let styledLvl = lvl;
  if (lvl === 'error') {
    styledLvl = chalk.red(`[${lvl.toUpperCase()}]`);
  }
  if (lvl === 'warn') {
    styledLvl = chalk.yellow(`[${lvl.toUpperCase()}]`);
  }
  if (lvl === 'info') {
    styledLvl = chalk.green(`[${lvl.toUpperCase()}]`);
  }
  if (lvl === 'http') {
    styledLvl = chalk.magenta(`[${lvl.toUpperCase()}]`);
  }
  if (lvl === 'debug') {
    styledLvl = chalk.blue(`[${lvl.toUpperCase()}]`);
  }
  return styledLvl;
};
