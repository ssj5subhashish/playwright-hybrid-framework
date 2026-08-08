class AirbnbMobilePropertyDetailsObjects {
  // Mobile PDP selectors
  PROPERTY_TITLE = 'h1';
  GALLERY_TRIGGER_BTN = 'button[data-testid="photo-header-show-all-photos"], button:has-text("Show all photos"), div[data-testid="photo-header"] img, div[data-testid="hero-container"] img, [aria-label^="Photo"] img, img[src*="muscache"]';
  GALLERY_CLOSE_BTN = 'button[data-testid="back-button"], button[aria-label="Close"], button[aria-label="Back"]';

  AMENITIES_SECTION = 'div[data-testid="amenities-section"], section:has(h2:has-text("What this place offers")), div:has(h2:has-text("What this place offers")), h2:has-text("What this place offers")';
  SHOW_ALL_AMENITIES_BTN = 'section:has(h2:has-text("What this place offers")) button:has-text("Show all"), div:has(h2:has-text("What this place offers")) button:has-text("Show all"), button[data-testid="pdp-show-all-amenities-button"], button:has-text("amenities")';

  CALENDAR_SECTION = 'div[data-testid="availability-calendar"], section:has(h2:has-text("nights in")), div:has(h2:has-text("nights in")), h2:has-text("nights in")';
  PRICE_BREAKDOWN_TRIGGER = 'button:has-text("price breakdown"), button:has-text("pricing breakdown"), span:has-text("Total before taxes")';

  HOST_INFO_SECTION = 'div[data-testid="host-profile-container"], section:has(h2:has-text("Meet your host")), div:has(h2:has-text("Meet your host")), h2:has-text("Meet your host"), h2:has-text("Meet your Host")';
  REVIEWS_TRIGGER_BTN = 'button[data-testid="pdp-show-all-reviews-button"], button:has-text("reviews"), button[data-testid="reviews-trigger"]';

  RESERVE_BTN = 'button[data-testid="homes-pdp-cta-btn"], button:has-text("Reserve"), a:has-text("Reserve")';
  SHARE_BTN = 'button:has-text("Share"), button[data-testid="share-button"]';

  SHARE_DIALOG = 'div[role="dialog"]:has-text("Share this place")';
  LOGIN_INPUTS_MODAL = 'input[id="email"], input[id="phoneNumber"], input[id="phone-or-email"], div[data-testid="modal-container"]';
  TRANSLATE_DIALOG = 'h1:has-text("Translation on"), div:has-text("Translation on")';
  TRANSLATE_CLOSE_BTN = 'button[aria-label="Close"]';
  DIALOG_MODAL = 'div[role="dialog"]';
}

export = AirbnbMobilePropertyDetailsObjects;
