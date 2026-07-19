class AirbnbAuthObjects {
  // Modal container for Login/Signup
  AUTH_MODAL_CONTAINER = 'div[data-testid="modal-container"], div[role="dialog"]';
  
  // Close Auth Dialog
  CLOSE_AUTH_BTN = 'button[aria-label="Close"], button[data-testid="modal-close-button"]';
  
  // Inputs
  EMAIL_INPUT = 'input[id="email"], input[data-testid="auth-email-input"]';
  PHONE_INPUT = 'input[id="phoneNumber"], input[data-testid="phone-login-input"]';
  
  // Submit
  CONTINUE_BTN = 'button[type="submit"], button:has-text("Continue")';
}

export = AirbnbAuthObjects;
