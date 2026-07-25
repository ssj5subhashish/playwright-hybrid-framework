import WebActions = require('../../../libs/WebActions');
import AirbnbAuthObjects = require('../../objectRepository/web/AirbnbAuthObjects');

class AirbnbAuth {
  page: any;
  webActions: WebActions;
  locators: AirbnbAuthObjects;

  constructor(page: any) {
    this.page = page;
    this.webActions = new WebActions(page);
    this.locators = new AirbnbAuthObjects();
  }

  async verifyAuthModalVisible(): Promise<boolean> {
    const isAuthModalVisible = await this.webActions.isElementVisible(this.locators.AUTH_MODAL_CONTAINER);
    const isLoginHeaderVisible = await this.webActions.isElementVisible(this.locators.LOGIN_HEADER_IN_MODAL);
    return isAuthModalVisible && isLoginHeaderVisible;
  }

  async closeAuthModal() {
    await this.webActions.forceClickElement(this.locators.CLOSE_AUTH_BTN);
    await this.page.waitForTimeout(500);
  }

  async enterPhoneOrEmail(email: string) {
    await this.webActions.forceSetValue(this.locators.PHONE_EMAIL_INPUT, email);
    await this.page.waitForTimeout(300);
  }

  async clickContinueButton() {
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
    if(isSecurityHeaderVisible) {
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

export = AirbnbAuth;
