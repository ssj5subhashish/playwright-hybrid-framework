const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const AirbnbSearchResults = require('../../src/pageFactory/pageRepository/web/AirbnbSearchResults.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Navigation Suite', function () {
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
    await homepage.navigate(); // Navigate once — each test does its own transition internally
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
      await homepage.webActions.stopHarCapture('Navigation_Web').catch(() => {});
      await homepage.webActions.stopNetworkTracing('Navigation_Web').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // T1: Navigate to results then click logo to return to homepage
  it('Verify guest user can navigate between Home and Search pages', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    let isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Failed to transition to search page');

    await homepage.clickLogoToHome(); // POM method — clicks Airbnb logo
    const title = await page.title();
    assert.isTrue(title.includes('Airbnb') || title.includes('Vacation Rentals'), 'Failed to return to Homepage');
  });

  // T2: Search then use browser back button — chains from T1 (on homepage)
  it('Verify guest user can use browser back navigation', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await page.goBack();
    await page.waitForTimeout(2000);
    const title = await page.title();
    assert.isTrue(title.includes('Airbnb') || title.includes('Vacation Rentals'), 'Back navigation failed');
  });

  // T3: Search then refresh the results page — chains from T2 (on homepage)
  it('Verify guest user can refresh search results without errors', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await page.reload();
    await homepage.webActions.dismissBlockingOverlay();
    await page.waitForTimeout(2000);
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Refreshing search results broke the page list');
  });
});
