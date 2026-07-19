class AirbnbMobileSearchPageObjects {
  // Mobile Home search trigger
  MOBILE_SEARCH_BAR_TRIGGER = 'button[data-testid="search-bar-trigger"], [data-testid="search-input-field-query"], button:has-text("Where to?"), button:has-text("Start your search")';
  
  // Mobile Search Drawer input
  MOBILE_DESTINATION_INPUT = 'input[placeholder="Search destinations"], input[data-testid="search-input-field"], input[type="search"]';
  MOBILE_SUGGESTION_ITEM = '[data-testid="search-drawer-suggestion-item"], ul[role="listbox"] li';
  
  // Dynamic Calendar Checkin/Checkout buttons remain data-testid="calendar-day-YYYY-MM-DD"
  
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

  //Install App
  CLOSE_INSTALL_APP = '//div[@data-testid="app-install-container"]//button[@aria-label="Close"]';
}

export = AirbnbMobileSearchPageObjects;
