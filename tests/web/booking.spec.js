const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const AirbnbSearchResults = require('../../src/pageFactory/pageRepository/web/AirbnbSearchResults.ts');
const AirbnbPropertyDetails = require('../../src/pageFactory/pageRepository/web/AirbnbPropertyDetails.ts');
const AirbnbAuth = require('../../src/pageFactory/pageRepository/web/AirbnbAuth.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Booking Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  let auth;
  const browserFactory = new BrowserFactory();

  before(async function () {
    browser = await browserFactory.launch();
    context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    page = await context.newPage();
    homepage = new AirbnbHomepage(page);
    searchResults = new AirbnbSearchResults(page);
    auth = new AirbnbAuth(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
    await homepage.navigate(); // Navigate once — test builds from here
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
      await homepage.webActions.stopHarCapture('Booking_Web').catch(() => {});
      await homepage.webActions.stopNetworkTracing('Booking_Web').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // Single test: full flow from homepage → search → open listing → reserve → verify login prompt
  it('Verify guest user can initiate reservation and is prompted to log in', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    const [detailPage] = await Promise.all([
      context.waitForEvent('page'),
      searchResults.openListing(0)
    ]);
    await detailPage.waitForLoadState();
    const details = new AirbnbPropertyDetails(detailPage);

    await details.clickReserveButton();
    const isLoginVisible = await details.verifyLoginPromptVisible();
    assert.isTrue(isLoginVisible, 'Guest was not prompted to authenticate when initiating booking reservation');
    await detailPage.close();
  });
});
