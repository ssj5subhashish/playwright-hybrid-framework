class AirbnbAuthObjects {
  // Modal container for Login/Signup
  AUTH_MODAL_CONTAINER = 'div[data-testid="modal-container"], div[role="dialog"]';

  // Login Header in Modal
  LOGIN_HEADER_IN_MODAL = '//h1[@id="auth-modal-title" and text()="Log in or sign up"]';
  
  // Close Auth Dialog
  CLOSE_AUTH_BTN = 'button[aria-label="Close"], button[data-testid="modal-close-button"]';
  
  // Inputs
  PHONE_EMAIL_INPUT = 'input[id="phone-or-email"]';
  
  // Submit
  CONTINUE_BTN = '//button[.//span[text()="Continue"]]';

  //Confirm Dialog
  CONFIRM_HEADER = `//h1[@id="auth-modal-title" and contains(., "Confirm it’s you")]`;
  OTP_INPUT = '//input[@id="otp-code-input"]';

  //Security Dialog
  SECURITY_HEADER = '//div[@id="arkose-modal-header-id" and text()="Security check"]';
  SECURITY_MODAL_CLOSE = '//div[@id="arkose-modal-header-id"]/ancestor::*[contains(@role, "dialog") or contains(@data-testid, "modal") or contains(@class, "modal")][1]//button[@aria-label="Close"]';
  
}

export = AirbnbAuthObjects;
