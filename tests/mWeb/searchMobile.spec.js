const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Search Suite', function () {
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
      await homepage.webActions.stopHarCapture('Search_Mobile');
      await homepage.webActions.stopNetworkTracing('Search_Mobile');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Search] [MWeb] Verify guest user can search stays by destination on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load by destination on mobile');
  });

  it('[TC_02] [Search] [MWeb] Verify guest user can modify search criteria from search results on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await homepage.searchDestination('Osaka, Japan');
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load modified search on mobile');
  });

  it('[TC_03] [Search] [MWeb] Verify guest user can search stays using destination, dates, and guests on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.selectDates(3, 7);
    await homepage.addGuests(2, 1);
    await homepage.clickSearch();
    const resultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(resultsLoaded, 'Mobile search listings failed to load');
  });

  it('[TC_04] [Search] [MWeb] Verify guest user can search without selecting dates on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.addGuests(2, 0);
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load without selecting dates on mobile');
  });

  it('[TC_05] [Search] [MWeb] Verify guest user can search using flexible dates on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.selectFlexibleDates();
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load using flexible dates on mobile');
  });
});
