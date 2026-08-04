import { chromium, firefox, webkit, Browser, BrowserContext, Page, devices } from 'playwright';
import { config } from '../config/config';
import * as browserOptions from './browser_options.json';

class BrowserFactory {
  /**
   * Helper to launch raw Playwright browser
   */
  async launchRaw(browserType: string = config.browser): Promise<Browser> {
    const options = (browserOptions as any)[browserType] || browserOptions.chrome;
    const headless = process.env.HEADLESS !== undefined 
      ? process.env.HEADLESS !== 'false' 
      : (options.headless !== undefined ? options.headless : config.headless);
    const launchArgs = {
      headless,
      args: options.args || []
    };

    switch (options.engine) {
      case 'chromium':
        return await chromium.launch(launchArgs);
      case 'firefox':
        return await firefox.launch(launchArgs);
      case 'webkit':
        return await webkit.launch(launchArgs);
      default:
        return await chromium.launch(launchArgs);
    }
  }

  /**
   * Helper to launch browser, context, and page
   */
  async launch(browserType: string = config.browser): Promise<[Page, Browser, BrowserContext]> {
    const browser = await this.launchRaw(browserType);
    const context = await browser.newContext({
      viewport: { width: 1600, height: 900 },
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();
    return [page, browser, context];
  }

  /**
   * Launch standard browser context (Web / WebLR) and navigate to url
   */
  async launchBrowser(url: string): Promise<[Page, Browser, BrowserContext]> {
    const [page, browser, context] = await this.launch();
    await page.goto(url);
    return [page, browser, context];
  }

  /**
   * Launch mobile emulated browser context (MWeb)
   */
  async launchMobileBrowser(url: string, deviceName: string = 'Pixel 5'): Promise<[Page, Browser, BrowserContext]> {
    const browser = await this.launchRaw();
    const phone = devices[deviceName];
    const context = await browser.newContext({
      ...phone
    });
    const page = await context.newPage();
    await page.goto(url);
    return [page, browser, context];
  }
}

export = BrowserFactory;
