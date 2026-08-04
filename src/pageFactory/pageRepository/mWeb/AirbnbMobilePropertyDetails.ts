import WebActions = require('../../../libs/WebActions');
import AirbnbMobilePropertyDetailsObjects = require('../../objectRepository/mWeb/AirbnbMobilePropertyDetailsObjects');

class AirbnbMobilePropertyDetails {
  page: any;
  webActions: WebActions;
  locators: AirbnbMobilePropertyDetailsObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbMobilePropertyDetailsObjects();
  }

  async openImageGallery() {
    const btn = this.page.locator(this.locators.GALLERY_TRIGGER_BTN).first();
    await btn.scrollIntoViewIfNeeded();
    await btn.click();
    await this.page.waitForTimeout(2000);
  }

  async closeImageGallery() {
    await this.webActions.forceClickElement(this.locators.GALLERY_CLOSE_BTN);
    await this.page.waitForTimeout(500);
  }

  async viewAmenities() {
    await this.page.locator(this.locators.AMENITIES_SECTION).first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    if (await this.webActions.isElementVisible(this.locators.SHOW_ALL_AMENITIES_BTN)) {
      await this.webActions.forceClickElement(this.locators.SHOW_ALL_AMENITIES_BTN);
      await this.page.waitForTimeout(1000);
    }
  }

  async viewAvailability() {
    await this.page.locator(this.locators.CALENDAR_SECTION).first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  async getPricingBreakdown() {
    if (await this.webActions.isElementVisible(this.locators.PRICE_BREAKDOWN_TRIGGER)) {
      await this.webActions.forceClickElement(this.locators.PRICE_BREAKDOWN_TRIGGER);
      await this.page.waitForTimeout(1000);
    }
  }

  async viewHostInformation() {
    await this.page.locator(this.locators.HOST_INFO_SECTION).first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(1000);
  }

  async readReviews() {
    await this.page.locator(this.locators.REVIEWS_TRIGGER_BTN).first().scrollIntoViewIfNeeded();
    await this.page.waitForTimeout(500);
    await this.webActions.forceClickElement(this.locators.REVIEWS_TRIGGER_BTN);
    await this.page.waitForTimeout(1000);
  }

  async clickReserveButton() {
    await this.webActions.forceClickElement(this.locators.RESERVE_BTN);
    await this.page.waitForTimeout(2000);
  }

  async clickShareButton() {
    await this.webActions.forceClickElement(this.locators.SHARE_BTN);
    await this.page.waitForTimeout(1000);
  }

  /** Clicks the share button and returns whether the share dialog appeared */
  async openShareDialog(): Promise<boolean> {
    await this.webActions.forceClickElement(this.locators.SHARE_BTN);
    await this.page.waitForTimeout(1000);
    return await this.page.locator('div[role="dialog"]:has-text("Share this place")').first().isVisible();
  }

  /** Returns true if the login/auth prompt is visible (for guest reservation flows) */
  async verifyLoginPromptVisible(): Promise<boolean> {
    return await this.page
      .locator('input[id="email"], input[id="phoneNumber"], div[data-testid="modal-container"]')
      .first()
      .isVisible();
  }

  async getPropertyTitle(): Promise<string> {
    return await this.webActions.getText(this.locators.PROPERTY_TITLE);
  }

  async verifyTranslateDialog() {
    return await this.page.locator('h1:has-text("Translation on"), div:has-text("Translation on")').first().isVisible();
  }

  async closeTranslateDialogIfVisible() {
    const isVisible = await this.verifyTranslateDialog();
    if (isVisible) {
      await this.page.locator('button[aria-label="Close"]').first().click();
      await this.page.waitForTimeout(500);
    }
  }
}

export = AirbnbMobilePropertyDetails;
