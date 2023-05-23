#!/usr/bin/env node

const { program } = require('commander');
const packageJSON = require('../package.json');
const I18nextSpreadsheet = require('../src');

program
  .version(packageJSON.version, '-v, --version')
  .usage('<spreadsheet-id> [options]')
  .option('-s, --credentials <s>', 'Service Account credentials JSON data or file path')
  .option('-p, --locales-path <p>', 'Locale files path')
  .option('-n, --newline', 'Locale files end with a newline')
  .parse(process.argv);

if (program.args.length < 1) {
  program.help();
}

const options = {
  spreadsheetId: program.args[0],
  ...program.opts(),
};

const i18nextSpreadsheet = new I18nextSpreadsheet(options);

try {
  i18nextSpreadsheet.start();
} catch (err) {
  console.error(err);
}
