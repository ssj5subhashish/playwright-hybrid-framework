class AirbnbPropertyDetailsObjects {
  // Main headings
  PROPERTY_TITLE = 'h1';

  // Photo Gallery
  GALLERY_TRIGGER_BTN = 'button:has-text("Show all photos"), button[data-testid="photo-header-show-all-photos"]';
  GALLERY_CLOSE_BTN = 'button[aria-label="Close"], button[aria-label="Back"]';

  // Amenities list
  AMENITIES_SECTION = 'div[data-testid="amenities-section"]';
  SHOW_ALL_AMENITIES_BTN = 'button:has-text("Show all"), button:has-text("amenities")';

  // Calendar and Pricing
  CALENDAR_SECTION = 'div[data-testid="availability-calendar"]';
  PRICE_BREAKDOWN_TRIGGER = 'button:has-text("pricing breakdown"), span:has-text("Total before taxes")';

  // Host Info
  HOST_INFO_SECTION = 'div[data-testid="host-profile-container"], div:has-text("Meet your Host")';

  // Reviews
  REVIEWS_TRIGGER_BTN = 'button:has-text("reviews"), button[data-testid="reviews-trigger"]';

  // PDP Actions
  RESERVE_BTN = '//button[@data-testid="homes-pdp-cta-btn"]';
  SHARE_BTN = 'button:has-text("Share"), button[data-testid="share-button"]';

  // Translation Dialog
  TRANSLATE_HEADING = '//header[@data-testid="translation-announce-modal"]/following-sibling::div//h1[text()="Translation on"]';
  TRANSLATE_CLOSE_BTN = '//div[@role="dialog"][.//header[@data-testid="translation-announce-modal"]]//button[@aria-label="Close"]';

  // Choose your Apartment Dialog
  CHOOSE_YOUR_APARTMENT_TITLE = '//div[@role="dialog" and @aria-label="Choose your apartment"]';
  CHOOSE_YOUR_APARTMENT_NEXT_BTN = '//div[@role="dialog" and @aria-label="Choose your apartment"]//button[.//span[normalize-space()="Next"]]';

  // Confirm and Pay Steps
  LOGIN_STEP = '//div[@data-testid="checkout-step-0-log-in-or-sign-up"]';
  
}

export = AirbnbPropertyDetailsObjects;
