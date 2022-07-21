import dotenv from 'dotenv';

// Set the NODE_ENV to 'development' by default
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = dotenv.config();

if (process.env.NODE_ENV !== 'production') {
	if (envFound.error) {
		throw new Error("⚠️  Couldn't find .env file  ⚠️");
	}
}

export const config = {
	port: parseInt(process.env.PORT, 10),
	databaseURL: process.env.MONGODB_URI,
	databasePassword: process.env.DB_PASSWORD,
	api: {
		prefix: '/api/v1'
	}
};
