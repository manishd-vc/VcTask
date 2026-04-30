/* Instruments */
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

// slices
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
import BeneficiaryReducer from './slices/beneficiary';
import CampaignReducer from './slices/campaign';
import CommonReducer from './slices/common';
import GrantReducer from './slices/grant';
import PartnerReducer from './slices/partner';
import ProfileReducer from './slices/profile';
import SettingsReducer from './slices/settings';
import StepperReducer from './slices/stepper';
import UserReducer from './slices/user';

const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(value) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    }
  };
};
const actualStorage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

/**
 * Configuration for the root persist reducer.
 * @type {Object}
 * @property {string} key - The key to store the state in the storage.
 * @property {Object} storage - The storage engine to use (localStorage by default).
 * @property {string} keyPrefix - The prefix to be used for the persisted keys.
 * @property {Array} whitelist - The list of reducers that should be persisted.
 */
const rootPersistConfig = {
  key: 'root',
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-',
  whitelist: []
};

/**
 * Configuration for persisting settings data.
 * @type {Object}
 * @property {string} key - The key to store the settings state in the storage.
 * @property {Object} storage - The storage engine to use (localStorage by default).
 * @property {string} keyPrefix - The prefix to be used for persisted settings keys.
 * @property {Array} whitelist - The list of settings that should be persisted.
 */
const settingsPersistConfig = {
  key: 'settings',
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-',
  whitelist: ['themeMode', 'themeColor', 'rate', 'currency']
};

/**
 * Configuration for persisting user data.
 * @type {Object}
 * @property {string} key - The key to store the user state in the storage.
 * @property {Object} storage - The storage engine to use (localStorage by default).
 * @property {string} keyPrefix - The prefix to be used for persisted user keys.
 * @property {Array} whitelist - The list of user data that should be persisted.
 */
const userPersistConfig = {
  key: 'user',
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-',
  whitelist: ['user', 'isAuthenticated']
};

const commonPersistConfig = {
  key: 'common', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-'
};

const stepperPersistConfig = {
  key: 'stepper', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-'
};
const profilePersistConfig = {
  key: 'profile', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-'
};
const grantPersistConfig = {
  key: 'grant', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-'
};
const partnerPersistConfig = {
  key: 'partnerrant', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-'
};

const beneficiaryPersistConfig = {
  key: 'beneficiary', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const campaignPersistConfig = {
  key: 'campaign',
  storage: actualStorage,
  keyPrefix: 'dpwf-web-redux-'
};
/**
 * Combines all reducers into one root reducer, with persisted user and settings reducers.
 * @returns {Object} The combined reducer with persisted configurations.
 */
const reducer = combineReducers({
  user: persistReducer(userPersistConfig, UserReducer),
  settings: persistReducer(settingsPersistConfig, SettingsReducer),
  stepper: persistReducer(stepperPersistConfig, StepperReducer),
  common: persistReducer(commonPersistConfig, CommonReducer),
  profile: persistReducer(profilePersistConfig, ProfileReducer),
  grant: persistReducer(grantPersistConfig, GrantReducer),
  partner: persistReducer(partnerPersistConfig, PartnerReducer),
  beneficiary: persistReducer(beneficiaryPersistConfig, BeneficiaryReducer),
  campaign: persistReducer(campaignPersistConfig, CampaignReducer)
});

export { reducer, rootPersistConfig };
