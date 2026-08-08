import WebActions = require('../../../libs/WebActions');
import AirbnbMobileAuthObjects = require('../../objectRepository/mWeb/AirbnbMobileAuthObjects');

class AirbnbMobileAuth {
  page: any;
  webActions: WebActions;
  locators: AirbnbMobileAuthObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbMobileAuthObjects();
  }

  async verifyAuthModalVisible(): Promise<boolean> {
    const isModal = await this.webActions.isElementVisible(this.locators.AUTH_MODAL_CONTAINER);
    const isLoginPage = this.page.url().includes('/login') || await this.page.locator(this.locators.EMAIL_INPUT).first().isVisible();
    return isModal || isLoginPage;
  }

  async closeAuthModal() {
    if (this.page.url().includes('/login')) {
      const exploreBtn = this.page.locator(this.locators.EXPLORE_LINK).first();
      if (await exploreBtn.isVisible()) {
        await exploreBtn.click();
      } else {
        await this.page.goBack();
      }
    } else {
      await this.webActions.forceClickElement(this.locators.CLOSE_AUTH_BTN);
    }
    await this.page.waitForTimeout(1000);
  }

  async enterEmail(email: string) {
    await this.webActions.forceSetValue(this.locators.EMAIL_INPUT, email);
    await this.page.waitForTimeout(300);
  }

  async clickContinue() {
    await this.webActions.forceClickElement(this.locators.CONTINUE_BTN);
    await this.page.waitForTimeout(1000);
  }

  async verifyConfirmModalVisible(): Promise<boolean> {
    const isConfirmHeaderVisible = await this.webActions.isElementVisible(this.locators.CONFIRM_HEADER);
    const isOTPInputVisible = await this.webActions.isElementVisible(this.locators.OTP_INPUT);
    return isConfirmHeaderVisible && isOTPInputVisible;
  }

  async verifySecurityCheckModalVisible(): Promise<boolean> {
    const isSecurityHeaderVisible = await this.webActions.isElementVisible(this.locators.SECURITY_HEADER);
    if (isSecurityHeaderVisible) {
      await this.webActions.clickElement(this.locators.SECURITY_MODAL_CLOSE);
      await this.page.waitForTimeout(1000);
    }
    return isSecurityHeaderVisible;
  }

  async verifySecurityOrOTPModalVisible(): Promise<boolean> {
    const confirmVisible = await this.verifyConfirmModalVisible();
    const securityVisible = await this.verifySecurityCheckModalVisible();
    return confirmVisible || securityVisible;
  }

  async enterOTP(otp: string) {
    await this.webActions.forceSetValue(this.locators.OTP_INPUT, otp);
    await this.page.waitForTimeout(300);
  }
}

export = AirbnbMobileAuth;
