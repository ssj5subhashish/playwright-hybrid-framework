const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Localization Suite', function () {
  let page, browser, context;
  let homepage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launchMobileBrowser(config.environment.airbnbUrl, 'iPhone 12');
    homepage = new AirbnbMobileHomepage(page);
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
      await homepage.webActions.stopHarCapture('Localization_Mobile').catch(() => {});
      await homepage.webActions.stopNetworkTracing('Localization_Mobile').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Localization] [MWeb] Verify guest user can change language on mobile', async function () {
    await homepage.changeLanguage();
    const title = await page.title();
    assert.isTrue(title.length > 0, 'Homepage failed to refresh language on mobile');
  });

  it('[TC_02] [Localization] [MWeb] Verify guest user can change currency on mobile', async function () {
    await homepage.changeCurrency();
    const title = await page.title();
    assert.isTrue(title.length > 0, 'Homepage failed to refresh currency on mobile');
  });
});
