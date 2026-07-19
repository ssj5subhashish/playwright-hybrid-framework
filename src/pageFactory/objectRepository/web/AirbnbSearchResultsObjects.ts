class AirbnbSearchResultsObjects {
  // Map / List view toggles
  MAP_TOGGLE_BTN = 'button:has-text("Show map"), button:has-text("Show list"), button[data-testid="map-toggle"]';

  // Listing selection
  LISTING_CARDS = 'div[data-testid="card-container"]';
  LISTING_TITLES = 'div[data-testid="listing-card-title"]';
  SAVE_LISTING_HEART = 'button[aria-label="Save this listing"], button[data-testid="listing-card-save-button"]';

  // Filters Modal triggers and actions
  FILTER_TRIGGER_BTN = 'button[data-testid="category-bar-filter-button"], button:has-text("Filters")';
  PRICE_MIN_INPUT = 'input[id*="price"][id*="min"], input[id*="Price"][id*="min"], input[id="price_filter_min"], input[id="Filter-price-min"], input[data-testid="price-filter-min"]';
  PRICE_MAX_INPUT = 'input[id*="price"][id*="max"], input[id*="Price"][id*="max"], input[id="price_filter_max"], input[id="Filter-price-max"], input[data-testid="price-filter-max"]';
  
  // Room Type option checkboxes / buttons
  ROOM_TYPE_ENTIRE_HOME = 'div[role="dialog"] button:has-text("Entire home"), button:has-text("Entire home")';
  
  // Amenities filter checkboxes / buttons
  AMENITY_WIFI = 'div[role="dialog"] button:has-text("Washing machine"), button:has-text("Washing machine"), button:has-text("Wifi")';
  
  // Apply and Clear actions
  APPLY_FILTERS_BTN = 'div[role="dialog"] footer button:has-text("Show"), button:has-text("Show "):has-text("place"), button:has-text("Show "):has-text("home")';
  CLEAR_ALL_FILTERS_BTN = 'div[role="dialog"] button:has-text("Clear all"), button:has-text("Clear all")';

  // Sorting
  SORT_TRIGGER_BTN = 'button[data-testid="sort-trigger"], button:has-text("Sort")';
}

export = AirbnbSearchResultsObjects;
