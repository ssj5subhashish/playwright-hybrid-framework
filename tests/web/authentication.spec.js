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
      await homepage.webActions.stopHarCapture('Auth_Web').catch(() => {});
      await homepage.webActions.stopNetworkTracing('Auth_Web').catch(() => {});
    } finally {
      if (browser) {
        await browser.close();
      }
    }
  });

  // T1: Open login modal, verify it appears, then close it
  it('[TC_01] [Authentication] [Web] Verify guest user can open login modal', async function () {
    await homepage.openUserMenu();
    await homepage.selectLoginOption();
    const isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Login modal did not appear');
    await auth.closeAuthModal(); // Close so T2 can chain on homepage
  });

  // T2: Chain from T1 (homepage with modal closed) — open signup modal
  it('[TC_02] [Authentication] [Web] Verify guest user can open signup modal', async function () {
    await homepage.openUserMenu();
    await homepage.selectSignupOption();
    const isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Signup modal did not appear');
    await auth.closeAuthModal(); // Close so T3 can chain
  });

  // T3: Chain from T2 (homepage with modal closed) — verify close flow
  it('[TC_03] [Authentication] [Web] Verify guest user can close authentication modal', async function () {
    await homepage.openUserMenu();
    await homepage.selectLoginOption();
    let isModalVisible = await auth.verifyAuthModalVisible();
    assert.isTrue(isModalVisible, 'Auth modal did not display');

    await auth.closeAuthModal();
    isModalVisible = await auth.verifyAuthModalVisible();
    assert.isFalse(isModalVisible, 'Auth modal did not close successfully');
  });
});
