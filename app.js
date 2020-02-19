const pupHelper = require('./puppeteerhelper');

const fetchDetails = async (url) => {
  try {
    console.log(`Crawling from ${url}...`);
    const result = {};
    const browser = await pupHelper.launchBrowser();
    const page = await pupHelper.launchPage(browser);
    await page.goto(url, {timeout: 0, waitUntil: 'load'});
    await page.waitForSelector('div[aria-label][role="group"]');
    const tagText = await pupHelper.getAttr('div[aria-label][role="group"]', 'aria-label', page);
  
    const repliesRegEx = /\d+(?=\s*replies)/gi;
    const retweetsRegEx = /\d+(?=\s*retweets)/gi;
    const likesRegEx = /\d+(?=\s*likes)/gi;
    
    result.url = url;
    if (repliesRegEx.test(tagText)) result.replies = tagText.match(repliesRegEx)[0].trim();
    if (retweetsRegEx.test(tagText)) result.retweets = tagText.match(retweetsRegEx)[0].trim();
    if (likesRegEx.test(tagText)) result.likes = tagText.match(likesRegEx)[0].trim();
  
    await page.close();
    await browser.close();
    return result;
  } catch (error) {
    console.log(`fetchDetails [${url}] Error: ${error.message}`);
    return error;
  }
}

fetchDetails('https://twitter.com/coliegestudent/status/1218017231344472064').then(res => console.log(res));