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

export = AirbnbAuth;
