const { WebhookClient } = require('discord.js');
const al = require('@dumpy/andylib');
const l = new al.logger()
require('dotenv').config()
const client = new WebhookClient({ id: process.env.ID, token: process.env.TOKEN });
// import puppeteer
const puppeteer = require('puppeteer');
// scrape https://www.gsmarena.com/news.php3
async function fetch() {
    // launch puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.gsmarena.com/news.php3');
    // get all the news titles
    const titles = await page.evaluate(() => {
        const news = document.querySelectorAll('.news-item');
        const titles = [];
        news.forEach((item) => {
            titles.push(item.querySelector('h3').innerText);
        })
        return titles
    });
    const bodys = await page.evaluate(() => {
        const news = document.querySelectorAll('.news-item');
        const bodys = [];
        news.forEach((item) => {
            bodys.push(item.querySelector('p').innerText);
        })
        return bodys
    })
    const links = await page.evaluate(() => {
        const news = document.querySelectorAll('.news-item');
        const links = [];
        news.forEach((item) => {
            links.push(item.querySelector('a').href);
        })
        return links
    })
    const realme = titles.filter((title) => { return title.includes('Realme') })
    console.log(realme);
    // get the links for the realme
    const realmeLinks = links.filter((link) => { return link.includes('realme') })
    console.log(realmeLinks);
    await browser.close();
    return realmeLinks;
}
let oldLinks = [];
 l.info('Starting');
    fetch().then((links) => {
        // check if there are any new links
        const newLinks = links.filter((link) => !oldLinks.includes(link));
        if (newLinks.length > 0) {
            // send the new links
            client.send(`Latest News: ${newLinks.join(' ')}`);
            l.debug('Sent new links');
        } else {
            l.error("No new links");
            return;
        }
        // set the old links to the new links
        oldLinks = links;
    }).catch((err) => console.log(err));

setInterval(() => {
    l.info('Starting');
    fetch().then((links) => {
        // check if there are any new links
        const newLinks = links.filter((link) => !oldLinks.includes(link));
        if (newLinks.length > 0) {
            // send the new links
            client.send(`Latest News: ${newLinks.join(' ')}`);
            l.debug('Sent new links');
        } else {
            l.error("No new links");
            return;
        }
        // set the old links to the new links
        oldLinks = links;
    }).catch((err) => console.log(err));
}, 900000)
