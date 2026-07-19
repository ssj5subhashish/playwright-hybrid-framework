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
    return await this.webActions.isElementVisible(this.locators.AUTH_MODAL_CONTAINER);
  }

  async closeAuthModal() {
    await this.webActions.forceClickElement(this.locators.CLOSE_AUTH_BTN);
    await this.page.waitForTimeout(500);
  }

  async enterEmail(email: string) {
    await this.webActions.forceSetValue(this.locators.EMAIL_INPUT, email);
    await this.page.waitForTimeout(300);
  }

  async clickContinue() {
    await this.webActions.forceClickElement(this.locators.CONTINUE_BTN);
    await this.page.waitForTimeout(1000);
  }
}

export = AirbnbMobileAuth;
