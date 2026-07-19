class AirbnbHomepageObjects {
  // User profile menu selectors
  USER_MENU_TRIGGER = 'button[data-testid="cypress-headernav-profile"]';
  LOGIN_SIGNUP_MENU_ITEM = '//div[@data-testid="guest-header-dropdownmenu"]//span[text()="Log in or sign up"]';

  // Home logo
  HOME_LOGO = 'a[aria-label="Airbnb homepage"]';

  // Localization selectors
  LANGUAGE_PICKER_TRIGGER = 'button[aria-label="Choose a language and currency"]';
  LANGUAGE_OPTION_EN = 'button[data-testid="language-selector-item-en"]';
  CURRENCY_TAB = 'button[role="tab"]:has-text("Currency")';
  CURRENCY_OPTION_USD = 'button[data-testid="currency-selector-item-USD"], a:has-text("USD")';

  // App Install Banner (MWeb)
  CLOSE_INSTALL_APP_BANNER = '//div[@data-testid="app-install-container"]//button[@aria-label="Close"], button[aria-label="Close banner"]';
  USE_APP_BANNER_TRIGGER = 'a:has-text("Use app"), a[data-testid="use-app-button"]';

  // Destination - stay search inputs
  DESTINATION_OVERLAY_WRAPPER = 'div.oygfumd';
  DESTINATION_INPUT = 'input[data-testid="structured-search-input-field-query"]';

  // Guest picker trigger - identified by aria-label
  GUEST_PICKER_TRIGGER = 'button[aria-label="Add guests"]';

  // Guest stepper buttons
  ADULTS_INCREASE_BTN = 'button[data-testid="stepper-adults-increase-button"]';
  ADULTS_DECREASE_BTN = 'button[data-testid="stepper-adults-decrease-button"]';
  CHILDREN_INCREASE_BTN = 'button[data-testid="stepper-children-increase-button"]';
  CHILDREN_DECREASE_BTN = 'button[data-testid="stepper-children-decrease-button"]';
  INFANTS_INCREASE_BTN = 'button[data-testid="stepper-infants-increase-button"]';
  PETS_INCREASE_BTN = 'button[data-testid="stepper-pets-increase-button"]';

  // Search submit button
  SEARCH_BTN = 'button[data-testid="structured-search-input-search-button"]';

  // Results page selectors
  LISTING_CARDS = 'div[data-testid="card-container"]';
  LISTING_TITLES = 'div[data-testid="listing-card-title"]';
  SEARCH_TITLE = 'h1';
}

export = AirbnbHomepageObjects;
