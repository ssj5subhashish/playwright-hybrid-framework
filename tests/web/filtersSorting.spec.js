const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const AirbnbSearchResults = require('../../src/pageFactory/pageRepository/web/AirbnbSearchResults.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Filters & Sorting Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  let searchResultsUrl;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launch();
    homepage = new AirbnbHomepage(page);
    searchResults = new AirbnbSearchResults(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();

    // Navigate and search ONCE — cache the results URL for all filter tests
    await homepage.navigate();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    const loaded = await homepage.verifyResultsPageLoaded();

    // If Airbnb redirected to a locale domain (e.g. airbnb.co.in), go directly to results
    if (!loaded || !page.url().includes('/s/')) {
      const domain = new URL(page.url()).origin;
      const searchUrl = `${domain}/s/Tokyo--Japan/homes?query=Tokyo%2C%20Japan`;
      await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await homepage.webActions.dismissBlockingOverlay();
      await page.waitForSelector('div[data-testid="card-container"]', { timeout: 20000 });
    }

    searchResultsUrl = page.url();
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
      await homepage.webActions.stopHarCapture('FiltersSorting_Web');
      await homepage.webActions.stopNetworkTracing('FiltersSorting_Web');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // Helper: reload the cached search results page (fast — no homepage visit needed)
  async function goToResults() {
    await page.goto(searchResultsUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await homepage.webActions.dismissBlockingOverlay();
    await page.waitForSelector('div[data-testid="card-container"]', { timeout: 15000 });
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
  }

  it('[TC_01] [FiltersSorting] [Web] Verify guest user can apply price filter', async function () {
    await goToResults();
    await searchResults.applyPriceFilter('800', '150000');
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Applying price filter failed or broke results');
  });

  it('[TC_02] [FiltersSorting] [Web] Verify guest user can apply room type filter', async function () {
    await goToResults();
    await searchResults.applyRoomTypeFilter();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Applying room type filter failed');
  });

  it('[TC_03] [FiltersSorting] [Web] Verify guest user can apply amenities filter', async function () {
    await goToResults();
    await searchResults.applyAmenitiesFilter();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Applying amenities filter failed');
  });

  it('[TC_04] [FiltersSorting] [Web] Verify guest user can apply multiple filters', async function () {
    await goToResults();
    await searchResults.applyRoomTypeFilter();
    await searchResults.applyAmenitiesFilter();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Applying multiple filters simultaneously failed');
  });

  it('[TC_05] [FiltersSorting] [Web] Verify guest user can clear all applied filters', async function () {
    await goToResults();
    await searchResults.applyRoomTypeFilter();
    await searchResults.clearAllFilters();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Clearing all filters broke the results list');
  });

  it('[TC_06] [FiltersSorting] [Web] Verify guest user can sort search results', async function () {
    await goToResults();
    await searchResults.sortResults();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Sorting search results failed');
  });
});
