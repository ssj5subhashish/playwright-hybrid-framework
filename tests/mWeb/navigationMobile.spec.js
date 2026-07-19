const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobileSearchResults = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchResults.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Navigation Suite', function () {
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
      await homepage.webActions.stopHarCapture('Navigation_Mobile').catch(() => {});
      await homepage.webActions.stopNetworkTracing('Navigation_Mobile').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Navigation] [MWeb] Verify guest user can navigate between Home and Search pages on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    let isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Failed to transition to search page on mobile');

    const homeLogo = page.locator('a[aria-label="Airbnb homepage"]').first();
    if (await homeLogo.isVisible()) {
      await homeLogo.click({ force: true });
      await page.waitForTimeout(2000);
      const title = await page.title();
      assert.isTrue(title.includes('Airbnb') || title.includes('Vacation Rentals'), 'Failed to return to Homepage on mobile');
    }
  });

  it('[TC_02] [Navigation] [MWeb] Verify guest user can use browser back navigation on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await page.goBack();
    await page.waitForTimeout(2000);
    const title = await page.title();
    assert.isTrue(title.includes('Airbnb') || title.includes('Vacation Rentals'), 'Back navigation failed on mobile');
  });

  it('[TC_03] [Navigation] [MWeb] Verify guest user can refresh search results without errors on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await page.reload();
    await page.waitForTimeout(2000);
    const firstTitle = await searchResults.getFirstListingTitle();
    assert.isTrue(firstTitle.length > 0, 'Refreshing search results broke the page list on mobile');
  });
});
