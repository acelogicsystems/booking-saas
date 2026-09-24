import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Business from '@/models/Business';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { email, password, businessName } = await request.json();
    
    console.log('Signup attempt:', { email, businessName }); // Debug log
    
    // Validation
    if (!email || !password || !businessName) {
      return Response.json(
        { error: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
    });
    
    // Generate unique booking link
    const bookingLink = `${businessName.toLowerCase().replace(/\s+/g, '-')}-${user._id.toString().slice(-6)}`;
    
    // Create business profile
    const business = await Business.create({
      userId: user._id,
      name: businessName,
      bookingLink: bookingLink,
      services: [
        {
          name: 'Consultation',
          price: 0,
          duration: 30,
        }
      ],
    });
    
    // Update user with businessId
    user.businessId = business._id;
    await user.save();
    
    console.log('User created successfully:', { email, businessId: business._id }); // Debug log
    
    return Response.json(
      { 
        success: true, 
        message: 'Account created successfully',
        business: {
          id: business._id,
          name: business.name,
          bookingLink: business.bookingLink,
        }
      },
      { status: 201 }
    );
    
  } catch (error) {
    console.error('Signup error details:', error); // Detailed error log
    return Response.json(
      { error: 'Internal server error: ' + error.message },
      { status: 500 }
    );
  }
}
// 14-day free trial starting now
const trialEndsAt = new Date();
trialEndsAt.setDate(trialEndsAt.getDate() + 14);

const business = await Business.create({
  userId: user._id,
  name: businessName,
  bookingLink: bookingLink,
  subscriptionStatus: 'trial',
  trialEndsAt: trialEndsAt,
  services: [{ name: 'Consultation', price: 0, duration: 30 }],
});