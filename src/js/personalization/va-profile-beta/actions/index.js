import { apiRequest } from '../../../../platform/utilities/api';
import { isValidEmail, isValidPhone } from '../../../../platform/forms/validations';

export const VA_PROFILE_READY = 'VA_PROFILE_READY';
export const OPEN_MODAL = 'OPEN_MODAL';

export const UPDATE_PROFILE_FORM_FIELD = 'UPDATE_PROFILE_FORM_FIELD';

export const FETCH_VA_PROFILE = 'FETCH_VA_PROFILE';
export const FETCH_VA_PROFILE_FAIL = 'FETCH_VA_PROFILE_FAIL';
export const FETCH_VA_PROFILE_SUCCESS = 'FETCH_VA_PROFILE_SUCCESS';

export const FETCH_ADDRESS_STATES = 'FETCH_ADDRESS_STATES';
export const FETCH_ADDRESS_STATES_SUCCESS = 'FETCH_ADDRESS_STATES_SUCCESS';
export const FETCH_ADDRESS_STATES_FAIL = 'FETCH_ADDRESS_STATES_FAIL';

export const FETCH_ADDRESS_COUNTRIES = 'FETCH_ADDRESS_COUNTRIES';
export const FETCH_ADDRESS_COUNTRIES_SUCCESS = 'FETCH_ADDRESS_COUNTRIES_SUCCESS';
export const FETCH_ADDRESS_COUNTRIES_FAIL = 'FETCH_ADDRESS_COUNTRIES_FAIL';

export const SAVE_MAILING_ADDRESS = 'SAVE_MAILING_ADDRESS';
export const SAVE_MAILING_ADDRESS_FAIL = 'SAVE_MAILING_ADDRESS_FAIL';
export const SAVE_MAILING_ADDRESS_SUCCESS = 'SAVE_MAILING_ADDRESS_SUCCESS';

export const SAVE_PRIMARY_PHONE = 'SAVE_PRIMARY_PHONE';
export const SAVE_PRIMARY_PHONE_FAIL = 'SAVE_PRIMARY_PHONE_FAIL';
export const SAVE_PRIMARY_PHONE_SUCCESS = 'SAVE_PRIMARY_PHONE_SUCCESS';

export const SAVE_ALTERNATE_PHONE = 'SAVE_ALTERNATE_PHONE';
export const SAVE_ALTERNATE_PHONE_FAIL = 'SAVE_ALTERNATE_PHONE_FAIL';
export const SAVE_ALTERNATE_PHONE_SUCCESS = 'SAVE_ALTERNATE_PHONE_SUCCESS';

export const SAVE_EMAIL_ADDRESS = 'SAVE_EMAIL_ADDRESS';
export const SAVE_EMAIL_ADDRESS_FAIL = 'SAVE_EMAIL_ADDRESS_FAIL';
export const SAVE_EMAIL_ADDRESS_SUCCESS = 'SAVE_EMAIL_ADDRESS_SUCCESS';

export const CLEAR_PROFILE_ERRORS = 'CLEAR_PROFILE_ERRORS';
export const CLEAR_MESSAGE = 'CLEAR_MESSAGE';

function updateProfileFormField(field, validator) {
  return (value, dirty) => {
    const errorMessage = validator && dirty ? validator(value) : '';
    return {
      type: UPDATE_PROFILE_FORM_FIELD,
      field,
      newState: {
        value,
        errorMessage
      }
    };
  };
}

