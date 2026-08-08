class AirbnbMobileAuthObjects {
  // Mobile login / signup dialogues
  AUTH_MODAL_CONTAINER = 'div[data-testid="modal-container"], div[role="dialog"]';
  CLOSE_AUTH_BTN = 'button[aria-label="Close"], button[data-testid="modal-close-button"]';
  
  EMAIL_INPUT = 'input[id="email"], input[data-testid="auth-email-input"], input[id="phone-or-email"]';
  PHONE_INPUT = 'input[id="phoneNumber"], input[data-testid="phone-login-input"]';
  CONTINUE_BTN = 'button[type="submit"], button:has-text("Continue")';

  EXPLORE_LINK = 'a:has-text("Explore"), a[href="/"]';
  CONFIRM_HEADER = '//h1[@id="auth-modal-title" and contains(., "Confirm it’s you")]';
  OTP_INPUT = '//input[@id="otp-code-input"]';
  SECURITY_HEADER = '//div[@id="arkose-modal-header-id" and text()="Security check"]';
  SECURITY_MODAL_CLOSE = '//div[@id="arkose-modal-header-id"]/ancestor::*[contains(@role, "dialog") or contains(@data-testid, "modal") or contains(@class, "modal")][1]//button[@aria-label="Close"]';
}

export = AirbnbMobileAuthObjects;
