const { WebhookClient } = require("discord.js");
const al = require("@dumpy/andylib");
const l = new al.logger();
require("dotenv").config();
const config = require("./config.json");
const client = new WebhookClient({
  id: process.env.ID,
  token: process.env.TOKEN,
});
const axios = require("axios");
const cheerio = require("cheerio");

async function fetch() {
  // Make an HTTP request to the news page on GSMArena's website
  const response = await axios.get("https://www.gsmarena.com/news.php3");

  // Parse the HTML content of the page using Cheerio
  const $ = cheerio.load(response.data);

  // Select all of the news items on the page
  const newsItems = $(".news-item");

  // Iterate over each news item and extract the data that we want
  const data = [];
  newsItems.each((index, item) => {
    const title = $(item).find(".news-item a h3").text();
    const link = `https://gsmarena.com/${$(item)
      .find(".news-item a")
      .attr("href")}`;

    data.push({
      title,
      link,
    });
  });

  return data.filter((item) => item.title.includes("Realme"));
}
let oldLinks = [];
l.info("Starting");
fetch()
  .then((data) => {
    console.log(data);
    const links = data.map((item) => item.link);
    // check if there are any new links
    const newLinks = links.filter((link) => !oldLinks.includes(link));
    if (newLinks.length > 0) {
      // send the new links
      client.send(`${config.text} ${newLinks.join(" ")}`);
      l.debug("Sent new links");
    } else {
      l.error("No new links");
      return;
    }
    // set the old links to the new links
    oldLinks = links;
  })
  .catch((err) => console.log(err));

setInterval(() => {
  l.info("Starting");
  fetch()
    .then((data) => {
      const links = data.map((item) => item.link);
      // check if there are any new links
      const newLinks = links.filter((link) => !oldLinks.includes(link));
      if (newLinks.length > 0) {
        // send the new links
        client.send(`Latest News: ${newLinks.join(" ")}`);
        l.debug("Sent new links");
      } else {
        l.error("No new links");
        return;
      }
      // set the old links to the new links
      oldLinks = links;
    })
    .catch((err) => console.log(err));
}, 900000);