function saveFieldHandler(apiRoute, requestStartAction, requestSuccessAction, requestFailAction, method = 'POST') {
  return fieldValue => {
    return dispatch => {
      const options = {
        body: JSON.stringify(fieldValue),
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      dispatch({ type: requestStartAction });
      return apiRequest(apiRoute, options)
        .then(response => dispatch({ type: requestSuccessAction, newValue: response.data.attributes }))
        .catch(() => dispatch({ type: requestFailAction }));
    };
  };
}

async function sendProfileRequests() {
  const result = {};
  const requests = [
    ['email', '/profile/email'],
    ['primaryTelephone', '/profile/primary_phone'],
    ['alternateTelephone', '/profile/alternate_phone'],
    ['mailingAddress', '/profile/mailing_address'],
    ['serviceHistory', '/profile/service_history'],
    ['personalInformation', '/profile/personal_information'],
    ['userFullName', '/profile/full_name']
  ];

  /* eslint-disable no-await-in-loop */
  for (const [property, url] of requests) {
    try {
      const response = await apiRequest(url);
      result[property] = response.data.attributes;
    } catch (err) {
      // Allow the property to remain undefined
    }
  }

  return result;
}

export function fetchVaProfile() {
  return async (dispatch) => {
    dispatch({ type: FETCH_VA_PROFILE });
    try {
      const vaProfile = await sendProfileRequests();
      dispatch({ type: FETCH_VA_PROFILE_SUCCESS, newState: vaProfile });
    } catch (err) {
      dispatch({ type: FETCH_VA_PROFILE_FAIL });
    }
  };
}

export function openModal(modal) {
  return { type: OPEN_MODAL, modal };
}

function validateEmail({ email }) {
  return isValidEmail(email) ? '' : 'Please enter a valid email.';
}

function validateTelephone({ number }) {
  return isValidPhone(number) ? '' : 'Please enter a valid phone.';
}

export const updateFormField = {
  email: updateProfileFormField('email', validateEmail),
  mailingAddress: updateProfileFormField('mailingAddress'),
  primaryTelephone: updateProfileFormField('primaryTelephone', validateTelephone),
  alternateTelephone: updateProfileFormField('alternateTelephone', validateTelephone)
};

export const saveField = {
  updateEmailAddress: saveFieldHandler(
    '/profile/email',
    SAVE_EMAIL_ADDRESS,
    SAVE_EMAIL_ADDRESS_SUCCESS,
    SAVE_EMAIL_ADDRESS_FAIL),

  updatePrimaryPhone: saveFieldHandler(
    '/profile/primary_phone',
    SAVE_PRIMARY_PHONE,
    SAVE_PRIMARY_PHONE_SUCCESS,
    SAVE_PRIMARY_PHONE_FAIL),

  updateAlternatePhone: saveFieldHandler(
    '/profile/alternate_phone',
    SAVE_ALTERNATE_PHONE,
    SAVE_ALTERNATE_PHONE_SUCCESS,
    SAVE_ALTERNATE_PHONE_FAIL),

  updateMailingAddress: saveFieldHandler(
    '/profile/mailing_address',
    SAVE_MAILING_ADDRESS,
    SAVE_MAILING_ADDRESS_SUCCESS,
    SAVE_MAILING_ADDRESS_FAIL,
    'PUT')
};

export function clearErrors() {
  return { type: CLEAR_PROFILE_ERRORS };
}

export function clearMessage() {
  return { type: CLEAR_MESSAGE };
}

export function fetchAddressCountries() {
  return (dispatch) => {
    return apiRequest('/address/countries')
      .then(response => dispatch({ type: FETCH_ADDRESS_COUNTRIES_SUCCESS, countries: response.data.attributes.countries }));
  };
}

export function fetchAddressStates() {
  return (dispatch) => {
    return apiRequest('/address/states')
      .then(response => dispatch({ type: FETCH_ADDRESS_STATES_SUCCESS, states: response.data.attributes.states }));
  };
}

export function startup() {
  return async (dispatch) => {
    try {
      await dispatch(fetchVaProfile());
      await dispatch(fetchAddressCountries());
      await dispatch(fetchAddressStates());
    } catch (err) {
      // There are error handlers throughout the app
    } finally {
      dispatch({ type: VA_PROFILE_READY });
    }
  };
}
