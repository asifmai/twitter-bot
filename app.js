const pupHelper = require('./puppeteerhelper');
const fs = require('fs');
const urls = require('./urls');

(async () => {
  const results = [];
  const browser = await pupHelper.launchBrowser();

  for (let i = 0; i < urls.length; i++) {
    console.log(`${i+1}/${urls.length} - Crawling...`);
    const result = {};
    const page = await pupHelper.launchPage(browser);
    await page.goto(urls[i], {timeout: 0, waitUntil: 'load'});
    await page.waitForSelector('div[aria-label][role="group"]');
    const tagText = await pupHelper.getAttr('div[aria-label][role="group"]', 'aria-label', page);

    const repliesRegEx = /\d+(?=\s*replies)/gi;
    const retweetsRegEx = /\d+(?=\s*retweets)/gi;
    const likesRegEx = /\d+(?=\s*likes)/gi;
    
    result.url = urls[i];
    if (repliesRegEx.test(tagText)) result.replies = tagText.match(repliesRegEx)[0].trim();
    if (retweetsRegEx.test(tagText)) result.retweets = tagText.match(retweetsRegEx)[0].trim();
    if (likesRegEx.test(tagText)) result.likes = tagText.match(likesRegEx)[0].trim();

    if (result.replies && result.retweets && result.likes) results.push(result);

    await page.close();
  }

  fs.writeFileSync('results.json', JSON.stringify(results));
  await browser.close();
})()