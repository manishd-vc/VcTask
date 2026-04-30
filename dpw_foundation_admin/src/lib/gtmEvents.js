export const pushToDataLayer = (data) => {
  if (typeof window !== 'undefined' && window.dataLayer) {
    window.dataLayer.push(data);
  } else {
    console.warn('dataLayer not initialized');
  }
};

//  GTM Event Helper Mapping
export const gtmEvents = {
  signupSuccess: (user) => {
    pushToDataLayer({
      event: 'dl_admin_signup',
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
      value_selected: valueSelected || 'Pledge a Donation',
      section_name: sectionName || ''
    });
  },

  //  PLEDGE SUBMITTED EVENT

  pledgeSubmitted: ({
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
      event_action: 'pledge_form_submit',
      form_name: formName || 'Donation Pledge Form',
      donation_type: donationType || '',
      pledge_id: pledgeId || '', //  match naming
      pledge_amount: pledgeAmountFloat || '',
      donate_amount: donationAmountFloat || '', //  include this if you need donationAmount
      currency: donationCurrency || '',
      pledge_status: pledgeStatus || '',
      user_id: userId || '',
      user_role: userRoles
    });
  },

  // FORM APPROVED BY ADMIN EVENT
  pledgeFormApproved: ({
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
    const userRoles = Array.isArray(userRole) ? userRole.join(', ') : userRole || '';

    const pledgeAmountFloat = pledgeAmount ? parseFloat(pledgeAmount) : 0;
    const donationAmountFloat = donationAmount ? parseFloat(donationAmount) : 0;

    pushToDataLayer({
      event: 'dl_pledge_flow',
      event_action: 'pledge_form_approved',
      form_name: formName || 'Donation Pledge Form',
      donation_type: donationType || 'General',
      pledge_id: pledgeId || '',
      pledge_amount: pledgeAmountFloat || '',
      donate_amount: donationAmountFloat || '',
      currency: donationCurrency || '',
      pledge_status: pledgeStatus || 'Ready to Donate',
      user_id: userId || '',
      user_role: userRoles
    });
  }
};
