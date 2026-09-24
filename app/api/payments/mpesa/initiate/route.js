import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import Payment from '@/models/Payment';
import { initiateSTKPush } from '@/lib/mpesa';

const MONTHLY_FEE = 500; // KES

export async function POST(request) {
  try {
    await dbConnect();
    const { businessId, phone } = await request.json();

    if (!businessId || !phone) {
      return Response.json({ error: 'businessId and phone are required' }, { status: 400 });
    }

    const business = await Business.findById(businessId);
    if (!business) return Response.json({ error: 'Business not found' }, { status: 404 });

    const stkResponse = await initiateSTKPush({
      phone,
      amount: MONTHLY_FEE,
      accountReference: business.bookingLink,
      transactionDesc: 'BookEase Monthly Subscription',
    });

    await Payment.create({
      businessId: business._id,
      amount: MONTHLY_FEE,
      phone,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      merchantRequestId: stkResponse.MerchantRequestID,
      status: 'pending',
    });

    return Response.json({
      success: true,
      message: 'Check your phone to complete payment',
      checkoutRequestId: stkResponse.CheckoutRequestID,
    });
  } catch (error) {
    console.error('STK Push initiate error:', error);
    return Response.json({ error: 'Failed to initiate payment: ' + error.message }, { status: 500 });
  }
}