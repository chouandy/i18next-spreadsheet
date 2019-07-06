const Promise = require('aigle');
const path = require('path');
const readline = require('readline');
const fs = Promise.promisifyAll(require('fs'));
const { google } = require('googleapis');

const TOKEN_FILENAME = 'token.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];

class GoogleAuth {
  constructor(credentialsPath) {
    this.credentialsPath = credentialsPath;
    this.tokenPath = `${path.dirname(credentialsPath)}/${TOKEN_FILENAME}`;
  }

  async authorize() {
    try {
      // Get credentials
      const content = await fs.readFileAsync(this.credentialsPath);
      const credentials = JSON.parse(content);

      // New oauth2 client
      const { client_secret, client_id, redirect_uris } = credentials.installed;
      this.oAuth2Client = new google.auth.OAuth2(
        client_id,
        client_secret,
        redirect_uris[0]
      );

      // Get token
      const token = await this.getToken();

      // Set token
      this.oAuth2Client.setCredentials(token);

      return this.oAuth2Client;
    } catch (err) {
      throw err;
    }
  }

  async getToken() {
    let token;
    try {
      // Get token cache
      const content = await fs.readFileAsync(this.tokenPath);
      token = JSON.parse(content);
    } catch (err) {
      // Get new token
      token = await this.getNewToken();
      // Cache new token
      fs.writeFileSync(this.tokenPath, JSON.stringify(token));
      console.log('Token stored to', this.tokenPath);
    }

    return token;
  }

  getNewToken() {
    const authUrl = this.oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise((resolve, reject) => {
      rl.question('Enter the code from that page here: ', code => {
        rl.close();
        this.oAuth2Client.getToken(code, (err, token) => {
          if (err) {
            console.error('Error while trying to retrieve access token', err);
            reject(err);
          } else resolve(token);
        });
      });
    });
  }
}

module.exports = GoogleAuth;
