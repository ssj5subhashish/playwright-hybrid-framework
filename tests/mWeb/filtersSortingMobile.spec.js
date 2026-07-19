const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobileSearchResults = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchResults.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Filters & Sorting Suite', function () {
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
      await homepage.webActions.stopHarCapture('FiltersSorting_Mobile').catch(() => {});
      await homepage.webActions.stopNetworkTracing('FiltersSorting_Mobile').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('Verify guest user can apply price filter on mobile', async function () {
    await searchResults.applyPriceFilter('50', '250');
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Price filter did not return results on mobile');
  });

  it('Verify guest user can apply room type filter on mobile', async function () {
    await searchResults.applyRoomTypeFilter();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Room type filter did not return results on mobile');
  });

  it('Verify guest user can apply amenities filter on mobile', async function () {
    await searchResults.applyAmenitiesFilter();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Amenities filter did not return results on mobile');
  });

  it('Verify guest user can apply multiple filters on mobile', async function () {
    await searchResults.applyRoomTypeFilter();
    await searchResults.applyAmenitiesFilter();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Multiple filters did not return results on mobile');
  });

  it('Verify guest user can clear all applied filters on mobile', async function () {
    await searchResults.applyRoomTypeFilter();
    await searchResults.clearAllFilters();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Clearing filters broke the results view on mobile');
  });

  it('Verify guest user can sort search results on mobile', async function () {
    await searchResults.sortResults();
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Sorting did not execute successfully on mobile');
  });
});
