const mongoose = require('mongoose');

// Get connection string from environment
const MONGODB_URI = 'mongodb+srv://booking_admin:Booking2025!@cluster0.8cxbrri.mongodb.net/booking-saas?retryWrites=true&w=majority';

async function checkBookings() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');
    
    // Check businesses collection
    const businesses = await mongoose.connection.db.collection('businesses').find({}).toArray();
    
    console.log('\n📋 Businesses in database:');
    if (businesses.length === 0) {
      console.log('No businesses found in database!');
    } else {
      businesses.forEach(b => {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Business Name: ${b.name}`);
        console.log(`Booking Link: ${b.bookingLink}`);
        console.log(`Business ID: ${b._id}`);
        console.log(`User ID: ${b.userId}`);
        console.log(`Services: ${b.services?.length || 0} services`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      });
    }
    
    // Also check users
    const users = await mongoose.connection.db.collection('users').find({}).toArray();
    console.log(`\n👥 Users in database: ${users.length}`);
    users.forEach(u => {
      console.log(`- ${u.email} (${u._id})`);
    });
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkBookings();
