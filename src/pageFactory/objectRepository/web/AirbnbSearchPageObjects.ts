class AirbnbSearchPageObjects {
  // Destination - the transparent overlay wrapper that captures clicks to open search
  // (class 'oygfumd' is the pointer-event interceptor on Airbnb's homepage search bar)
  DESTINATION_OVERLAY_WRAPPER = 'div.oygfumd';

  // The actual search text input (always in DOM, may be behind overlay)
  DESTINATION_INPUT = 'input[data-testid="structured-search-input-field-query"]';

  // Guest picker trigger - identified by aria-label (has no data-testid)
  GUEST_PICKER_TRIGGER = 'button[aria-label="Add guests"]';

  // Guest stepper buttons (inside the guest panel, may be offscreen - use force click)
  ADULTS_INCREASE_BTN = 'button[data-testid="stepper-adults-increase-button"]';
  ADULTS_DECREASE_BTN = 'button[data-testid="stepper-adults-decrease-button"]';
  CHILDREN_INCREASE_BTN = 'button[data-testid="stepper-children-increase-button"]';
  CHILDREN_DECREASE_BTN = 'button[data-testid="stepper-children-decrease-button"]';
  INFANTS_INCREASE_BTN = 'button[data-testid="stepper-infants-increase-button"]';
  PETS_INCREASE_BTN = 'button[data-testid="stepper-pets-increase-button"]';

  // Search submit button (the red magnifying glass in the pill bar)
  SEARCH_BTN = 'button[data-testid="structured-search-input-search-button"]';

  // Results page selectors
  LISTING_CARDS = 'div[data-testid="card-container"]';
  LISTING_TITLES = 'div[data-testid="listing-card-title"]';
  SEARCH_TITLE = 'h1';
}

export = AirbnbSearchPageObjects;
