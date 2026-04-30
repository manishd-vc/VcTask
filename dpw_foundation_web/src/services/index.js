import { saveAs } from 'file-saver';
import { getLocaleDateString } from 'src/utils/formatTime';
import http from './http';

// Export beneficiary services
export * as beneficiaryApi from './beneficiary';

export const register = async (payload) => {
  const { data } = await http.post(`/user/register`, payload);
  return data;
};
export const verifyOTP = async (payload) => {
  const { data } = await http.post(`/user/verify-otp`, payload);
  return data;
};
export const getGrants = async (page, search, status, fromDate, toDate, size = 10) => {
  const { data: response } = await http.post(`/grant/pagination?sort=updatedOn,DESC&page=${page - 1}&size=${size}`, {
    keyword: search,
    statuses: status ? [status] : [],
    createdDate: {
      fromDate: fromDate,
      toDate: toDate
    },
    datePattern: getLocaleDateString(true)
  });
  return response;
};
export const resendOTP = async (payload) => {
  const { data } = await http.post(`/user/forgot-password`, payload);
  return data;
};
export const changePassword = async ({ ...payload }) => {
  const { data } = await http.post(`/user/change-password`, payload);
  return data;
};
export const login = async (payload) => {
  const { data } = await http.post(`/user/ext/signin`, payload);
  return data;
};
export const logOutAdmin = async () => {
  const { data } = await http.get('/user/logout');
  return data;
};
export const resetProfileData = async (token) => {
  const { data } = await http.get('/user/reset-profile/' + token);
  return data;
};
export const updateProfile = async ({ ...payload }) => {
  const { data } = await http.put(`/user/profile/update/${payload.userId}`, payload);
  return data;
};
export const getProfile = async () => {
  const { data } = await http.get(`/user/profile`);
  return data;
};

export const forgetPassword = async (payload) => {
  const { data } = await http.post('/user/ext/forgot-password', payload);
  return data;
};
export const resendActivationEmail = async ({ email }) => {
  const { data } = await http.get(`/user/resend-activation-email?emailId=${email}`);
  return data;
};
export const makeDonation = async (payload) => {
  const { data } = await http.post('/user/ext/make-donation', payload);
  return data;
};

export const resetPassword = async ({ password, token }) => {
  const { data } = await http.post('/user/reset-password', {
    password: password,
    token: token
  });
  return data;
};

export const getStates = async (countryCode) => {
  const { data } = await http.get(`/campaign/csc/states/${countryCode}`);
  return data?.data;
};

export const getCountry = async () => {
  const { data } = await http.get(`/campaign/csc/countries`);
  return data?.data;
};
export const updateExternalUser = async ({ id, payload }) => {
  const { data } = await http.put(`/user/profile/${id}/update`, payload);
  return data;
};

export const withDraw = async ({ id, payload }) => {
  const { data } = await http.post(`campaign/donor//pledge/${id}/withdraw`, payload);
  return data;
};

export const getUpcomming = async (payload) => {
  const { data } = await http.post('/campaign/publish/pagination?page=0', payload);
  return data;
};

export const getVolunteerOpportunities = async (payload) => {
  const { data } = await http.post('/campaign/publish/volunteer/pagination', payload);
  return data;
};
export const getVolunteerCampaignDetails = async (slug) => {
  const { data } = await http.get(`/campaign/publish/volunteer/${slug}`);
  return data.data;
};
export const getCampaignDetails = async (pid) => {
  const { data } = await http.get(`/campaign/publish/${pid}`);
  return data.data;
};
export const makePledge = async (payload) => {
  const { data } = await http.post(`/campaign/donor/pledge/create`, payload);
  return data;
};
export const masterDataFetch = async (payload) => {
  const { data } = await http.post(`/campaign/master/types/fetch-all`, payload);
  return data?.data;
};
export const getMyDonations = async (page, search, status, fromDate, toDate, size = 10) => {
  const { data: response } = await http.post(
    `/campaign/donor/pagination?sort=updatedOn,DESC&page=${page - 1}&size=${size}`,
    {
      keyword: search,
      statuses: status ? [status] : [],
      createdDate: {
        fromDate: fromDate,
        toDate: toDate
      },
      datePattern: getLocaleDateString(true)
    }
  );
  return response;
};

