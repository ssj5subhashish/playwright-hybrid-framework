const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileSearchPage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileSearchPage.ts');
const { config } = require('../../src/config/config.ts');
const { expect } = require('chai');

describe('[MWeb] Airbnb Mobile Guest Search Flow E2E Test Suite', function () {
  let page, browser, context;
  let airbnbMobilePage;
  const browserFactory = new BrowserFactory();

  before(async function () {
    // Launch simulated mobile viewport (iPhone 12)
    [page, browser, context] = await browserFactory.launchMobileBrowser(config.environment.airbnbUrl, 'iPhone 12');
    airbnbMobilePage = new AirbnbMobileSearchPage(page);
  });

  after(async function () {
    if (browser) {
      await browser.close();
    }
  });

  it('should successfully search for stays on mobile viewport as a guest user', async function () {
    try {
      // 1. Navigate to mobile URL and dismiss initial popups
      await airbnbMobilePage.navigate();
      
      // 2. Input search destination
      await airbnbMobilePage.searchDestination('Tokyo, Japan');
      
      // 3. Pick check-in (3 days from now) & check-out (7 days from now)
      await airbnbMobilePage.selectDates(3, 7);
      
      // 4. Click guest counter and add 2 Adults and 1 Child
      await airbnbMobilePage.addGuests(2, 1);
      
      // 5. Submit search query
      await airbnbMobilePage.clickSearch();
      
      // 6. Assert results page loads listings
      const resultsLoaded = await airbnbMobilePage.verifyResultsPageLoaded();
      expect(resultsLoaded, 'Airbnb mobile listings failed to load on the results page').to.be.true;
      
      // 7. Extract the first listing title to verify content is populated
      const firstTitle = await airbnbMobilePage.getFirstListingTitle();
      console.log(`[Validation Mobile] First Listing Found: "${firstTitle}"`);
      expect(firstTitle).to.not.be.empty;
    } catch (err) {
      await airbnbMobilePage.webActions.takeScreenshot('airbnb_mobile_failure');
      throw err;
    }
  });
});
