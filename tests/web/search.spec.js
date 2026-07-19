const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Search Suite', function () {
  let page, browser, context;
  let homepage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    browser = await browserFactory.launch();
    context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    page = await context.newPage();
    homepage = new AirbnbHomepage(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
    await homepage.navigate(); // Initial navigation — tests chain from here
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
      await homepage.webActions.stopHarCapture('Search_Web');
      await homepage.webActions.stopNetworkTracing('Search_Web');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Search] [Web] Verify guest user can search stays by destination', async function () {
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load by destination');
  });

  it('[TC_02] [Search] [Web] Verify guest user can modify search criteria from search results', async function () {
    const searchHeader = page.locator('button[data-testid="header-search-menu-button"], [data-testid="little-search"], button:has-text("Tokyo")').first();
    await searchHeader.click({ force: true });
    await page.waitForTimeout(1500);

    await homepage.searchDestination('Osaka, Japan');
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load modified search');
  });

  it('[TC_03] [Search] [Web] Verify guest user can search stays using destination, dates, and guests', async function () {
    await homepage.navigate();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.selectDates(3, 7);
    await homepage.addGuests(2, 1);
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load using destination, dates, and guests');
  });

  it('[TC_04] [Search] [Web] Verify guest user can search without selecting dates', async function () {
    await homepage.navigate();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.addGuests(2, 0);
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load without selecting dates');
  });

  it('[TC_05] [Search] [Web] Verify guest user can search using flexible dates', async function () {
    await homepage.navigate();
    await homepage.searchDestination('Tokyo, Japan');
    await homepage.selectFlexibleDates();
    await homepage.clickSearch();
    const isResultsLoaded = await homepage.verifyResultsPageLoaded();
    assert.isTrue(isResultsLoaded, 'Stays results failed to load using flexible dates');
  });
});
