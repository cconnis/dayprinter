// src/config.js
import dotenv from 'dotenv';
dotenv.config()

console.log('NYT API Key:', process.env.NYT_API_KEY); // Log to verify it's being loaded

export const NYT_API_KEY = process.env.NYT_API_KEY
