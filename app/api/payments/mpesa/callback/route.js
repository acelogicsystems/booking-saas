import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import Payment from '@/models/Payment';

export async function POST(request) {
  try {
    await dbConnect();
    const body = await request.json();
    const stkCallback = body?.Body?.stkCallback;

    if (!stkCallback) return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;
    const payment = await Payment.findOne({ checkoutRequestId: CheckoutRequestID });
    if (!payment) return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });

    if (ResultCode === 0) {
      const items = CallbackMetadata?.Item || [];
      const receiptItem = items.find((i) => i.Name === 'MpesaReceiptNumber');

      payment.status = 'completed';
      payment.mpesaReceiptNumber = receiptItem?.Value || null;
      payment.resultDesc = ResultDesc;
      await payment.save();

      const business = await Business.findById(payment.businessId);
      if (business) {
        const now = new Date();
        const base = business.subscriptionExpiresAt && business.subscriptionExpiresAt > now
          ? business.subscriptionExpiresAt : now;
        const newExpiry = new Date(base);
        newExpiry.setDate(newExpiry.getDate() + 30);
        business.subscriptionStatus = 'active';
        business.subscriptionExpiresAt = newExpiry;
        await business.save();
      }
    } else {
      payment.status = 'failed';
      payment.resultDesc = ResultDesc;
      await payment.save();
    }

    return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' });
  } catch (error) {
    console.error('M-Pesa callback error:', error);
    return Response.json({ ResultCode: 0, ResultDesc: 'Accepted' }); // still ack to avoid retry storms
  }
}