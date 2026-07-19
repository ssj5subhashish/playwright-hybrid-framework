const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobilePropertyDetails = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobilePropertyDetails.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Booking Suite', function () {
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
      await homepage.webActions.stopHarCapture('Booking_Mobile').catch(() => {});
      await homepage.webActions.stopNetworkTracing('Booking_Mobile').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Booking] [MWeb] Verify guest user can initiate reservation and is prompted to log in on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    const list = page.locator('div[data-testid="card-container"]').first();
    await list.click({ force: true });
    await page.waitForTimeout(2000);

    const details = new AirbnbMobilePropertyDetails(page);
    await details.clickReserveButton();

    const isLoginPrompt = await page.locator('input[id="email"], input[id="phoneNumber"], div[data-testid="modal-container"]').first().isVisible();
    assert.isTrue(isLoginPrompt, 'Login prompt did not appear when reserving as a guest on mobile');
  });
});
