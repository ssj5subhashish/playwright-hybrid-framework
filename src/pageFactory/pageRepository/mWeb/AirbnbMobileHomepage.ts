import WebActions = require('../../../libs/WebActions');
import AirbnbMobileHomepageObjects = require('../../objectRepository/mWeb/AirbnbMobileHomepageObjects');
import { config } from '../../../config/config';

class AirbnbMobileHomepage {
  page: any;
  webActions: WebActions;
  locators: AirbnbMobileHomepageObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbMobileHomepageObjects();
  }

  async navigate() {
    await this.webActions.navigateToURL(config.environment.airbnbUrl);
    await this.page.waitForTimeout(3000); // Allow shimmer + popups to render
    await this.webActions.dismissBlockingOverlay();
  }

  async openUserMenu() {
    await this.webActions.forceClickElement(this.locators.PROFILE_MENU_TRIGGER);
    await this.page.waitForTimeout(1000);
  }

  async changeLanguage() {
    await this.webActions.forceClickElement(this.locators.LANGUAGE_PICKER_TRIGGER);
    await this.page.waitForTimeout(1000);
    if (await this.webActions.isElementVisible(this.locators.LANGUAGE_OPTION_EN)) {
      await this.webActions.forceClickElement(this.locators.LANGUAGE_OPTION_EN);
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(1000);
  }

  async changeCurrency() {
    await this.webActions.forceClickElement(this.locators.LANGUAGE_PICKER_TRIGGER);
    await this.page.waitForTimeout(1000);
    await this.webActions.forceClickElement(this.locators.CURRENCY_TAB);
    await this.page.waitForTimeout(500);
    if (await this.webActions.isElementVisible(this.locators.CURRENCY_OPTION_USD)) {
      await this.webActions.forceClickElement(this.locators.CURRENCY_OPTION_USD);
    } else {
      await this.page.keyboard.press('Escape');
    }
    await this.page.waitForTimeout(1000);
  }

  async dismissInstallBanner() {
    if (await this.webActions.isElementVisible(this.locators.CLOSE_INSTALL_APP_BANNER)) {
      await this.webActions.forceClickElement(this.locators.CLOSE_INSTALL_APP_BANNER);
      await this.page.waitForTimeout(500);
    }
  }

  async clickUseApp() {
    await this.webActions.forceClickElement(this.locators.USE_APP_BANNER_TRIGGER);
    await this.page.waitForTimeout(1000);
  }

  // --- Search Actions ---
  async searchDestination(city: string) {
    await this.page.waitForSelector(this.locators.MOBILE_SEARCH_BAR_TRIGGER, { state: 'attached', timeout: 10000 });
    await this.page.waitForTimeout(1000);
    await this.webActions.forceClickElement(this.locators.MOBILE_SEARCH_BAR_TRIGGER);
    await this.page.waitForTimeout(1500);

    const inputSelector = this.locators.MOBILE_DESTINATION_INPUT;
    await this.page.waitForSelector(inputSelector, { state: 'visible', timeout: 5000 });
    await this.webActions.enterValue(inputSelector, city);
    await this.page.waitForTimeout(1200);

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

    await this.webActions.forceClickElement(checkInLocator);
    await this.page.waitForTimeout(800);

    await this.webActions.forceClickElement(checkOutLocator);
    await this.page.waitForTimeout(800);

    try {
      if (await this.webActions.isElementVisible(this.locators.NEXT_STEP_BTN, 2000)) {
        await this.webActions.forceClickElement(this.locators.NEXT_STEP_BTN);
        await this.page.waitForTimeout(500);
      }
    } catch (e) { /* auto-advanced */ }
  }

  async addGuests(adults: number, children: number) {
    for (let i = 0; i < adults; i++) {
      await this.webActions.forceClickElement(this.locators.ADULTS_INCREASE_BTN);
      await this.page.waitForTimeout(300);
    }
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

      await this.webActions.dismissBlockingOverlay();
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
    if (await this.webActions.isElementVisible(this.locators.CLOSE_INSTALL_APP_BANNER)) {
      await this.webActions.forceClickElement(this.locators.CLOSE_INSTALL_APP_BANNER);
    }
  }
}

export = AirbnbMobileHomepage;
