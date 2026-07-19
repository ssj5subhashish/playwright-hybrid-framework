class AirbnbMobileAuthObjects {
  // Mobile login / signup dialogues
  AUTH_MODAL_CONTAINER = 'div[data-testid="modal-container"], div[role="dialog"]';
  CLOSE_AUTH_BTN = 'button[aria-label="Close"], button[data-testid="modal-close-button"]';
  
  EMAIL_INPUT = 'input[id="email"], input[data-testid="auth-email-input"]';
  PHONE_INPUT = 'input[id="phoneNumber"], input[data-testid="phone-login-input"]';
  CONTINUE_BTN = 'button[type="submit"], button:has-text("Continue")';
}

export = AirbnbMobileAuthObjects;
