import { AsyncStorage } from 'react-native';

export const AUTH_LOCATION_PIN_KEY = 'AUTH_LOCATION_PIN';

export const AUTH_LOCATION_KEY = 'AUTH_LOCATION';
export const AUTH_LOCATION_ENABLE = '1';
export const AUTH_LOCATION_DISABLE = '0';

export default class LocalAuthenticationService {
  async set(value) {
    try {
      await AsyncStorage.setItem(AUTH_LOCATION_KEY, value.toString());
    } catch (e) {
      throw e;
    }
  }

  async get() {
    try {
      const value = await AsyncStorage.getItem(AUTH_LOCATION_KEY);
      return value;
    } catch (e) {
      throw e;
    }
  }

  async isEnable() {
    try {
      const data = await this.get();
      return data === AUTH_LOCATION_ENABLE;
    } catch (e) {
      throw e;
    }
  }

  async setPin(value) {
    try {
      await AsyncStorage.setItem(AUTH_LOCATION_PIN_KEY, value.toString());
    } catch (e) {
      throw e;
    }
  }

  async getPin() {
    try {
      const value = await AsyncStorage.getItem(AUTH_LOCATION_PIN_KEY);
      return value;
    } catch (e) {
      throw e;
    }
  }
}
