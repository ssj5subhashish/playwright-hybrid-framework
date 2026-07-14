import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.join(__dirname, '../../.env') });

const env = process.env.ENV || 'qa';

interface EnvironmentConfig {
  baseUrl: string;
  baseUrlWebLR: string;
  baseUrlMWeb: string;
  airbnbUrl: string;
}

const environments: Record<string, EnvironmentConfig> = {
  dev: {
    baseUrl: 'https://the-internet.herokuapp.com/',
    baseUrlWebLR: 'https://the-internet.herokuapp.com/key_presses',
    baseUrlMWeb: 'https://the-internet.herokuapp.com/login',
    airbnbUrl: 'https://www.airbnb.com'
  },
  qa: {
    baseUrl: 'https://the-internet.herokuapp.com/',
    baseUrlWebLR: 'https://the-internet.herokuapp.com/key_presses',
    baseUrlMWeb: 'https://the-internet.herokuapp.com/login',
    airbnbUrl: 'https://www.airbnb.com'
  },
  prod: {
    baseUrl: 'https://the-internet.herokuapp.com/',
    baseUrlWebLR: 'https://the-internet.herokuapp.com/key_presses',
    baseUrlMWeb: 'https://the-internet.herokuapp.com/login',
    airbnbUrl: 'https://www.airbnb.com'
  }
};

export const config = {
  env,
  environment: environments[env] || environments.qa,
  browser: process.env.BROWSER || 'chrome',
  waitForElement: 10000,
  headless: process.env.HEADLESS !== 'false'
};
