import { Page } from 'playwright';
import log = require('../logger/logger');
import { config } from '../config/config';

class WebActions {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a URL
   */
  async navigateToURL(url: string, timeout = 60000) {
    log.info(`[WebActions] Navigating to: ${url}`);
    return await this.page.goto(url, { timeout, waitUntil: 'load' });
  }

  /**
   * Click on an element
   */
  async clickElement(locator: string, timeout = config.waitForElement) {
    log.info(`[WebActions] Clicking element: ${locator}`);
    await this.page.waitForSelector(locator, { state: 'visible', timeout });
    await this.page.click(locator);
  }

  /**
   * Force-click an element using JavaScript - bypasses overlapping elements and viewport constraints.
   * Uses state:'attached' so it works even if element is offscreen or hidden by an overlay.
   */
  async forceClickElement(locator: string, timeout = config.waitForElement) {
    log.info(`[WebActions] Force-clicking element: ${locator}`);
    const loc = this.page.locator(locator).first();
    await loc.waitFor({ state: 'attached', timeout });
    try {
      await loc.scrollIntoViewIfNeeded();
      await loc.click({ force: true, timeout: 5000 });
    } catch (e) {
      await loc.evaluate((el: HTMLElement) => {
        el.scrollIntoView({ block: 'center' });
        el.click();
      });
    }
  }

  /**
   * Fill a form field via JS - bypasses overlay intercepts and viewport constraints
   */
  async forceSetValue(locator: string, value: string, timeout = config.waitForElement) {
    log.info(`[WebActions] Force-setting value in element: ${locator}`);
    const loc = this.page.locator(locator).first();
    await loc.waitFor({ state: 'attached', timeout });
    try {
      await loc.scrollIntoViewIfNeeded();
      await loc.fill(value, { timeout: 5000 });
    } catch (e) {
      await loc.evaluate((el: HTMLInputElement, val: string) => {
        el.scrollIntoView({ block: 'center' });
        el.focus();
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }, value);
    }
  }

  /**
   * Dismiss any modal/overlay that is blocking UI interactions.
   * Targets only the promo modal - does NOT disable pointer-events broadly
   * to avoid breaking the search bar header.
   */
  async dismissBlockingOverlay() {
    log.info('[WebActions] Attempting to dismiss blocking overlay...');
    try {
      await this.page.keyboard.press('Escape');
      await this.page.waitForTimeout(400);
      await this.page.evaluate(() => {
        // Hide only the promo modal dialog (e.g. "Get 10% off your next stay")
        // Do NOT disable pointer-events on fixed elements — that breaks the search header
        document.querySelectorAll('[data-testid="modal-container"]').forEach(el => {
          (el as HTMLElement).style.display = 'none';
        });
      });
      await this.page.waitForTimeout(400);
    } catch (e) { /* ignore */ }
  }

  /**
   * Enter value in a text input field
   */
  async enterValue(locator: string, value: string, timeout = config.waitForElement) {
    log.info(`[WebActions] Entering value in element: ${locator}`);
    await this.page.waitForSelector(locator, { state: 'visible', timeout });
    await this.page.fill(locator, value);
  }

  /**
   * Get inner text content of an element
   */
  async getText(locator: string, timeout = config.waitForElement): Promise<string> {
    log.info(`[WebActions] Getting text from element: ${locator}`);
    await this.page.waitForSelector(locator, { state: 'visible', timeout });
    const text = await this.page.textContent(locator);
    return text ? text.trim() : '';
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(locator: string, timeout = 5000): Promise<boolean> {
    try {
      await this.page.waitForSelector(locator, { state: 'visible', timeout });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Send a keyboard keypress event (crucial for TV/WebLR emulation)
   */
  async pressKey(key: string) {
    log.info(`[WebActions] Pressing key: ${key}`);
    await this.page.keyboard.press(key);
  }

  /**
   * Take full page screenshot
   */
  async takeScreenshot(name: string) {
    const screenshotPath = `screenshots/${name}_${Date.now()}.png`;
    log.info(`[WebActions] Capturing screenshot to: ${screenshotPath}`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }
}

export = WebActions;
