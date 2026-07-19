const BrowserFactory = require('../../src/browsers/BrowserFactory.ts');
const AirbnbHomepage = require('../../src/pageFactory/pageRepository/web/AirbnbHomepage.ts');
const AirbnbAuth = require('../../src/pageFactory/pageRepository/web/AirbnbAuth.ts');
const { assert } = require('chai');
const addContext = require('mochawesome/addContext');

describe('[Web] Airbnb Authentication Suite', function () {
  let page, browser, context;
  let homepage;
  let auth;
  const browserFactory = new BrowserFactory();

  before(async function () {
    browser = await browserFactory.launch();
    context = await browser.newContext({ viewport: { width: 1600, height: 900 } });
    page = await context.newPage();
    homepage = new AirbnbHomepage(page);
    auth = new AirbnbAuth(page);
    await homepage.webActions.startNetworkTracing();
    await homepage.webActions.startHarCapture();
  });

  beforeEach(async function () {
    await homepage.navigate();
    await homepage.openUserMenu();
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
      await homepage.webActions.stopHarCapture('Auth_Web').catch(() => {});
      await homepage.webActions.stopNetworkTracing('Auth_Web').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  it('[TC_01] [Authentication] [Web] Verify guest user can open Login or Signup modal', async function () {
    await homepage.selectLoginSignupOption();
    const isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Login modal did not appear');
  });

  it('[TC_02] [Authentication] [Web] Verify guest user can close authentication modal', async function () {
    await homepage.selectLoginSignupOption();
    let isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Auth modal did not display');
    await auth.closeAuthModal();
    isModalVisible = await auth.verifyAuthModalVisible();
    assert.isFalse(isModalVisible, 'Auth modal did not close successfully');
  });
});
