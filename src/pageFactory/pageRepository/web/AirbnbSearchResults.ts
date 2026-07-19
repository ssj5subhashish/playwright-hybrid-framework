import WebActions = require('../../../libs/WebActions');
import AirbnbSearchResultsObjects = require('../../objectRepository/web/AirbnbSearchResultsObjects');

class AirbnbSearchResults {
  page: any;
  webActions: WebActions;
  locators: AirbnbSearchResultsObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbSearchResultsObjects();
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
    // Scroll to top so the filter bar is visible and clickable
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await this.page.waitForTimeout(300);

    await this.webActions.forceClickElement(this.locators.FILTER_TRIGGER_BTN);

    // Wait specifically for the Filters dialog by its content — not just any role=dialog
    await this.page.waitForFunction(() => {
      const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
      return dialogs.some(d => d.textContent && d.textContent.includes('Type of place'));
    }, { timeout: 15000 });
    await this.page.waitForTimeout(500);
  }

  /** Find the Filters dialog by its content ('Type of place') */
  private getFilterDialog(): Promise<any> {
    return this.page.evaluateHandle(() => {
      const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
      return dialogs.find(d => d.textContent && d.textContent.includes('Type of place')) || null;
    });
  }

  /** Click the apply/show button inside the Filters dialog (no-op if dialog already closed) */
  private async clickApplyInDialog() {
    const dialogStillOpen = await this.page.evaluate(() => {
      const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
      return dialogs.some(d => d.textContent && d.textContent.includes('Type of place'));
    });

    if (dialogStillOpen) {
      await this.page.evaluate(() => {
        const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
        const filterDialog = dialogs.find(d => d.textContent && d.textContent.includes('Type of place'));
        if (!filterDialog) return; // Just closed between check and evaluate — safe to skip
        const buttons = Array.from(filterDialog.querySelectorAll('button, a'));
        const applyBtn = buttons.find(el => {
          const text = (el.textContent || '').trim();
          return text.startsWith('Show') || text.includes('places') || text.includes('home');
        });
        if (applyBtn) (applyBtn as HTMLElement).click();
        // If no apply button, dialog may have auto-applied — safe to skip
      });
    }
    // Wait for results to stabilize regardless of whether we clicked Apply
    await this.page.waitForTimeout(2000);
  }

  async applyPriceFilter(min: string, max: string) {
    await this.openFiltersModal();
    await this.page.evaluate((vals: { min: string; max: string }) => {
      const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
      const dialog = dialogs.find(d => d.textContent && d.textContent.includes('Type of place'));
      if (!dialog) return;
      const inputs = Array.from(dialog.querySelectorAll('input'));
      const minInput = inputs.find(el => {
        const id = (el as HTMLElement).getAttribute('id') || '';
        return id.toLowerCase().includes('min');
      }) || inputs[0];
      const maxInput = inputs.find(el => {
        const id = (el as HTMLElement).getAttribute('id') || '';
        return id.toLowerCase().includes('max');
      }) || inputs[1];
      if (minInput) {
        (minInput as HTMLInputElement).value = vals.min;
        minInput.dispatchEvent(new Event('input', { bubbles: true }));
        minInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (maxInput) {
        (maxInput as HTMLInputElement).value = vals.max;
        maxInput.dispatchEvent(new Event('input', { bubbles: true }));
        maxInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }, { min, max });
    await this.page.waitForTimeout(500);
    await this.clickApplyInDialog();
  }

  async applyRoomTypeFilter() {
    await this.openFiltersModal();
    await this.page.evaluate(() => {
      const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
      const dialog = dialogs.find(d => d.textContent && d.textContent.includes('Type of place'));
      if (!dialog) throw new Error('Filters dialog not found');
      // The Type of place pills may be button, div, or label elements
      const allEls = Array.from(dialog.querySelectorAll('button, div[role="radio"], div[role="button"], label, [tabindex]'));
      const btn = allEls.find(el => {
        const text = (el.textContent || '').trim();
        return text === 'Entire home' || text === 'Entire place';
      });
      if (btn) {
        (btn as HTMLElement).click();
      } else {
        // Last resort: find any element whose text starts with 'Entire'
        const allDivs = Array.from(dialog.querySelectorAll('*'));
        const match = allDivs.find(el =>
          el.children.length === 0 &&
          (el.textContent || '').trim() === 'Entire home'
        );
        if (match) (match.parentElement as HTMLElement)?.click();
        else throw new Error(`Entire home element not found. Tried all elements.`);
      }
    });
    await this.page.waitForTimeout(500);
    await this.clickApplyInDialog();
  }

  async applyAmenitiesFilter() {
    await this.openFiltersModal();
    await this.page.evaluate(() => {
      const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
      const dialog = dialogs.find(d => d.textContent && d.textContent.includes('Type of place'));
      if (!dialog) throw new Error('Filters dialog not found');
      const buttons = Array.from(dialog.querySelectorAll('button'));
      // Click first amenity icon button in the "Recommended for you" row
      const amenity = buttons.find(el => {
        const text = (el.textContent || '').trim();
        return text === 'Washing machine' || text === 'Wifi' || text === 'Kitchen' ||
               text === 'Instant Book' || text === 'Self check-in';
      });
      if (amenity) (amenity as HTMLElement).click();
      else {
        // Fallback: click first checkbox inside the dialog
        const cb = dialog.querySelector('input[type="checkbox"]');
        if (cb) (cb as HTMLElement).click();
        else throw new Error('No amenity option found in dialog');
      }
    });
    await this.page.waitForTimeout(500);
    await this.clickApplyInDialog();
  }

  async clearAllFilters() {
    await this.openFiltersModal();
    await this.page.evaluate(() => {
      const dialogs = Array.from(document.querySelectorAll('div[role="dialog"]'));
      const dialog = dialogs.find(d => d.textContent && d.textContent.includes('Type of place'));
      if (!dialog) return; // No filter dialog open — nothing to clear
      const buttons = Array.from(dialog.querySelectorAll('button'));
      const clearBtn = buttons.find(el => (el.textContent || '').trim().toLowerCase() === 'clear all');
      if (clearBtn) (clearBtn as HTMLElement).click();
    });
    await this.page.waitForTimeout(500);
    await this.clickApplyInDialog();
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

  async getMapToggleText(): Promise<string> {
    return await this.webActions.getText(this.locators.MAP_TOGGLE_BTN);
  }

  async getFirstListingTitle(): Promise<string> {
    return await this.webActions.getText(this.locators.LISTING_TITLES);
  }
}

export = AirbnbSearchResults;
