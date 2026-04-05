const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://booking_admin:Booking2025!@cluster0.8cxbrri.mongodb.net/booking-saas?retryWrites=true&w=majority';

async function fixBusinessName() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    const db = mongoose.connection.db;
    const businesses = db.collection('businesses');
    
    // Find the business with the comma issue
    const business = await businesses.findOne({ name: "Kevin,s barbershop" });
    
    if (business) {
      console.log('Found business:', business.name);
      console.log('Current booking link:', business.bookingLink);
      
      // Fix the name and booking link
      const newName = "Kevin's Barbershop";
      const newBookingLink = "kevins-barbershop-909f20";
      
      const result = await businesses.updateOne(
        { _id: business._id },
        { 
          $set: { 
            name: newName,
            bookingLink: newBookingLink
          } 
        }
      );
      
      console.log('✅ Updated business:');
      console.log('New name:', newName);
      console.log('New booking link:', newBookingLink);
    } else {
      console.log('Business not found');
    }
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

fixBusinessName();
