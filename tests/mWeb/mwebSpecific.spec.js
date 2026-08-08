const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobileSearchResults = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchResults.ts');
const AirbnbMobilePropertyDetails = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobilePropertyDetails.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile-Specific Features Suite', function () {
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
      await homepage.webActions.stopHarCapture('MWebSpecific_Mobile');
      await homepage.webActions.stopNetworkTracing('MWebSpecific_Mobile');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [MWebSpecific] [MWeb] Verify guest user can dismiss app install banner', async function () {
    await homepage.dismissInstallBanner();
  });

  it('[TC_02] [MWebSpecific] [MWeb] Verify guest user can open property details from MWeb search results', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await searchResults.openListing(0);

    const title = await page.title();
    assert.isTrue(title.length > 0, 'Failed to view listing details on mobile');
  });

  it('[TC_03] [MWebSpecific] [MWeb] Verify guest user can reserve a property from MWeb and is prompted to login', async function () {
    await homepage.closeInstallApp();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    await homepage.verifyResultsPageLoaded();

    await searchResults.openListing(0);

    const details = new AirbnbMobilePropertyDetails(page);
    await details.closeTranslateDialogIfVisible();
    await details.clickReserveButton();
    const isLoginPrompt = await details.verifyLoginPromptVisible();
    assert.isTrue(isLoginPrompt, 'Login prompt did not appear when reserving as a guest on mobile');
  });

  it('[TC_04] [MWebSpecific] [MWeb] Verify guest user can click the Use App banner to redirect', async function () {
    await homepage.clickUseApp();
  });
});
