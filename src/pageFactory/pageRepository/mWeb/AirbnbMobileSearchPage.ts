import WebActions = require('../../../libs/WebActions');
import AirbnbMobileSearchPageObjects = require('../../objectRepository/mWeb/AirbnbMobileSearchPageObjects');
import { config } from '../../../config/config';

class AirbnbMobileSearchPage {
  page: any;
  webActions: WebActions;
  locators: AirbnbMobileSearchPageObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbMobileSearchPageObjects();
  }

  async navigate() {
    await this.webActions.navigateToURL(config.environment.airbnbUrl);
    await this.page.waitForTimeout(3000); // Allow shimmer + popups to render
    // Aggressively dismiss any promo modal or overlay blocking interactions
    await this.webActions.dismissBlockingOverlay();
  }

  async searchDestination(city: string) {
    // Wait for the mobile search bar trigger to be attached
    await this.page.waitForSelector(this.locators.MOBILE_SEARCH_BAR_TRIGGER, { state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(1000);
    
    // Force-click mobile search bar trigger to open the search drawer
    await this.webActions.forceClickElement(this.locators.MOBILE_SEARCH_BAR_TRIGGER);
    await this.page.waitForTimeout(1500);

    // Type destination in input
    const inputSelector = this.locators.MOBILE_DESTINATION_INPUT;
    await this.page.waitForSelector(inputSelector, { state: 'visible', timeout: 5000 });
    await this.webActions.enterValue(inputSelector, city);
    await this.page.waitForTimeout(1200);

    // Select the first suggestion item if it appears, otherwise press Enter
    try {
      await this.page.waitForSelector(this.locators.MOBILE_SUGGESTION_ITEM, { state: 'attached', timeout: 4000 });
      await this.webActions.forceClickElement(this.locators.MOBILE_SUGGESTION_ITEM);
    } catch (e) {
      await this.webActions.pressKey('Enter');
    }
    await this.page.waitForTimeout(800);
  }

  async selectDates(checkInOffset: number, checkOutOffset: number) {
    const getFutureDate = (offset: number) => {
      const date = new Date();
      date.setDate(date.getDate() + offset);
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    };

    const checkInDateStr = getFutureDate(checkInOffset);
    const checkOutDateStr = getFutureDate(checkOutOffset);

    const checkInLocator = `button[data-state--date-string="${checkInDateStr}"]`;
    const checkOutLocator = `button[data-state--date-string="${checkOutDateStr}"]`;

    // Force-click check-in date
    await this.webActions.forceClickElement(checkInLocator);
    await this.page.waitForTimeout(800);

    // Force-click check-out date
    await this.webActions.forceClickElement(checkOutLocator);
    await this.page.waitForTimeout(800);

    // Advance to guest picker
    try {
      if (await this.webActions.isElementVisible(this.locators.NEXT_STEP_BTN, 2000)) {
        await this.webActions.forceClickElement(this.locators.NEXT_STEP_BTN);
        await this.page.waitForTimeout(500);
      }
    } catch (e) { /* auto-advanced */ }
  }

  async addGuests(adults: number, children: number) {
    // Increment adults
    for (let i = 0; i < adults; i++) {
      await this.webActions.forceClickElement(this.locators.ADULTS_INCREASE_BTN);
      await this.page.waitForTimeout(300);
    }

    // Increment children
    for (let i = 0; i < children; i++) {
      await this.webActions.forceClickElement(this.locators.CHILDREN_INCREASE_BTN);
      await this.page.waitForTimeout(300);
    }
  }

  async clickSearch() {
    await this.webActions.forceClickElement(this.locators.MOBILE_SEARCH_SUBMIT_BTN);
  }

  async verifyResultsPageLoaded(): Promise<boolean> {
    try {
      // Poll for the URL to change to the results page (/s/ route)
      let urlMatched = false;
      for (let i = 0; i < 25; i++) {
        const currentUrl = this.page.url();
        if (currentUrl.includes('/s/')) {
          urlMatched = true;
          break;
        }
        await this.page.waitForTimeout(1000);
      }
      if (!urlMatched) {
        throw new Error(`URL did not change to results page. Current URL is: ${this.page.url()}`);
      }

      // Dismiss any popups or modals on the results page
      await this.webActions.dismissBlockingOverlay();
      // Confirm listing cards are visible on the results page
      await this.page.waitForSelector(this.locators.LISTING_CARDS, { state: 'visible', timeout: 20000 });
      return true;
    } catch (e: any) {
      console.error(`[verifyResultsPageLoaded Failed]: ${e.message}`);
      return false;
    }
  }

  async getFirstListingTitle(): Promise<string> {
    return await this.webActions.getText(this.locators.LISTING_TITLES);
  }

  async closeInstallApp() {
    await this.webActions.forceClickElement(this.locators.CLOSE_INSTALL_APP);
  }
}

export = AirbnbMobileSearchPage;
