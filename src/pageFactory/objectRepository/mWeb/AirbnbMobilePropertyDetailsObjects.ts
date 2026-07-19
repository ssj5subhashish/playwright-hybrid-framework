class AirbnbMobilePropertyDetailsObjects {
  // Mobile PDP selectors
  PROPERTY_TITLE = 'h1';
  GALLERY_TRIGGER_BTN = 'button:has-text("Show all photos"), button[data-testid="photo-header-show-all-photos"]';
  GALLERY_CLOSE_BTN = 'button[aria-label="Close"], button[aria-label="Back"]';

  AMENITIES_SECTION = 'div[data-testid="amenities-section"]';
  SHOW_ALL_AMENITIES_BTN = 'button:has-text("Show all"), button:has-text("amenities")';

  CALENDAR_SECTION = 'div[data-testid="availability-calendar"]';
  PRICE_BREAKDOWN_TRIGGER = 'button:has-text("pricing breakdown"), span:has-text("Total before taxes")';

  HOST_INFO_SECTION = 'div[data-testid="host-profile-container"], div:has-text("Meet your Host")';
  REVIEWS_TRIGGER_BTN = 'button:has-text("reviews"), button[data-testid="reviews-trigger"]';

  RESERVE_BTN = 'button[data-testid="homes-pdp-cta-btn"], button:has-text("Reserve"), a:has-text("Reserve")';
  SHARE_BTN = 'button:has-text("Share"), button[data-testid="share-button"]';
}

export = AirbnbMobilePropertyDetailsObjects;
