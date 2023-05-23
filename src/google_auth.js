const Promise = require('aigle');
const path = require('path');
const http = require('http');
const fs = Promise.promisifyAll(require('fs'));
const { google } = require('googleapis');
const destroyer = require('server-destroy');
const open = require('open');
const url = require('url');

const TOKEN_FILENAME = 'token.json';
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const REDIRECT_URI = `http://localhost:${process.env.PORT ? process.env.PORT : '8080'}`;

class GoogleAuth {
  constructor(credentialsPath) {
    this.credentialsPath = credentialsPath;
    this.tokenPath = `${path.dirname(credentialsPath)}/${TOKEN_FILENAME}`;
  }

  async authorize() {
    // Get credentials
    const content = await fs.readFileAsync(this.credentialsPath);
    const credentials = JSON.parse(content);

    // New oauth2 client
    const { client_secret, client_id } = credentials.installed;
    this.oAuth2Client = new google.auth.OAuth2(client_id, client_secret, REDIRECT_URI);

    // Get token
    const token = await this.getToken();

    // Set token
    this.oAuth2Client.setCredentials(token);

    return this.oAuth2Client;
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
    const authUrl = this.oAuth2Client.generateAuthUrl({ access_type: 'offline', scope: SCOPES });

    return new Promise((resolve, reject) => {
      const server = http
        .createServer(async (req, res) => {
          try {
            const qs = new url.URL(req.url, REDIRECT_URI).searchParams;
            const code = qs.get('code');
            console.log(`Code is ${code}`);
            res.end('Authentication successful! Please return to the console.');
            server.destroy();

            const { tokens } = await this.oAuth2Client.getToken(code);
            resolve(tokens);
          } catch (e) {
            reject(e);
          }
        })
        .listen(8080, () => {
          open(authUrl, { wait: false }).then((cp) => cp.unref());
        });

      destroyer(server);
    });
  }
}

module.exports = GoogleAuth;
