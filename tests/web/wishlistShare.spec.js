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
    browser = await browserFactory.launch();
    context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    page = await context.newPage();
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
      await homepage.webActions.stopHarCapture('WishlistShare_Web').catch(() => {});
      await homepage.webActions.stopNetworkTracing('WishlistShare_Web').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('Verify guest user is prompted to log in when saving a property', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    // Click heart icon to save listing
    await searchResults.clickSaveListing(0);

    // Verify that the login modal is displayed
    const isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Guest was not prompted to log in when saving a property');
  });

  it('Verify guest user can share a property listing', async function () {
    await searchPage.searchDestination('Tokyo, Japan');
    await searchPage.clickSearch();
    await searchPage.verifyResultsPageLoaded();

    // Open first listing in a new tab
    const [detailPage] = await Promise.all([
      context.waitForEvent('page'),
      searchResults.openListing(0)
    ]);
    await detailPage.waitForLoadState();

    // Find and click share button
    const shareBtn = detailPage.locator('button:has-text("Share"), button[data-testid="share-button"]').first();
    await shareBtn.click({ force: true });
    await detailPage.waitForTimeout(1000);

    // Verify share overlay is visible
    const shareOverlay = await detailPage.locator('div[role="dialog"]:has-text("Share this place")').isVisible();
    assert.isTrue(shareOverlay, 'Share dialog did not appear');
    await detailPage.close();
  });
});
