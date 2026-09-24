import dbConnect from '@/lib/mongodb';
import Payment from '@/models/Payment';

export async function GET(request, { params }) {
  try {
    await dbConnect();
    const { checkoutRequestId } = params;
    const payment = await Payment.findOne({ checkoutRequestId });
    if (!payment) return Response.json({ error: 'Payment not found' }, { status: 404 });

    return Response.json({ status: payment.status, mpesaReceiptNumber: payment.mpesaReceiptNumber });
  } catch (error) {
    return Response.json({ error: 'Internal server error: ' + error.message }, { status: 500 });
  }
}