export const donateNow = async (request) => {
  const { data: response } = await http.post(
    `/campaign/donor/payment/initiate
`,
    request
  );
  return response;
};
export const downloadMedia = async (id) => {
  const { data } = await http.get(`/campaign/file/download/${id}`, {
    responseType: 'blob',
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  });
  return data;
};

export const downloadAcceptanceLetter = async (id) => {
  const { data } = await http.get(`/campaign/donor/pledge/${id}/letter`, {
    responseType: 'blob'
  });
  return data;
};

export const getDonationDetailById = async (pledgeId) => {
  const { data } = await http.get(`/campaign/donor/pledge/${pledgeId}`);
  return data;
};

export const getMediaList = async ({ type, moduleList, id }) => {
  const params = new URLSearchParams();
  moduleList.forEach((module) => params.append('moduleList', module));
  const { data } = await http.get(`/campaign/file/list/${type}/${id}?${params.toString()}`);
  return data?.data;
};
export const getAssessmentDetailById = async (donorId, pledgeId) => {
  const { data } = await http.get(`/campaign/donor/assessment-form/${pledgeId}`);
  return data;
};

export const deleteMedia = async (id) => {
  const { data } = await http.delete(`/campaign/file/delete/${id}`);
  return data;
};

export const deleteCampaignMedia = async (id) => {
  const { data } = await http.delete(`/campaign/file/delete/${id}`);
  return data;
};

export const deleteDocumentMedia = async ({ userId, id }) => {
  const { data } = await http.delete(`/user/${userId}/document-detail-file?fileId=${id}`);
  return data;
};

export const uploadFiles = async ({ entityId, parentEntityId, entityType, moduleType, payload }) => {
  let url = `/campaign/file/upload?entityId=${entityId}&entityType=${entityType}&moduleType=${moduleType}`;
  if (parentEntityId) {
    url = `/campaign/file/upload?entityId=${entityId}&parentEntityId=${parentEntityId}&entityType=${entityType}&moduleType=${moduleType}`;
  }
  const { data } = await http.post(url, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const uploadCampaignFiles = async ({ entityId, parentEntityId, entityType, moduleType, payload }) => {
  // Delegate to the generic uploadFiles function to avoid code duplication
  return await uploadFiles({ entityId, parentEntityId, entityType, moduleType, payload });
};

export const updateDonor = async (payload) => {
  const { data } = await http.post(`/campaign/donor/assessment-form`, payload);
  return data;
};

export const logout = async () => {
  const { data } = await http.post('/user/sign-out', null);
  return data;
};

export const getNotifications = async (page) => {
  const { data } = await http.get(`/admin/notifications?limit=${page}`, {});
  return data;
};

//  unused
export const adminDashboardAnalytics = async () => {
  const { data } = await http.get(`/admin/dashboard-analytics`);
  return data;
};
export const getBrandsByAdmin = async (page, search) => {
  const { data } = await http.get(`/admin/brands?search=${search}&page=${page}`);
  return data;
};
export const getBrandByAdmin = async (id) => {
  const { data } = await http.get(`/admin/brands/${id}`);
  return data;
};
export const getAllBrandsByAdmin = async () => {
  const { data } = await http.get(`/admin/all-brands`);
  return data;
};
export const addBrandByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/brands`, payload);
  return data;
};
export const updateBrandByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/brands/${currentSlug}`, payload);
  return data;
};
export const deleteBrandByAdmin = async (slug) => {
  const { data } = await http.delete(`/admin/brands/${slug}`);
  return data;
};

