import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import mongoose from 'mongoose';

export async function GET(request, { params }) {
  try {
    await dbConnect();

    const { businessId } = await params; // await params in Next.js 15+

    // Try bookingLink first, then ObjectId
    let business = await Business.findOne({ bookingLink: businessId });

    if (!business && mongoose.Types.ObjectId.isValid(businessId)) {
      business = await Business.findById(businessId);
    }

    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }

    return Response.json({
      success: true,
      business: {
        _id: business._id,
        name: business.name,
        description: business.description,
        location: business.location,
        phone: business.phone,
        services: business.services,
        availability: business.availability,
      }
    });

  } catch (error) {
    console.error('Business API error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}