import dbConnect from '@/lib/mongodb';
import Business from '@/models/Business';
import jwt from 'jsonwebtoken';

export async function PUT(request) {
  try {
    await dbConnect();
    
    // Get token from header
    const token = request.headers.get('authorization')?.split(' ')[1];
    if (!token) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.businessId) {
      return Response.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    const { name, description, phone, location, services, availability } = await request.json();
    
    // Update business
    const business = await Business.findByIdAndUpdate(
      decoded.businessId,
      {
        name,
        description,
        phone,
        location,
        services,
        availability,
      },
      { new: true, runValidators: true }
    );
    
    if (!business) {
      return Response.json({ error: 'Business not found' }, { status: 404 });
    }
    
    return Response.json({
      success: true,
      business: {
        id: business._id,
        name: business.name,
        description: business.description,
        phone: business.phone,
        location: business.location,
        services: business.services,
        availability: business.availability,
        bookingLink: business.bookingLink,
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Update business error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
