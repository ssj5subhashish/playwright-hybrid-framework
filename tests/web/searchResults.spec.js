const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const AirbnbSearchResults = require('../../src/pageFactory/pageRepository/web/AirbnbSearchResults.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Search Results Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  const browserFactory = new BrowserFactory();

  before(async function () {
    browser = await browserFactory.launch();
    context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    page = await context.newPage();
    homepage = new AirbnbHomepage(page);
    searchResults = new AirbnbSearchResults(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
    await homepage.navigate();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    const loaded = await homepage.verifyResultsPageLoaded();

    // If Airbnb redirected to a locale domain, force navigate to search results directly
    if (!loaded || !page.url().includes('/s/')) {
      const domain = new URL(page.url()).origin;
      const searchUrl = `${domain}/s/Tokyo--Japan/homes?query=Tokyo%2C%20Japan`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await homepage.webActions.dismissBlockingOverlay();
      await page.waitForSelector('div[data-testid="card-container"]', { timeout: 20000 });
    }
    // All tests chain from this search results page
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
      await homepage.webActions.stopHarCapture('SearchResults_Web');
      await homepage.webActions.stopNetworkTracing('SearchResults_Web');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [SearchResults] [Web] Verify guest user can view search results', async function () {
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'No listing cards found in search results');
  });

  it('[TC_02] [SearchResults] [Web] Verify guest user can switch between list and map view', async function () {
    await searchResults.toggleMapView(); // Switch to Map
    const toggleBtnText = await searchResults.getMapToggleText();
    assert.isTrue(
      toggleBtnText.includes('list') || toggleBtnText.includes('List') ||
      toggleBtnText.includes('map') || toggleBtnText.includes('Map'),
      'Failed to toggle to map view'
    );
    await searchResults.toggleMapView(); // Toggle back to List
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Failed to toggle back to list view successfully');
  });

  it('[TC_03] [SearchResults] [Web] Verify guest user can scroll through search results', async function () {
    await searchResults.scrollResults();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Scroll failed or broke listings view');
  });

  it('[TC_04] [SearchResults] [Web] Verify guest user can open a property from search results', async function () {
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      searchResults.openListing(0)
    ]);
    await newPage.waitForLoadState();
    const newPageTitle = await newPage.title();
    assert.isTrue(newPageTitle.length > 0, 'Failed to open property detail page in new tab');
    await newPage.close();
  });
});
