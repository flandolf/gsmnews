# GSMScraper
Discord webhook to fetch news from GSMArena.
Runs every 10 mins. (Can be changed.)
## How to use
- Clone this repo
- Rename `.env.SAMPLE` to `.env` and fill in the required info (`ID` and `TOKEN`)
- Run the app using `node index.js`
- (optional) use a process manager like pm2.
## Libraries
- [Discord.js](https://discord.js.org/#/)
- [Puppeteer](https://npmjs.com/package/puppeteer)
