const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobileSearchResults = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchResults.ts');
const AirbnbMobileAuth = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileAuth.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Wishlist & Share Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  let auth;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launchMobileBrowser(config.environment.airbnbUrl, 'iPhone 12');
    homepage = new AirbnbMobileHomepage(page);
    searchResults = new AirbnbMobileSearchResults(page);
    auth = new AirbnbMobileAuth(page);
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
      await homepage.webActions.stopHarCapture('WishlistShare_Mobile').catch(() => {});
      await homepage.webActions.stopNetworkTracing('WishlistShare_Mobile').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [WishlistShare] [MWeb] Verify guest user is prompted to log in when saving a property on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await searchResults.clickSaveListing(0);

    const isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Guest was not prompted to log in when saving on mobile');
  });

  it('[TC_02] [WishlistShare] [MWeb] Verify guest user can share a property listing on mobile', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    const list = page.locator('div[data-testid="card-container"]').first();
    await list.click({ force: true });
    await page.waitForTimeout(2000);

    const shareBtn = page.locator('button:has-text("Share"), button[data-testid="share-button"]').first();
    await shareBtn.click({ force: true });
    await page.waitForTimeout(1000);

    const shareOverlay = await page.locator('div[role="dialog"]:has-text("Share this place")').first().isVisible();
    assert.isTrue(shareOverlay, 'Share dialog did not appear on mobile');
  });
});
