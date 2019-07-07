#!/usr/bin/env node

const cmd = require('commander');
const packageJSON = require('../package.json');
const I18nextSpreadsheet = require('../src');

cmd
  .version(packageJSON.version, '-v, --version')
  .usage('<spreadsheet-id> [options]')
  .option(
    '-s, --credentials <s>',
    'Service Account credentials JSON data or file path'
  )
  .option('-p, --locales-path <p>', 'Locale files path')
  .option('-n, --newline', 'Locale files end with a newline')
  .parse(process.argv);

if (cmd.args.length < 1) {
  cmd.help();
}

cmd.spreadsheetId = cmd.args[0];

const i18nextSpreadsheet = new I18nextSpreadsheet(cmd);

try {
  i18nextSpreadsheet.start();
} catch (err) {
  console.error(err);
}
