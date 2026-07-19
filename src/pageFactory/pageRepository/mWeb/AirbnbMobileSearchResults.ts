import WebActions = require('../../../libs/WebActions');
import AirbnbMobileSearchResultsObjects = require('../../objectRepository/mWeb/AirbnbMobileSearchResultsObjects');

class AirbnbMobileSearchResults {
  page: any;
  webActions: WebActions;
  locators: AirbnbMobileSearchResultsObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbMobileSearchResultsObjects();
  }

  async toggleMapView() {
    await this.webActions.forceClickElement(this.locators.MAP_TOGGLE_BTN);
    await this.page.waitForTimeout(2000);
  }

  async scrollResults() {
    await this.page.evaluate(() => {
      window.scrollBy(0, window.innerHeight * 2);
    });
    await this.page.waitForTimeout(1000);
  }

  async openListing(index: number = 0) {
    const list = this.page.locator(this.locators.LISTING_CARDS);
    await list.nth(index).scrollIntoViewIfNeeded();
    await list.nth(index).click({ force: true });
    await this.page.waitForTimeout(2000);
  }

  async openFiltersModal() {
    await this.webActions.forceClickElement(this.locators.FILTER_TRIGGER_BTN);
    await this.page.waitForTimeout(1000);
  }

  async applyPriceFilter(min: string, max: string) {
    await this.openFiltersModal();
    await this.webActions.forceSetValue(this.locators.PRICE_MIN_INPUT, min);
    await this.webActions.forceSetValue(this.locators.PRICE_MAX_INPUT, max);
    await this.page.waitForTimeout(500);
    await this.webActions.forceClickElement(this.locators.APPLY_FILTERS_BTN);
    await this.page.waitForTimeout(2000);
  }

  async applyRoomTypeFilter() {
    await this.openFiltersModal();
    await this.webActions.forceClickElement(this.locators.ROOM_TYPE_ENTIRE_HOME);
    await this.page.waitForTimeout(500);
    await this.webActions.forceClickElement(this.locators.APPLY_FILTERS_BTN);
    await this.page.waitForTimeout(2000);
  }

  async applyAmenitiesFilter() {
    await this.openFiltersModal();
    await this.webActions.forceClickElement(this.locators.AMENITY_WIFI);
    await this.page.waitForTimeout(500);
    await this.webActions.forceClickElement(this.locators.APPLY_FILTERS_BTN);
    await this.page.waitForTimeout(2000);
  }

  async clearAllFilters() {
    await this.openFiltersModal();
    if (await this.webActions.isElementVisible(this.locators.CLEAR_ALL_FILTERS_BTN)) {
      await this.webActions.forceClickElement(this.locators.CLEAR_ALL_FILTERS_BTN);
      await this.page.waitForTimeout(500);
    }
    await this.webActions.forceClickElement(this.locators.APPLY_FILTERS_BTN);
    await this.page.waitForTimeout(2000);
  }

  async clickSaveListing(index: number = 0) {
    const list = this.page.locator(this.locators.SAVE_LISTING_HEART);
    await list.nth(index).scrollIntoViewIfNeeded();
    await list.nth(index).click({ force: true });
    await this.page.waitForTimeout(1000);
  }

  async sortResults() {
    if (await this.webActions.isElementVisible(this.locators.SORT_TRIGGER_BTN)) {
      await this.webActions.forceClickElement(this.locators.SORT_TRIGGER_BTN);
      await this.page.waitForTimeout(1000);
    }
  }

  async getFirstListingTitle(): Promise<string> {
    return await this.webActions.getText(this.locators.LISTING_TITLES);
  }
}

export = AirbnbMobileSearchResults;