export const getSubCategoryByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/subcategories/${slug}`);
  return data;
};
export const getSubCategoriesByAdmin = async (params) => {
  const { data } = await http.get(`/admin/subcategories?${params}`);
  return data;
};
export const deleteSubCategoryByAdmin = async (slug) => {
  const { data } = await http.delete(`/admin/subcategories/${slug}`);
  return data;
};
export const addSubCategoryByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/subcategories`, payload);
  return data;
};
export const updateSubCategoryByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/subcategories/${currentSlug}`, payload);
  return data;
};

export const getProductsByAdmin = async (params) => {
  const { data: response } = await http.get(`/admin/products?${params}`);
  return response;
};
export const createProductByAdmin = async (payload) => {
  const { data: response } = await http.post(`/admin/products`, payload);
  return response;
};
export const updateProductByAdmin = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(`/admin/products/${currentSlug}`, payload);
  return response;
};

export const deleteProductByAdmin = async (slug) => {
  const { data: response } = await http.delete(`/admin/products/${slug}`);
  return response;
};

export const getOrdersByAdmin = async (payload) => {
  const { data } = await http.get(`/admin/orders?${payload}`);
  return data;
};
export const getOrderByAdmin = async (id) => {
  const { data } = await http.get(`/admin/orders/${id}`);
  return data;
};
export const deleteOrderByAdmin = async (id) => {
  const { data } = await http.delete(`/admin/orders/${id}`);
  return data;
};
export const updateOrderStatus = async ({ id, ...payload }) => {
  const { data } = await http.put(`/admin/orders/${id}`, payload);
  return data;
};
export const getUserByAdminsByAdmin = async (page, search) => {
  const { data: response } = await http.get(`/admin/users?search=${search}&page=${page}`);
  return response;
};
export const getUserByAdmin = async (id) => {
  const { data: response } = await http.get(`/admin/users/${id}`);
  return response;
};
export const updateUserRoleByAdmin = async (id) => {
  const { data: response } = await http.post(`/admin/users/role/${id}`);
  return response;
};

export const getCouponCodesByAdmin = async (page, search) => {
  const { data: response } = await http.get(`/admin/coupon-codes?search=${search}&page=${page}`);
  return response;
};

export const getCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.get(`/admin/coupon-codes/${id}`);
  return response;
};

export const addCouponCodeByAdmin = async (payload) => {
  const { data: response } = await http.post(`/admin/coupon-codes`, payload);
  return response;
};
export const updateCouponCodeByAdmin = async ({ currentId, ...others }) => {
  const { data: response } = await http.put(`/admin/coupon-codes/${currentId}`, others);
  return response;
};
export const deleteCouponCodeByAdmin = async (id) => {
  const { data: response } = await http.delete(`/admin/coupon-codes/${id}`);
  return response;
};

export const getNewsletter = async (page) => {
  const { data } = await http.get(`/admin/newsletter?page=${page}`);
  return data;
};
export const getShopDetailsByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/shops/${slug}`);
  return data;
};
export const addAdminShopByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/shops`, payload);
  return data;
};
export const updateAdminShopByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/shops/${currentSlug}`, payload);
  return data;
};
export const deleteShop = async (slug) => {
  const { data: response } = await http.delete(`/admin/shops/${slug}`);
  return response;
};
export const getLowStockProductsByAdmin = async (page) => {
  const { data: response } = await http.get(`/admin/low-stock-products?page=${page}`);
  return response;
};
export const getShopsByAdmin = async (page, search) => {
  const { data: response } = await http.get(`/admin/shops?search=${search}&page=${page}`);
  return response;
};
export const getShopIncomeByAdmin = async (slug, page) => {
  const { data } = await http.get(`/admin/shops/${slug}/income?page=${page || 1}`);

  return data;
};
export const getIncomeDetailsByAdmin = async (pid, page) => {
  const { data } = await http.get(`/admin/payments/${pid}?page=${page || 1}`);
  return data;
};
export const editPaymentByAdmin = async ({ pid, ...payload }) => {
  const { data } = await http.put(`/admin/payments/${pid}`, { ...payload });
  return data;
};
export const createPaymentByAdmin = async ({ ...payload }) => {
  const { data } = await http.post(`/admin/payments`, { ...payload });
  return data;
};
export const getPayoutsByAdmin = async (params) => {
  const { data } = await http.get(`/admin/payouts?${params}`);
  return data;
};
export const getAllShopsByAdmin = async () => {
  const { data } = await http.get(`/admin/all-shops`);
  return data;
};
export const getCompaignsByAdmin = async (page, search) => {
  const { data } = await http.get(`/admin/compaigns?page=${page || 1}&search=${search || ''}`);
  return data;
};
export const addCompaignByAdmin = async (payload) => {
  const { data } = await http.post(`/admin/compaigns`, payload);
  return data;
};
export const updateCompaignByAdmin = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/admin/compaigns/${currentSlug}`, payload);
  return data;
};
export const getCompaignByAdmin = async (slug) => {
  const { data } = await http.get(`/admin/compaigns/${slug}`);
  return data;
};
export const deleteCompaignByAdmin = async (slug) => {
  const { data } = await http.delete(`/admin/compaigns/${slug}`);
  return data;
};

export const getVendorProductBySlug = async (slug) => {
  const { data } = await http.get(`/vendor/products/${slug}`);
  return data;
};
export const getVendorShop = async () => {
  const { data } = await http.get(`/vendor/shop`);
  return data;
};
export const vendorDashboardAnalytics = async () => {
  const { data } = await http.get(`/vendor/dashboard-analytics`);
  return data;
};
export const getVendorLowStockProducts = async (page) => {
  const { data: response } = await http.get(`/vendor/low-stock-products?page=${page}`);
  return response;
};
export const getVendorProducts = async (page, search) => {
  const { data: response } = await http.get(`/vendor/products?search=${search}&page=${page}`);
  return response;
};
export const deleteVendorProduct = async (slug) => {
  const { data: response } = await http.delete(`/vendor/products/${slug}`);
  return response;
};
export const createVendorProduct = async (payload) => {
  const { data: response } = await http.post(`/vendor/products`, payload);
  return response;
};
export const updateVendorProduct = async ({ currentSlug, ...payload }) => {
  const { data: response } = await http.put(`/vendor/products/${currentSlug}`, payload);
  return response;
};
export const getOrdersByVendor = async (payload) => {
  const { data } = await http.get(`/vendor/orders?${payload}`);
  return data;
};
export const addShopByVendor = async (payload) => {
  const { data } = await http.post(`/vendor/shops`, payload);
  return data;
};
export const updateShopByVendor = async ({ currentSlug, ...payload }) => {
  const { data } = await http.put(`/vendor/shops/${currentSlug}`, payload);
  return data;
};
export const getShopDetailsByVendor = async () => {
  const { data } = await http.get(`/vendor/shop/stats`);
  return data;
};
export const getIncomeByVendor = async (slug, page) => {
  const { data } = await http.get(`/vendor/shops/income?page=${page || 1}`);
  return data;
};

export const getProducts = async (cat, rate, query = '') => {
  const { data } = await http.get(`/products${query || '?'}&rate=${rate}`);
  return data;
};
export const getProductDetails = async (pid) => {
  const { data } = await http.get(`/products/${pid}`);
  return data;
};

export const getBanners = async () => {
  const { data } = await http.get(`/banner`);
  return data;
};

export const getProductsByCategory = async (category, rate, query = '') => {
  const { data } = await http.get(`/category/products/${category}${query || '?'}&rate=${rate}`);
  return data;
};
export const getProductsByCompaign = async (slug, rate, query = '') => {
  const { data } = await http.get(`/compaign/products/${slug}${query || '?'}&rate=${rate}`);
  return data;
};

export const getProductSlugs = async () => {
  const { data } = await http.get(`/products-slugs`);
  return data;
};
export const getProductsBySubCategory = async (subcategory, rate, query = '') => {
  const { data } = await http.get(`/subcategory/products/${subcategory}${query || '?'}&rate=${rate}`);
  return data;
};

export const getProductsByShop = async (shop, rate, query = '') => {
  const { data } = await http.get(`/shop/products/${shop}${query || '?'}&rate=${rate}`);
  return data;
};

export const getAllProducts = async () => {
  const { data } = await http.get(`/products/all`);
  return data;
};
export const getAllFilters = async () => {
  const { data } = await http.get(`/products/filters`);
  return data;
};

export const getNewProducts = async () => {
  const { data } = await http.get(`/products/new`);
  return data;
};
export const getFiltersByShop = async (shop) => {
  const { data } = await http.get(`/filters/${shop}`);
  return data;
};

export const getNewArrivels = async () => {
  const { data } = await http.get('/new-arrivals');
  return data;
};
export const getRelatedProducts = async (pid) => {
  const { data } = await http.get(`/related-products/${pid}`);
  return data;
};
export const getProductBySlug = async (slug) => {
  const { data } = await http.get(`/products/${slug}`);
  return data;
};

export const getProductReviews = async (pid) => {
  const { data } = await http.get(`/reviews/${pid}`);
  return data;
};
export const addReview = async (payload) => {
  const { data } = await http.post(`/reviews`, payload);
  return data;
};

export const getUserInvoice = async (page) => {
  const { data: response } = await http.get(`/users/invoice${page}`);
  return response;
};

export const getAddress = async (payload) => {
  const { data } = await http.get(`/users/addresses?id=${payload}`);
  return data;
};
export const updateAddress = async ({ _id, ...payload }) => {
  const { data } = await http.put(`/users/addresses/${_id}`, payload);
  return data;
};
export const createAddress = async ({ ...payload }) => {
  const { data } = await http.post(`/users/addresses/`, payload);
  return data;
};
export const deleteAddress = async ({ _id }) => {
  const { data } = await http.delete(`/users/addresses/${_id}`);
  return data;
};
export const search = async (payload) => {
  const { data } = await http.post(`/search`, payload);
  return data;
};
export const getSearchFilters = async () => {
  const { data } = await http.get(`/search-filters`);
  return data;
};
export const getInvoices = async () => {
  const { data } = await http.get(`/users/invoice`);
  return data;
};
export const placeOrder = async (payload) => {
  const { data } = await http.post(`/orders`, payload);
  return data;
};
export const getLayout = async () => {
  const { data } = await http.get(`/layout`);
  return data;
};
export const singleDeleteFile = async (id) => {
  const { data } = await http.delete(`/delete-file/${id}`);
  return data;
};

export const sendNewsletter = async (payload) => {
  const { data } = await http.post(`/newsletter`, payload);
  return data;
};

export const getWishlist = async () => {
  const { data } = await http.get(`/wishlist`);
  return data;
};
export const updateWishlist = async (pid) => {
  const { data } = await http.post(`/wishlist`, { pid });
  return data;
};
export const getCompareProducts = async (products) => {
  const { data } = await http.post(`/compare/products`, { products });
  return data;
};

export const getCart = async (ids) => {
  const { data } = await http.post(`/cart`, {
    products: ids
  });
  return data;
};

export const getHomeCategories = async () => {
  const { data } = await http.get(`/home/categories`);
  return data;
};

export const getHomeShops = async () => {
  const { data } = await http.get(`/shops?limit=5`);
  return data;
};
export const getHomeCompaigns = async () => {
  const { data } = await http.get(`/compaigns`);
  return data;
};
export const getBestSellingProducts = async () => {
  const { data } = await http.get(`/home/products/best-selling`);
  return data;
};
export const getFeaturedProducts = async () => {
  const { data } = await http.get(`/home/products/featured`);
  return data;
};

export const getTopRatedProducts = async () => {
  const { data } = await http.get(`/home/products/top`);
  return data;
};
export const getHomeBrands = async () => {
  const { data } = await http.get(`/home/brands`);
  return data;
};
export const getBrands = async () => {
  const { data } = await http.get(`/brands`);
  return data;
};
export const applyCouponCode = async (code) => {
  const { data: response } = await http.get(`/coupon-codes/${code}`);
  return response;
};

export const activationLink = async (id) => {
  const { data: response } = await http.get(`/user/activate?tokenId=${id}`);
  return response;
};

export const paymentIntents = async (amount, currency, note = 'Online purchase') => {
  const { data } = await http.post(`/payment-intents`, {
    amount,
    currency,
    description: note
  });
  return data;
};

export const addShopByUser = async (payload) => {
  const { data } = await http.post(`/shops`, {
    ...payload
  });

  return data;
};
export const getShopByUser = async () => {
  const { data } = await http.get(`/user/shop`);
  return data;
};

export const getShops = async () => {
  const { data } = await http.get(`/shops`);
  return data;
};

export const getCategoryTitle = async (category) => {
  const { data } = await http.get(`/category-title/${category}`);
  return data;
};

export const getCategoryBySlug = async (category) => {
  const { data } = await http.get(`/categories/${category}`);
  return data;
};

export const getCategorySlugs = async () => {
  const { data } = await http.get(`/categories-slugs`);
  return data;
};
export const getShopSlugs = async () => {
  const { data } = await http.get('/shops-slugs');
  return data;
};
export const getShopBySlug = async (shop) => {
  const { data } = await http.get(`/shops/${shop}`);
  return data;
};
export const getShopTitle = async (shop) => {
  const { data } = await http.get(`/shop-title/${shop}`);
  return data;
};

export const getSubCategoryTitle = async (subcategory) => {
  const { data } = await http.get(`/subcategory-title/${subcategory}`);
  return data;
};
export const getSubCategoryBySlug = async (subcategory) => {
  const { data } = await http.get(`/subcategories/${subcategory}`);
  return data;
};

export const getSubCategorySlugs = async () => {
  const { data } = await http.get(`/subcategories-slugs`);
  return data;
};

export const getCompaignSlugs = async () => {
  const { data } = await http.get('/compaigns-slugs');
  return data;
};
export const getCompaignBySlug = async (slug) => {
  const { data } = await http.get(`/compaigns/${slug}`);
  return data;
};
export const getCompaignTitle = async (slug) => {
  const { data } = await http.get(`/compaign-title/${slug}`);
  return data;
};

export const followShop = async (shopId) => {
  const { data } = await http.put(`/shops/${shopId}/follow`);
  return data;
};
export const getAdvertiseImages = async () => {
  const { data } = await http.get(`/advertise`);
  return data;
};
export const getAddSenseData = async () => {
  const { data } = await http.get(`/add-sense`);
  return data;
};
export const getFaqData = async () => {
  const { data } = await http.get(`/faqs`);
  return data;
};
export const getBlogData = async () => {
  const { data } = await http.get(`/blog`);
  return data;
};
export const getBlogSlugs = async (slug) => {
  const { data } = await http.get('/blog-slugs/' + slug);
  return data;
};
export const submitContact = async (payload) => {
  const { data } = await http.post(`/contact`, payload);
  return data;
};
export const getReviews = async () => {
  const { data } = await http.get(`/app-reviews`);
  return data;
};
export const getLookbook = async () => {
  const { data } = await http.get(`/lookup`);
  return data;
};
export const fetchNotifications = async (obj) => {
  try {
    const { data } = await http.post(`/campaign/notifications/pagination`, obj);
    return data;
  } catch (error) {
    console.error('Error fetching notifications:', error);
    throw error; // or handle error as needed
  }
};
/**
 * Retrieves a list of cities for a given country and state.
 *
 * @param {string} countryCode - The code of the country.
 * @param {string} stateCode - The code of the state.
 * @returns {Promise<Object>} - The response containing the cities for the country and state.
 */
export const getCities = async (countryCode, stateCode) => {
  const { data } = await http.get(`/campaign/csc/cities/state/${countryCode}/${stateCode}`);
  return data?.data;
};

export const uploadProfilePhoto = async ({ payload }) => {
  const { data } = await http.post(`/user/upload-my-profile`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const uploadNeedMoreInfo = async (id, type, payload) => {
  const formData = new FormData();
  formData.append('file', payload[0]);
  const { data } = await http.post(`/campaign/donor/upload-need-info?id=${id}&type=${type}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const downloadAllDocuments = async (payload) => {
  const { data } = await http.post(`/campaign/file/url-by-ids`, payload);
  return data?.data || [];
};

