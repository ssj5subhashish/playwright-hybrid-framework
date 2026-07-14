const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbSearchPage = require('../../src/pageFactory/pageRepository/web/AirbnbSearchPage.ts');
const { config } = require('../../src/config/config.ts');
const { expect } = require('chai');

describe('[Web] Airbnb Guest Search Flow E2E Test Suite', function () {
  let page, browser, context;
  let airbnbPage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launchBrowser(config.environment.airbnbUrl);
    airbnbPage = new AirbnbSearchPage(page);
  });

  after(async function () {
    if (browser) {
      await browser.close();
    }
  });

  it('should successfully search for stays as a guest user', async function () {
    try {
      // 1. Navigate to target URL and dismiss popups
      await airbnbPage.navigate();
      
      // 2. Input search destination
      await airbnbPage.searchDestination('Tokyo, Japan');
      
      // 3. Pick check-in (3 days from now) & check-out (7 days from now)
      await airbnbPage.selectDates(3, 7);
      
      // 4. Click guest counter and add 2 Adults and 1 Child
      await airbnbPage.addGuests(2, 1);
      
      // 5. Submit search query
      await airbnbPage.clickSearch();
      
      // 6. Assert results page loads listings
      const resultsLoaded = await airbnbPage.verifyResultsPageLoaded();
      expect(resultsLoaded, 'Airbnb listings failed to load on the results page').to.be.true;
      
      // 7. Extract the first listing title to verify content is populated
      const firstTitle = await airbnbPage.getFirstListingTitle();
      console.log(`[Validation] First Listing Found: "${firstTitle}"`);
      expect(firstTitle).to.not.be.empty;
    } catch (err) {
      await airbnbPage.webActions.takeScreenshot('airbnb_desktop_failure');
      throw err;
    }
  });
});
