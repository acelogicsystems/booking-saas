import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Business from '@/models/Business';
import jwt from 'jsonwebtoken';

// GET - Fetch a single booking
export async function GET(request, { params }) {
  try {
    await dbConnect();
    
    const { id } =  await params;
    
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    const business = await Business.findById(booking.businessId);
    
    return Response.json({
      success: true,
      booking: {
        _id: booking._id,
        businessId: booking.businessId,
        businessName: business?.name || 'Business',
        customerName: booking.customerName,
        customerPhone: booking.customerPhone,
        customerEmail: booking.customerEmail,
        service: booking.service,
        servicePrice: booking.servicePrice,
        date: booking.date,
        status: booking.status,
        notes: booking.notes,
        createdAt: booking.createdAt,
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching booking:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PATCH - Update booking status (for business owners)
export async function PATCH(request, { params }) {
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
    
    const { id } = await params;
    const { status } = await request.json();
    
    // Find the booking
    const booking = await Booking.findById(id);
    
    if (!booking) {
      return Response.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }
    
    // Verify the booking belongs to this business
    if (booking.businessId.toString() !== decoded.businessId) {
      return Response.json(
        { error: 'Unauthorized to update this booking' },
        { status: 403 }
      );
    }
    
    // Update status
    booking.status = status;
    await booking.save();
    
    return Response.json({
      success: true,
      booking: {
        _id: booking._id,
        status: booking.status,
        updatedAt: booking.updatedAt,
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
