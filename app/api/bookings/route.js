import dbConnect from '@/lib/mongodb';
import Booking from '@/models/Booking';
import jwt from 'jsonwebtoken';

export async function GET(request) {
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
    
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit')) || 50;
    
    // Build query
    const query = { businessId: decoded.businessId };
    if (status) query.status = status;
    
    // Fetch bookings
    const bookings = await Booking.find(query)
      .sort({ date: 1 })
      .limit(limit);
    
    // Get counts
    const totalBookings = await Booking.countDocuments({ businessId: decoded.businessId });
    const upcomingBookings = await Booking.countDocuments({
      businessId: decoded.businessId,
      date: { $gte: new Date() },
      status: 'confirmed'
    });
    const completedBookings = await Booking.countDocuments({
      businessId: decoded.businessId,
      status: 'completed'
    });
    
    // Calculate revenue
    const revenue = await Booking.aggregate([
      { $match: { businessId: decoded.businessId, status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$servicePrice' } } }
    ]);
    
    return Response.json({
      success: true,
      bookings,
      stats: {
        total: totalBookings,
        upcoming: upcomingBookings,
        completed: completedBookings,
        revenue: revenue[0]?.total || 0
      }
    }, { status: 200 });
    
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
