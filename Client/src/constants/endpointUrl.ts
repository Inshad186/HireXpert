export const endpointUrl = {
  SIGNUP : "/auth/signup",
  LOGIN : "/auth/login",
  VERIFY_OTP : "/auth/verifyOtp",
  RESEND_OTP : "/auth/resendOtp",
  ASSIGN_ROLE : "/auth/assignRole",
  CHANGE_PROFILE : "/auth/changeProfile",
  EDIT_USER_NAME : '/auth/edit-user-name',
  GET_PROFILE_IMAGE : "/auth/get-profile-img",
  GET_FREELANCER : "/auth/get-freelancer",
  REFRESH_TOKEN : "/auth/refreshToken",
  FORGET_PASSWORD : "/auth/forget-password",
  FP_VERIFY_OTP : "/auth/fp-verify-otp",
  RESET_PASSWORD : "/auth/reset-password",
  GOOGLE_AUTH : "/auth/google-auth",
  GET_CLIENT_FULLPROFILE : "/auth/getClientFullProfile",
  GET_FREELANCER_FULLPROFILE : "/auth/getFreelancerFullProfile",
  LOGOUT : '/auth/logout',
}

export const clientEndpointUrl = {
  UPDATE_CLIENT_PROFILE : "/auth/client/update-clientProfile",
  GET_GIGS: "/auth/client/get-gigs",
  GET_PROJECTDETAIL : "/auth/client/get-ProjectDetail",
  CREATE_ORDER : "/auth/client/create-order",
  GET_MYORDERS : "/auth/client/my-orders",
  ACCEPT_ORDERS : "/auth/client/accept-orders",
  REQUEST_REVISION : "/auth/client/request-revision",
  CREATE_PAYMENT_INTENT : "/auth/client/create-payment-intent"
}

export const freelancerEndpointUrl = {
  UPDATE_FREELANCER_PROFILE : "/auth/freelancer/update-freelancerProfile",
  CREATE_GIG : "/auth/freelancer/create-gig",
  LISTED_GIG : "/auth/freelancer/listed-gig",
  UPDATE_GIG_STATUS : "/auth/freelancer/update-gig-status",
  UPDATE_ISSELLER : "/auth/freelancer/update-isSeller",
  GET_FREELANCER_DASHSTATS : "/auth/freelancer/freelancer-dashStats",
  GET_ORDERLIST : "/auth/freelancer/order-list",
  GET_ORDERS : "/auth/freelancer/orders",
  ACCEPT_ORDER : "/auth/freelancer/accept-order",
  REJECT_ORDER : "/auth/freelancer/reject-order",
  INPROGRESS_ORDER : "/auth/freelancer/inProgress-order",
  DELIVERY_ORDER : "/auth/freelancer/delivery-order",
  STRIPE_ONBOARDING : "/auth/freelancer/stripe-onboarding",
  STRIPE_STATUS : "/auth/freelancer/stripe-status",
}

export const notificationEndpointUrl = {
  GET_NOTIFICATION : "/auth/notification/get-notify",
  MARK_AS_READ : "/auth/notification/mark-as-read",
  DELETE_NOTIFICATION : "/auth/notification/delete-notification",
}

export const adminEndpointUrl = {
  LOGIN : "/auth/admin/login",
  DASHBOARD_STATS : "/auth/admin/dashboardStats",
  USERS_LIST : "/auth/admin/usersList",
  ORDER_LIST : "/auth/admin/ordersList",
  BLOCK_USER : "/auth/admin/block-user",
  ADD_CATEGORIES : "/auth/admin/addCategories",
  GET_CATEGORIES : "/auth/admin/getCategories",
  GET_SKILLS : "/auth/admin/getSkills",
  EDIT_SKILLS : "/auth/admin/editSkills",
  ADD_SKILLS : "/auth/admin/addSkills",
  DELETE_CATEGORY_AND_SKILL : "/auth/admin/deleteCategory-Skill"
}