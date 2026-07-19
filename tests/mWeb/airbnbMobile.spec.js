const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileSearchPage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchPage.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');
const testLog = require('../../src/logger/logger.ts');

describe('[MWeb] Airbnb Mobile Guest Search Flow E2E Test Suite', function () {
  let page, browser, context;
  let airbnbMobilePage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    // Launch simulated mobile viewport (iPhone 12)
    [page, browser, context] = await browserFactory.launchMobileBrowser(config.environment.airbnbUrl, 'iPhone 12');
    airbnbMobilePage = new AirbnbMobileSearchPage(page);
    await airbnbMobilePage.webActions.startNetworkTracing();
    await airbnbMobilePage.webActions.startHarCapture();
  });

  beforeEach(async function () {
    await airbnbMobilePage.navigate();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = await airbnbMobilePage.webActions.takeScreenshot(testName);
      addContext(this, screenshotPath);
    }
  });

  after(async function () {
    try {
      if (airbnbMobilePage && airbnbMobilePage.webActions) {
        await airbnbMobilePage.webActions.stopHarCapture(`GuestSearchFlow_Mobile`).catch(err => console.error(err));
        await airbnbMobilePage.webActions.stopNetworkTracing(`GuestSearchFlow_Mobile`).catch(err => console.error(err));
      }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('Validate successful search for stays on mobile viewport as a guest user', async function () {
    await airbnbMobilePage.closeInstallApp();
    await airbnbMobilePage.searchDestination('Tokyo, Japan');
    await airbnbMobilePage.selectDates(3, 7);
    await airbnbMobilePage.addGuests(2, 1);
    await airbnbMobilePage.clickSearch();
    const resultsLoaded = await airbnbMobilePage.verifyResultsPageLoaded();
    assert.isTrue(resultsLoaded, 'Airbnb mobile listings failed to load on the results page');
    const firstTitle = await airbnbMobilePage.getFirstListingTitle();
    testLog.info(`[Validation Mobile] First Listing Found: "${firstTitle}"`);
    assert.isTrue(firstTitle.length > 0, "The first mobile title is Empty");
  });
});
