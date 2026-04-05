import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, password } = await request.json();
    
    // Validation
    if (!email || !password) {
      return Response.json(
        { error: 'Please provide email and password' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return Response.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    // Get business details
    const business = await Business.findById(user.businessId);
    
    // Create JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, businessId: user.businessId },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    return Response.json(
      {
        success: true,
        token,
        user: {
          id: user._id,
          email: user.email,
          business: business ? {
            id: business._id,
            name: business.name,
            bookingLink: business.bookingLink,
          } : null,
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Login error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
