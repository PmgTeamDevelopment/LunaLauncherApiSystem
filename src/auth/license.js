import { getSession } from './session.js';

export function checkLicense() {
  const session = getSession();
  if(!session.token) throw new Error('Not logged in');

  // Giả lập license data
  return {
    licenseStatus: session.user.licenseStatus,
    expiry: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
  };
}

// Optional: payment function
export function payLicense(amount, method) {
  const session = getSession();
  if(!session.token) throw new Error('Not logged in');

  // Giả lập thanh toán thành công
  const expiry = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString();
  session.user.licenseStatus = 'active';
  return { status: 'success', licenseExpiry: expiry };
}
