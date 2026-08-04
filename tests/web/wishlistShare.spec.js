const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const AirbnbSearchResults = require('../../src/pageFactory/pageRepository/web/AirbnbSearchResults.ts');
const AirbnbAuth = require('../../src/pageFactory/pageRepository/web/AirbnbAuth.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Wishlist & Share Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  let auth;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launch();
    homepage = new AirbnbHomepage(page);
    searchResults = new AirbnbSearchResults(page);
    auth = new AirbnbAuth(page);
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
      await homepage.webActions.stopHarCapture('WishlistShare_Web');
      await homepage.webActions.stopNetworkTracing('WishlistShare_Web');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [WishlistShare] [Web] Verify guest user is prompted to log in when saving a property', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();
    await searchResults.clickSaveListing(0);
    const isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Guest was not prompted to log in when saving a property');
  });

  it('[TC_02] [WishlistShare] [Web] Verify guest user can share a property listing', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();
    const [detailPage] = await Promise.all([
      context.waitForEvent('page'),
      searchResults.openListing(0)
    ]);
    await detailPage.waitForLoadState();
    const shareBtn = detailPage.locator('button:has-text("Share"), button[data-testid="share-button"]').first();
    await shareBtn.click({ force: true });
    await detailPage.waitForTimeout(1000);
    const shareOverlay = await detailPage.locator('div[role="dialog"]:has-text("Share this place")').isVisible();
    assert.isTrue(shareOverlay, 'Share dialog did not appear');
    await detailPage.close();
  });
});
