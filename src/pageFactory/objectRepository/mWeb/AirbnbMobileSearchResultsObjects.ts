class AirbnbMobileSearchResultsObjects {
  // Mobile results list and map toggle
  LISTING_CARDS = 'div[data-testid="card-container"]';
  LISTING_TITLES = 'div[data-testid="listing-card-title"]';
  SAVE_LISTING_HEART = 'button[aria-label="Save this listing"], button[data-testid="listing-card-save-button"]';
  MAP_TOGGLE_BTN = 'button:has-text("Map"), button:has-text("List"), button[data-testid="map-toggle"]';

  // Filters selectors on mobile
  FILTER_TRIGGER_BTN = 'button:has-text("Filters"), button[data-testid="mobile-filter-trigger"]';
  PRICE_MIN_INPUT = 'input[id="price_filter_min"], input[id="Filter-price-min"], input[data-testid="price-filter-min"]';
  PRICE_MAX_INPUT = 'input[id="price_filter_max"], input[id="Filter-price-max"], input[data-testid="price-filter-max"]';
  ROOM_TYPE_ENTIRE_HOME = 'input[name="Entire home/apt"], input[id="room-type-entire_home"]';
  AMENITY_WIFI = 'input[name="Wifi"], input[id="amenities-wifi"]';
  APPLY_FILTERS_BTN = 'button:has-text("Show"), button:has-text("results")';
  CLEAR_ALL_FILTERS_BTN = 'button:has-text("Clear all"), button:text("Clear all")';

  // Sorting
  SORT_TRIGGER_BTN = 'button:has-text("Sort"), button[data-testid="sort-trigger"]';
}

export = AirbnbMobileSearchResultsObjects;
