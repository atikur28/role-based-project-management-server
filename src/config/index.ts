import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
  mongodb_uri: process.env.MONGODB_URI,
  port: process.env.PORT,
  client_api: process.env.CLIENT_API_URL,
  jwt: process.env.JWT_SECRET,
};

export default config;