export const downloadDonationReceipt = async (pledgeId) => {
  const response = await http.get(`/campaign/donor/admin/on-spot-donation/receipt?pledgeId=${pledgeId}`, {
    responseType: 'blob' // Important: Treat the response as a binary blob
  });
  return response.data;
};

export const campaignDonorStatusUpdate = async ({ id, ...payload }) => {
  const { data } = await http.put(`/campaign/donor/${id}/status-update`, payload);
  return data;
};

export const exportCampaignByUser = async ({ page, rows, type, search, status, fromDate, toDate }) => {
  try {
    const response = await http.post(
      `/campaign/donor/exportdata?page=${page}&size=${rows}`,
      {
        keyword: search,
        datePattern: getLocaleDateString(),
        statuses: status ? [status] : [],
        createdDate: {
          fromDate,
          toDate
        }
      },
      { responseType: 'blob' }
    );
    const contentDisposition = response.headers['content-disposition'];
    const filename = contentDisposition
      ? contentDisposition.split('filename=')[1].replace(/"/g, '')
      : `${type}_${new Date().toISOString()}.xlsx`;
    const blob = new Blob([response.data], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    });
    saveAs(blob, filename);

    return {
      message: 'Data exporeted successfully'
    };
  } catch (error) {
    console.error('Error exporting campaigns:', error);
    throw error;
  }
};

