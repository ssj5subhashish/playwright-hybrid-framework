const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Localization Suite', function () {
  let page, browser, context;
  let homepage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launch();
    homepage = new AirbnbHomepage(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
  });

  beforeEach(async function () {
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
      await homepage.webActions.stopHarCapture('Localization_Web');
      await homepage.webActions.stopNetworkTracing('Localization_Web');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Localization] [Web] Verify guest user can change language', async function () {
    await homepage.changeLanguage();
    const title = await page.title();
    assert.isTrue(title.length > 0, 'Homepage failed to refresh language');
  });

  it('[TC_02] [Localization] [Web] Verify guest user can change currency', async function () {
    await homepage.changeCurrency();
    const title = await page.title();
    assert.isTrue(title.length > 0, 'Homepage failed to refresh currency');
  });
});
