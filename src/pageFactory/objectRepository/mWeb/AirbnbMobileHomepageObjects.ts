class AirbnbMobileHomepageObjects {
  // Mobile search triggers
  MOBILE_SEARCH_BAR_TRIGGER = 'button[data-testid="search-bar-trigger"], button:has-text("Where to?"), button:has-text("Start your search"), [data-testid="search-input-field-query"]';

  // Mobile navigation and footer
  HOME_LOGO = 'a[aria-label="Airbnb homepage"]';
  PROFILE_MENU_TRIGGER = 'a[data-testid="profile-icon"], button[aria-label="Log in"], a:has-text("Log in")';

  // Mobile App Install Banners
  CLOSE_INSTALL_APP_BANNER = '//div[@data-testid="app-install-container"]//button[@aria-label="Close"], button[aria-label="Close banner"]';
  USE_APP_BANNER_TRIGGER = 'a:has-text("Use app"), a[data-testid="use-app-button"]';

  // Localization selectors
  LANGUAGE_PICKER_TRIGGER = 'button[aria-label="Choose a language and currency"]';
  LANGUAGE_OPTION_EN = 'button[data-testid="language-selector-item-en"]';
  CURRENCY_TAB = 'button[role="tab"]:has-text("Currency")';
  CURRENCY_OPTION_USD = 'button[data-testid="currency-selector-item-USD"], a:has-text("USD")';

  // Mobile Search Drawer input
  MOBILE_DESTINATION_INPUT = 'input[placeholder="Search destinations"], input[data-testid="search-input-field"], input[type="search"]';
  MOBILE_SUGGESTION_ITEM = '[data-testid="search-drawer-suggestion-item"], ul[role="listbox"] li';

  // Next step button (advances from Destination -> Dates -> Guests)
  NEXT_STEP_BTN = 'button[data-testid="search-drawer-next-button"], button:has-text("Next")';

  // Steppers inside Mobile Drawer
  ADULTS_INCREASE_BTN = 'button[data-testid="stepper-adults-increase-button"]';
  CHILDREN_INCREASE_BTN = 'button[data-testid="stepper-children-increase-button"]';

  // Mobile Search submit
  MOBILE_SEARCH_SUBMIT_BTN = 'button[data-testid="explore-footer-primary-btn"], button:text("Search")';

  // Results view
  LISTING_CARDS = 'div[data-testid="card-container"]';
  LISTING_TITLES = 'div[data-testid="listing-card-title"]';
}

export = AirbnbMobileHomepageObjects;
