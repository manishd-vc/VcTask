export const pushToDataLayer = (data) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  } else {
    console.warn('GTM dataLayer is not defined');
  }
};

//  GTM Event Helper Mapping
export const gtmEvents = {
  //  LOGIN EVENTS

  loginInitiated: () => {
    pushToDataLayer({ event: 'dl_login_initiated' });
  },

  loginSuccess: (user) => {
    const userRoles = Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles || '';
    pushToDataLayer({
      event: 'dl_login',
      user_id: user?.userId || '',
      user_role: userRoles,
      user_type: user?.type || '',
      organization_id: user?.organization_id || '',
      organization_role: user?.organization_role || '',
      organization_name: user?.organization_name || ''
    });
  },

  loginError: (message) => {
    pushToDataLayer({
      event: 'dl_login_error',
      error_message: message || ''
    });
  },

  // SIGNUP EVENTS
  signupInitiate: () => {
    pushToDataLayer({ event: 'dl_signup_initiated' });
  },

  signupError: (errorMessage) => {
    pushToDataLayer({
      event: 'dl_signup_error',
      error_message: errorMessage || ''
    });
  },

  signupSuccess: (user) => {
    pushToDataLayer({
      event: 'dl_signup',
      user_id: user?.id || '',
      user_role: Array.isArray(user?.roles) ? user.roles.join(', ') : user?.roles || '',
      user_type: user?.accountType || '',
      organization_id: user?.organization_id || '',
      organization_role: user?.organization_role || '',
      organization_name: user?.organization_name || ''
    });
  },

  // CTA CLICK EVENTS

  pledgeClick: ({ linkName, valueSelected, sectionName }) => {
    pushToDataLayer({
      event: 'dl_cta_click',
      link_name: linkName || '',
      value_selected: valueSelected || 'Pleadge a Donation',
      section_name: sectionName || ''
    });
  },

  // FORM INITIATED

  formInitiate: ({ formName }) => {
    pushToDataLayer({
      event: 'dl_form_initiated',
      form_name: formName || ''
    });
  },

  // FORM ERROR EVENT

  formError: ({ formName, errorMessage }) => {
    pushToDataLayer({
      event: 'dl_form_error',
      form_name: formName || '',
      error_message: errorMessage || ''
    });
  },

  //  PLEDGE SUBMITTED EVENT

  pledgeSubmitted: ({
    formName,
    donationType,
    donationPledgeId,
    donationAmount,
    donationCurrency,
    pledgeAmount,
    pledgeStatus,
    userId,
    userRole
  }) => {
    const userRoles = Array.isArray(userRole) ? userRole.map((role) => role.name).join(', ') : userRole || '';

    const pledgeAmountFloat = pledgeAmount ? parseFloat(pledgeAmount) : 0;
    const donationAmountFloat = donationAmount ? parseFloat(donationAmount) : 0;

    pushToDataLayer({
      event: 'dl_pledge_flow',
      event_action: 'pledge_form_submit',
      form_name: formName || 'Donation Pledge Form',
      donation_type: donationType || '',
      pledge_id: donationPledgeId || '',
      pledge_amount: pledgeAmountFloat || '',
      donate_amount: donationAmountFloat || '', //  include this if you need donationAmount
      currency: donationCurrency || '',
      pledge_status: pledgeStatus || '',
      user_id: userId || '',
      user_role: userRoles
    });
  },

  // DONATION COMPLETE EVENT
  donationComplete: ({
    formName,
    donationType,
    pledgeId,
    pledgeAmount,
    donationAmount,
    donationCurrency,
    pledgeStatus,
    userId,
    userRole
  }) => {
    const userRoles = Array.isArray(userRole) ? userRole.map((role) => role.name).join(', ') : userRole || '';

    const pledgeAmountFloat = pledgeAmount ? parseFloat(pledgeAmount) : 0;
    const donationAmountFloat = donationAmount ? parseFloat(donationAmount) : 0;

    pushToDataLayer({
      event: 'dl_pledge_flow',
      event_action: 'donation_complete',
      form_name: formName || 'Donation Pledge Form',
      donation_type: donationType || 'General',
      pledge_id: pledgeId || '',
      pledge_amount: pledgeAmountFloat || '',
      donate_amount: donationAmountFloat || '',
      currency: donationCurrency || '',
      pledge_status: pledgeStatus || 'Donated',
      user_id: userId || '',
      user_role: userRoles
    });
  }
};
