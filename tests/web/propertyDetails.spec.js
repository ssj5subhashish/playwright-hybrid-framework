const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const AirbnbSearchResults = require('../../src/pageFactory/pageRepository/web/AirbnbSearchResults.ts');
const AirbnbPropertyDetails = require('../../src/pageFactory/pageRepository/web/AirbnbPropertyDetails.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Property Details Suite', function () {
  let page, browser, context;
  let homepage;
  let searchResults;
  let propertyDetails;
  let detailPage;
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
    await homepage.verifyResultsPageLoaded();

    // Open first listing in a new tab/page context
    const [newPage] = await Promise.all([
      context.waitForEvent('page'),
      searchResults.openListing(0)
    ]);
    detailPage = newPage;
    await detailPage.waitForLoadState();
    propertyDetails = new AirbnbPropertyDetails(detailPage);
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
      await homepage.webActions.stopHarCapture('PropertyDetails_Web');
      await homepage.webActions.stopNetworkTracing('PropertyDetails_Web');
      if (detailPage) { await detailPage.close(); }
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [PropertyDetails] [Web] Verify guest user can view property details', async function () {
    const title = await propertyDetails.getPropertyTitle();
    assert.isTrue(title.length > 0, 'Property detail page failed to show listing title');
  });

  it('[TC_02] [PropertyDetails] [Web] Verify guest user can browse property image gallery', async function () {
    await propertyDetails.openImageGallery();
    // Verify it opened and we can close it
    await propertyDetails.closeImageGallery();
  });

  it('[TC_03] [PropertyDetails] [Web] Verify guest user can view property amenities', async function () {
    await propertyDetails.viewAmenities();
    // Escape standard full-screen amenities overlay if it opens
    await detailPage.keyboard.press('Escape');
  });

  it('[TC_04] [PropertyDetails] [Web] Verify guest user can view availability calendar', async function () {
    await propertyDetails.viewAvailability();
  });

  it('[TC_05] [PropertyDetails] [Web] Verify guest user can view pricing breakdown', async function () {
    await propertyDetails.getPricingBreakdown();
  });

  it('[TC_06] [PropertyDetails] [Web] Verify guest user can view host information', async function () {
    await propertyDetails.viewHostInformation();
  });

  it('[TC_07] [PropertyDetails] [Web] Verify guest user can read property reviews', async function () {
    await propertyDetails.readReviews();
    await detailPage.keyboard.press('Escape');
  });
});
