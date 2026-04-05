import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import Business from '@/models/Business';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { businessId, customerName, customerPhone, customerEmail, service, servicePrice, date, notes } = await request.json();
    
    // Check if slot is already booked
    const existingBooking = await Booking.findOne({
      businessId,
      date: new Date(date),
      status: { $ne: 'cancelled' }
    });
    
    if (existingBooking) {
      return Response.json(
        { error: 'This time slot is already booked. Please choose another time.' },
        { status: 400 }
      );
    }
    
    // Create booking
    const booking = await Booking.create({
      businessId,
      customerName,
      customerPhone,
      customerEmail,
      service,
      servicePrice,
      date: new Date(date),
      notes,
      status: 'confirmed'
    });
    
    return Response.json({
      success: true,
      booking: {
        _id: booking._id,
        customerName: booking.customerName,
        service: booking.service,
        date: booking.date,
      }
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating booking:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
