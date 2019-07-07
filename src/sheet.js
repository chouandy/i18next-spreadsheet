const Promise = require('aigle');
const _ = require('lodash');
const fs = Promise.promisifyAll(require('fs'));
const { google } = require('googleapis');

const { convertNumberToColumnName } = require('./utils');

// New google sheets v4
const sheets = google.sheets('v4');
Promise.promisifyAll(sheets.spreadsheets);

class Sheet {
  constructor({ sheetInfo, auth, spreadsheetId, localesPath, newline }) {
    this.sheetInfo = sheetInfo;
    this.name = sheetInfo.properties.title;
    this.columnName = convertNumberToColumnName(
      sheetInfo.properties.gridProperties.columnCount
    );

    this.auth = auth;
    this.spreadsheetId = spreadsheetId;
    this.localesPath = localesPath;
    this.newline = newline;

    this.headers = [];
    this.rows = [];
    this.localesMap = {};
  }

  async getHeadersAndRows() {
    const { auth, spreadsheetId } = this;

    const resp = await sheets.spreadsheets.values.getAsync({
      auth,
      spreadsheetId,
      range: `${this.name}!A1:${this.columnName}`,
    });

    this.headers = resp.data.values[0];
    this.rows = resp.data.values.slice(1);
  }

  async convertRowsToLocalesMap() {
    // New locale map
    for (let i = 1; i < this.headers.length; i++) {
      let locale = this.headers[i];
      this.localesMap[locale] = {};
    }

    // Set locale map
    for (let row of this.rows) {
      let key = row[0];
      for (let i = 1; i < this.headers.length; i++) {
        let locale = this.headers[i];
        _.set(this.localesMap[locale], key, row[i] || '');
      }
    }
  }

  async writeLocalesMapToFiles() {
    return Promise.resolve(this.localesMap).each((content, locale) => {
      let localePath = `${this.localesPath}/${locale}`;
      fs.mkdirSync(localePath, { recursive: true });

      let localeFile = `${localePath}/${this.name}.json`;
      content = JSON.stringify(content, null, 2);
      if (this.newline) content = content + '\n';
      fs.writeFileSync(localeFile, content);
    });
  }
}

module.exports = Sheet;
