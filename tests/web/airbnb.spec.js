const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbSearchPage = require('../../src/pageFactory/pageRepository/web/AirbnbSearchPage.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');
const testLog = require('../../src/logger/logger.ts');

describe('[Web] Airbnb Guest Search Flow E2E Test Suite', function () {
  let page, browser, context;
  let airbnbPage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    browser = await browserFactory.launch();
    context = await browser.newContext({
      viewport: { width: 1600, height: 900 }
    });
    page = await context.newPage();
    airbnbPage = new AirbnbSearchPage(page);
    await airbnbPage.webActions.startNetworkTracing();
    await airbnbPage.webActions.startHarCapture();
  });

  beforeEach(async function () {
    await airbnbPage.navigate();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = await airbnbPage.webActions.takeScreenshot(testName);
      addContext(this, screenshotPath);
    }
  })

  after(async function () {
    try {
      if (airbnbPage && airbnbPage.webActions) {
        await airbnbPage.webActions.stopHarCapture(`GuestSearchFlow`).catch(err => console.error(err));
        await airbnbPage.webActions.stopNetworkTracing(`GuestSearchFlow`).catch(err => console.error(err));
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('Validate successful search for stays as a Guest user', async function () {
    await airbnbPage.searchDestination('Tokyo, Japan');
    await airbnbPage.selectDates(3, 7);
    await airbnbPage.addGuests(2, 1);
    await airbnbPage.clickSearch();
    const resultsLoaded = await airbnbPage.verifyResultsPageLoaded();
    assert.isTrue(resultsLoaded, 'Airbnb listings failed to load on the results page');
    const firstTitle = await airbnbPage.getFirstListingTitle();
    testLog.info(`[Validation] First Listing Found: "${firstTitle}"`);
    assert.isTrue(firstTitle.length > 0, "The first title is Empty");
  });
});
