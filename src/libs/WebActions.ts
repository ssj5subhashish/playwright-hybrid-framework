import { Page } from 'playwright';
import { PlaywrightHar } from 'playwright-har';
import log = require('../logger/logger');
import { config } from '../config/config';
import fs = require('fs');

class WebActions {
  page: Page;
  har: PlaywrightHar;

  constructor(page: Page) {
    this.page = page;
    this.har = new PlaywrightHar(page as any);
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
   * Waits for the promo dialog to appear, waits for the close button to be visible,
   * clicks it to close, and checks if it is actually closed.
   */
  async dismissBlockingOverlay(timeout = 5000) {
    log.info('[WebActions] Attempting to dismiss blocking overlay...');
    const dialog = this.page.locator('div[role="dialog"]').filter({
      has: this.page.locator('button[aria-label="Close"]')
    }).first();
    try {
      log.info(`[WebActions] Waiting up to ${timeout}ms for the promo dialog to appear...`);
      await dialog.waitFor({ state: 'visible', timeout });
      log.info('[WebActions] Dialog appeared. Waiting for the close button to be visible...');
      const closeBtn = dialog.locator('button[aria-label="Close"]').first();
      await closeBtn.waitFor({ state: 'visible', timeout: 3000 });
      log.info('[WebActions] Clicking the Close button...');
      await closeBtn.click();
      log.info('[WebActions] Verifying if the dialog is successfully closed...');
      await dialog.waitFor({ state: 'hidden', timeout: 5000 });
      log.info('[WebActions] Dialog is successfully closed.');
    } catch (e) {
      log.info(`[WebActions] No blocking overlay dialog was dismissed: ${(e as Error).message}`);
    }
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
  async takeScreenshot(name: string): Promise<string> {
    const suite = process.env.TEST_SUITE || 'web';
    const screenshotDir = `reports/${suite}/screenshots`;
    if (!fs.existsSync(screenshotDir)) {
      fs.mkdirSync(screenshotDir, { recursive: true });
    }
    const filename = `${name}_${Date.now()}.png`;
    const screenshotPath = `${screenshotDir}/${filename}`;
    log.info(`[WebActions] Capturing screenshot to: ${screenshotPath}`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
    return `screenshots/${filename}`;
  }

  /**
   * Start network tracing
   */
  async startNetworkTracing() {
    log.info(`[WebActions] Starting Playwright Network tracing`);
    try {
      await this.page.context().tracing.start({ screenshots: true, snapshots: true });
    } catch (e) {
      log.error(`[WebActions] Failed to start network tracing`, e);
    }
  }

  /**
   * Stop network tracing and save the trace file
   */
  async stopNetworkTracing(testName: string) {
    log.info(`[WebActions] Ending Playwright Network tracing`);
    try {
      const suite = process.env.TEST_SUITE || 'web';
      const traceDir = `reports/${suite}/trace`;
      if (!fs.existsSync(traceDir)) {
        fs.mkdirSync(traceDir, { recursive: true });
      }
      const timestamp = Date.now();
      const tracePath = `${traceDir}/${testName}_${timestamp}.zip`;
      await this.page.context().tracing.stop({ path: tracePath });
      log.info(`[WebActions] Trace saved to: ${tracePath}`);
    } catch (e) {
      log.error(`[WebActions] Failed to stop network tracing`, e);
    }
  }

  /**
  * Start HAR Capture
  */
  async startHarCapture() {
    if (config.browser === 'chrome') {
      log.info(`[WebActions] Starting HAR capture`);
      try {
        await this.har.start();
      } catch (e) {
        log.error(`[WebActions] Failed to start HAR capture`, e);
      }
    }
  }

  /**
   * Stop HAR Capture and save the HAR file
   */
  async stopHarCapture(testName: string) {
    if (config.browser === 'chrome') {
      log.info(`[WebActions] Ending HAR capture`);
      try {
        const suite = process.env.TEST_SUITE || 'web';
        const harDir = `reports/${suite}/har`;
        if (!fs.existsSync(harDir)) {
          fs.mkdirSync(harDir, { recursive: true });
        }
        const timestamp = Date.now();
        const harPath = `${harDir}/${testName}_${timestamp}.har`;
        await this.har.stop(harPath);
        log.info(`[WebActions] HAR file saved to: ${harPath}`);
      } catch (e) {
        log.error(`[WebActions] Failed to stop HAR capture`, e);
      }
    }
  }

  /**
   * Generate Random Email
   */
  async generateRandomEmail(): Promise<string> {
    log.info(`[WebActions] Generating random email`);
    const timestamp = Date.now();
    const email = `test_${timestamp}@example.com`;
    return email;
  }
}

export = WebActions;
