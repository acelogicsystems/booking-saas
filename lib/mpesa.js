function getBaseUrl() {
    return process.env.MPESA_ENV === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }
  
  async function getAccessToken() {
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');
    const response = await fetch(
      `${getBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    if (!response.ok) throw new Error('Failed to get M-Pesa access token');
    const data = await response.json();
    return data.access_token;
  }
  
  function getTimestamp() {
    const date = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    return date.getFullYear().toString() + pad(date.getMonth() + 1) + pad(date.getDate()) +
      pad(date.getHours()) + pad(date.getMinutes()) + pad(date.getSeconds());
  }
  
  function normalizePhone(phone) {
    let normalized = phone.replace(/\D/g, '');
    if (normalized.startsWith('0')) normalized = '254' + normalized.slice(1);
    return normalized;
  }
  
  export async function initiateSTKPush({ phone, amount, accountReference, transactionDesc }) {
    const accessToken = await getAccessToken();
    const timestamp = getTimestamp();
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');
  
    const response = await fetch(`${getBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: normalizePhone(phone),
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: normalizePhone(phone),
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      }),
    });
  
    const data = await response.json();
    if (!response.ok || data.errorCode) throw new Error(data.errorMessage || 'STK Push request failed');
    return data; // { CheckoutRequestID, MerchantRequestID, ... }
  }