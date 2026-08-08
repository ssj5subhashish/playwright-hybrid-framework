const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobileSearchResults = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchResults.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Search Results Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launchMobileBrowser(config.environment.airbnbUrl, 'iPhone 12');
    homepage = new AirbnbMobileHomepage(page);
    searchResults = new AirbnbMobileSearchResults(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
  });

  beforeEach(async function () {
    await homepage.navigate();
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();
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
      await homepage.webActions.stopHarCapture('SearchResults_Mobile');
      await homepage.webActions.stopNetworkTracing('SearchResults_Mobile');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [SearchResults] [MWeb] Verify guest user can view search results on mobile', async function () {
    const title = await homepage.getFirstListingTitle();
    assert.isTrue(title.length > 0, 'No listings found in mobile search results');
  });

  it('[TC_02] [SearchResults] [MWeb] Verify guest user can switch between list and map view on mobile', async function () {
    await searchResults.toggleMapView();
    const toggleBtnText = await searchResults.getMapToggleText();
    assert.isTrue(
      toggleBtnText.includes('list') || toggleBtnText.includes('List') ||
      toggleBtnText.includes('map') || toggleBtnText.includes('Map'),
      'Failed to toggle to map view on mobile'
    );
    await searchResults.toggleMapView();
    const firstTitle = await homepage.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Failed to toggle back to list view successfully on mobile');
  });

  it('[TC_03] [SearchResults] [MWeb] Verify guest user can scroll through search results on mobile', async function () {
    await searchResults.scrollResults();
    const firstTitle = await homepage.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Scroll failed or broke listings view on mobile');
  });

  it('[TC_04] [SearchResults] [MWeb] Verify guest user can open a property from search results on mobile', async function () {
    await searchResults.openListing(0);
    const title = await page.title();
    assert.isTrue(title.length > 0, 'Failed to open property details page on mobile');
  });
});
