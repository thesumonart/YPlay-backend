import dns from 'dns';
import mongoose from 'mongoose';
import { DB_NAME } from '../constants.js';

// Force Node.js to use Google DNS which supports SRV record lookups
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
    console.log(`Database connected! \n DB_Host: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error('Database connection failed!', error);
    process.exit(1);
  }
};

export default connectDB;
