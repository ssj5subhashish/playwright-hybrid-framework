const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Homepage Suite', function () {
  let page, browser, context;
  let homepage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    browser = await browserFactory.launch();
    context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    page = await context.newPage();
    homepage = new AirbnbHomepage(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
    // Navigate once — tests chain from this point
    await homepage.navigate();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = await homepage.webActions.takeScreenshot(testName);
      addContext(this, screenshotPath);
    }
  });

  after(async function () {
    try {
      await homepage.webActions.stopHarCapture('Homepage_Web');
      await homepage.webActions.stopNetworkTracing('Homepage_Web');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Homepage] [Web] Verify guest user can launch Airbnb homepage', async function () {
    const title = await page.title();
    assert.isTrue(title.includes('Airbnb') || title.includes('Vacation Rentals'), 'Homepage title does not include Airbnb');
  });

  it('[TC_02] [Homepage] [Web] Verify guest user can navigate using the homepage search', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load from homepage search');
  });
});
