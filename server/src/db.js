import 'dotenv/config';
import mongoose from 'mongoose';

mongoose.connect(`mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_DOMAIN}`, { useNewUrlParser: true });
mongoose.Promise = global.Promise;

const db = mongoose.connection;

export default db;