const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbMobileHomepage = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileHomepage.ts');
const AirbnbMobileAuth = require('../../src/pageFactory/pageRepository/mWeb/AirbnbMobileAuth.ts');
const { config } = require('../../src/config/config.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[MWeb] Airbnb Mobile Authentication Suite', function () {
  let page, browser, context;
  let homepage;
  let auth;
  const browserFactory = new BrowserFactory();

  before(async function () {
    [page, browser, context] = await browserFactory.launchMobileBrowser(config.environment.airbnbUrl, 'iPhone 12');
    homepage = new AirbnbMobileHomepage(page);
    auth = new AirbnbMobileAuth(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
  });

  beforeEach(async function () {
    await homepage.navigate();
  });

  afterEach(async function () {
    if (this.currentTest.state === 'failed') {
      const testName = this.currentTest.title.replace(/[^a-zA-Z0-9]/g, '_');
      const screenshotPath = await homepage.webActions.takeScreenshot(testName);
      addContext(this, screenshotPath);
    }
  });

  after(async function () {
    try {
      await homepage.webActions.stopHarCapture('Auth_Mobile');
      await homepage.webActions.stopNetworkTracing('Auth_Mobile');
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Authentication] [MWeb] Verify guest user can open login modal on mobile', async function () {
    await homepage.openUserMenu();
    const isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Login modal did not appear on mobile');
  });

  it('[TC_02] [Authentication] [MWeb] Verify guest user can close authentication modal on mobile', async function () {
    await homepage.openUserMenu();
    let isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Login modal did not display on mobile');

    await auth.closeAuthModal();
    isModalVisible = await auth.verifyAuthModalVisible();
    assert.isFalse(isModalVisible, 'Login modal did not close successfully on mobile');
  });
});