export const getPaymentMethods = async ({
  soTransactionID,
  cepgReferenceNumber,
  result,
  message,
  fiReferenceNumber,
  serviceCost,
  processingCharges,
  status,
  paymentInstrument,
  fiDate,
  signature
}) => {
  const { data } = await http.get(
    `/campaign/donor/payment/complete?soTransactionID=${soTransactionID}&cepgReferenceNumber=${cepgReferenceNumber}&result=${result}&message=${message}&fiReferenceNumber=${fiReferenceNumber}&serviceCost=${serviceCost}&processingCharges=${processingCharges}&status=${status}&paymentInstrument=${paymentInstrument}&fiDate=${fiDate}&signature=${signature} `
  );
  return data;
};

export const uploadDonorSignature = async ({ payload, entityId }) => {
  const { data } = await http.post(`/campaign/donor/agreement-sign?entityId=${entityId}&&type=normal`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const validateTokenPayment = async (payload) => {
  const { data } = await http.post(`/campaign/donor/payment/validate-token`, payload);
  return data;
};

export const grantWithDraw = async ({ id, payload }) => {
  const { data } = await http.post(`grant/${id}/withdraw`, payload);
  return data;
};

export const grantDelete = async ({ id, payload }) => {
  const { data } = await http.delete(`grant/${id}/delete`, payload);
  return data;
};

export const enrollDelete = async ({ id, payload }) => {
  const { data } = await http.delete(`/campaign/enrollments/ext/${id}/delete`, payload);
  return data;
};

export const withdrawInKindContribution = async (id, payload) => {
  const { data } = await http.post(`/grant/contributions/ext/${id?.id}/withdraw`, payload);
  return data;
};
