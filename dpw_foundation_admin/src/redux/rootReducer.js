/* Instruments */
import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';
const createNoopStorage = () => {
  return {
    getItem(_key) {
      return Promise.resolve(null);
    },
    setItem(_key, value) {
      return Promise.resolve(value);
    },
    removeItem(_key) {
      return Promise.resolve();
    }
  };
};
const actualStorage = typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

// Slices - reducers for different parts of the application state
import BeneficiaryReducer from './slices/beneficiary';
import CampaignReducer from './slices/campaign';
import CommonReducer from './slices/common';
import DonorReducer from './slices/donor';
import FinanceReducer from './slices/finance';
import GrantReducer from './slices/grant';
import PartnerReducer from './slices/partner';
import RolesReducer from './slices/roles';
import SettingsReducer from './slices/settings';
import StatisticsReducer from './slices/statistics';
import StepperReducer from './slices/stepper';
import UserReducer from './slices/user';
import UserByEmailReducer from './slices/user-by-email';
import VolunteerReducer from './slices/volunteer';

/**
 * Configuration for persisting the entire Redux store.
 * The store will use local storage by default, and persist the state as needed.
 */
const rootPersistConfig = {
  key: 'root', // Key used to store the persisted state
  storage: actualStorage, // Storage method, e.g., localStorage or sessionStorage
  keyPrefix: 'dpwf-admin-redux-', // Prefix for the persisted keys
  whitelist: [] // Empty whitelist means no reducers are persisted at the root level
};

/**
 * Configuration for persisting settings state.
 * Only specific keys (e.g., theme settings and currency) will be persisted.
 */
const settingsPersistConfig = {
  key: 'settings', // Key for persisted settings state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-',
  whitelist: ['themeMode', 'themeColor', 'rate', 'currency'] // Only persist these keys
};

/**
 * Configuration for persisting user state.
 * The user-related state like authentication and user data is persisted.
 */
const userPersistConfig = {
  key: 'user', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-',
  whitelist: ['user', 'isAuthenticated'] // Persist user and authentication status
};

const rolesPersistConfig = {
  key: 'roles', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const stepperPersistConfig = {
  key: 'stepper', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const campaignPersistConfig = {
  key: 'campaign', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const commonPersistConfig = {
  key: 'common', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const donorPersistConfig = {
  key: 'donor', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const statisticsPersistConfig = {
  key: 'statistics', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const userByEmailPersistConfig = {
  key: 'user-by-email', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};
const grantPersistConfig = {
  key: 'grant', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const partnerPersistConfig = {
  key: 'partner', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const volunteerPersistConfig = {
  key: 'volunteer', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const beneficiaryPersistConfig = {
  key: 'beneficiary', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-'
};

const financePersistConfig = {
  key: 'finance', // Key for persisted user state
  storage: actualStorage,
  keyPrefix: 'dpwf-admin-redux-',
  blacklist: ['showFilter'] // Don't persist showFilter - it should reset on page refresh
};

/**
 * Combines all reducers into a single root reducer.
 *
 * - The user and settings reducers are persisted using the respective persist configuration.
 * - Other reducers like roles, stepper, campaign, common, and donor are combined without persistence.
 */
const reducer = combineReducers({
  user: persistReducer(userPersistConfig, UserReducer), // Persist user state
  settings: persistReducer(settingsPersistConfig, SettingsReducer), // Persist settings state
  roles: persistReducer(rolesPersistConfig, RolesReducer), // Non-persisted roles state
  stepper: persistReducer(stepperPersistConfig, StepperReducer), // Non-persisted stepper state
  campaign: persistReducer(campaignPersistConfig, CampaignReducer), // Non-persisted campaign state
  common: persistReducer(commonPersistConfig, CommonReducer), // Non-persisted common state
  donor: persistReducer(donorPersistConfig, DonorReducer), // Non-persisted donor state
  statistics: persistReducer(statisticsPersistConfig, StatisticsReducer), // Non-persisted statistics state
  userByEmail: persistReducer(userByEmailPersistConfig, UserByEmailReducer), // Non-persisted pledges state
  grant: persistReducer(grantPersistConfig, GrantReducer),
  partner: persistReducer(partnerPersistConfig, PartnerReducer),
  volunteer: persistReducer(volunteerPersistConfig, VolunteerReducer),
  beneficiary: persistReducer(beneficiaryPersistConfig, BeneficiaryReducer),
  finance: persistReducer(financePersistConfig, FinanceReducer)
});

// Exporting the combined reducer and root persistence configuration
export { reducer, rootPersistConfig };
