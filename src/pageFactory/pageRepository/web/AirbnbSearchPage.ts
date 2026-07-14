import WebActions = require('../../../libs/WebActions');
import AirbnbSearchPageObjects = require('../../objectRepository/web/AirbnbSearchPageObjects');
import { config } from '../../../config/config';

class AirbnbSearchPage {
  page: any;
  webActions: WebActions;
  locators: AirbnbSearchPageObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbSearchPageObjects();
  }

  async navigate() {
    await this.webActions.navigateToURL(config.environment.airbnbUrl);
    // Wait for React to mount the search bar in the DOM
    await this.page.waitForSelector(this.locators.DESTINATION_INPUT, { state: 'attached', timeout: 30000 });
    await this.page.waitForTimeout(2000);
    // Dismiss promo modal and neutralize pointer-intercepting overlays
    await this.webActions.dismissBlockingOverlay();
    await this.page.waitForTimeout(500);
  }

  async searchDestination(city: string) {
    // Click the destination input directly — force:true bypasses any residual overlay visibility issues
    await this.page.locator(this.locators.DESTINATION_INPUT).click({ force: true, timeout: 10000 });
    await this.page.waitForTimeout(500);

    // Type destination with realistic key delay so React's onChange fires
    await this.page.keyboard.type(city, { delay: 80 });
    await this.page.waitForTimeout(2000); // Wait for suggestions to appear

    // Select the first suggestion then confirm with Enter
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(300);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(1500);
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

    // Wait for the calendar to be rendered in the DOM
    await this.page.waitForSelector(checkInLocator, { state: 'attached', timeout: 15000 });
    await this.page.waitForTimeout(300);

    // Click dates with force to bypass any thin overlay layers on the calendar
    await this.page.locator(checkInLocator).click({ force: true });
    await this.page.waitForTimeout(600);

    await this.page.locator(checkOutLocator).click({ force: true });
    await this.page.waitForTimeout(800);

    // Close the calendar before proceeding to guests
    await this.page.keyboard.press('Escape');
    await this.page.waitForTimeout(400);
  }

  async addGuests(adults: number, children: number) {
    // Use JS to find and click "Add guests" button — bypasses Playwright locator ambiguity
    // when multiple elements share the same aria-label across visible/hidden search bars
    await this.page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(
        el => el.getAttribute('aria-label') === 'Add guests' && 
              (el as HTMLElement).getBoundingClientRect().width > 0
      ) as HTMLElement | undefined;
      if (btn) { btn.scrollIntoView({ block: 'center' }); btn.click(); }
    });
    await this.page.waitForTimeout(800);

    // Stepper buttons may be rendered offscreen — use JS scrollIntoView + click
    for (let i = 0; i < adults; i++) {
      await this.page.evaluate((sel: string) => {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) { el.scrollIntoView({ block: 'center' }); el.click(); }
      }, this.locators.ADULTS_INCREASE_BTN);
      await this.page.waitForTimeout(300);
    }

    for (let i = 0; i < children; i++) {
      await this.page.evaluate((sel: string) => {
        const el = document.querySelector(sel) as HTMLElement;
        if (el) { el.scrollIntoView({ block: 'center' }); el.click(); }
      }, this.locators.CHILDREN_INCREASE_BTN);
      await this.page.waitForTimeout(300);
    }
  }

  async clickSearch() {
    await this.page.locator(this.locators.SEARCH_BTN).click({ force: true });
    await this.page.waitForTimeout(1000);
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

      // Dismiss any popups or modals on the results page (like the "All fees included" popup)
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
}

export = AirbnbSearchPage;
