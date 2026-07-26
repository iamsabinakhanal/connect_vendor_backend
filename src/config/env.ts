import "dotenv/config";

const port = Number(process.env.PORT || 4000);

export const env = {
  port,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/pasaley_guff",
  mongoDbName: process.env.MONGODB_DB_NAME || "pasaley_guff",
  publicBaseUrl: process.env.PUBLIC_BASE_URL || `http://localhost:${port}`

};
