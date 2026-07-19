const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobileSearchResults = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchResults.ts');
const AirbnbMobilePropertyDetails = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobilePropertyDetails.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Property Details Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  let propertyDetails;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launchMobileBrowser(config.environment.airbnbUrl, 'iPhone 12');
    homepage = new AirbnbMobileHomepage(page);
    searchResults = new AirbnbMobileSearchResults(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
    await homepage.navigate();
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    // Click on listing container to open details (on mobile it opens in the same tab or new)
    const list = page.locator('div[data-testid="card-container"]').first();
    await list.click({ force: true });
    await page.waitForTimeout(2000);
    propertyDetails = new AirbnbMobilePropertyDetails(page);
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = await propertyDetails.webActions.takeScreenshot(testName);
      addContext(this, screenshotPath);
    }
  });

  after(async function () {
    try {
      await homepage.webActions.stopHarCapture('PropertyDetails_Mobile');
      await homepage.webActions.stopNetworkTracing('PropertyDetails_Mobile');
      if (browser) {
        await browser.close();
      }
    } finally {
    }
  });

  it('[TC_01] [PropertyDetails] [MWeb] Verify guest user can view property details on mobile', async function () {
    const title = await propertyDetails.getPropertyTitle();
    assert.isTrue(title.length > 0, 'Listing details failed to show title on mobile');
  });

  it('[TC_02] [PropertyDetails] [MWeb] Verify guest user can browse property image gallery on mobile', async function () {
    await propertyDetails.openImageGallery();
    await propertyDetails.closeImageGallery();
  });

  it('[TC_03] [PropertyDetails] [MWeb] Verify guest user can view property amenities on mobile', async function () {
    await propertyDetails.viewAmenities();
    await page.keyboard.press('Escape');
  });

  it('[TC_04] [PropertyDetails] [MWeb] Verify guest user can view availability calendar on mobile', async function () {
    await propertyDetails.viewAvailability();
  });

  it('[TC_05] [PropertyDetails] [MWeb] Verify guest user can view pricing breakdown on mobile', async function () {
    await propertyDetails.getPricingBreakdown();
  });

  it('[TC_06] [PropertyDetails] [MWeb] Verify guest user can view host information on mobile', async function () {
    await propertyDetails.viewHostInformation();
  });

  it('[TC_07] [PropertyDetails] [MWeb] Verify guest user can read property reviews on mobile', async function () {
    await propertyDetails.readReviews();
    await page.keyboard.press('Escape');
  });
});
