import mongoose from "mongoose";
import { env } from "../config/env";
import { seedDatabase } from "./mongo_seed";

export const connectMongo = async (): Promise<void> => {
    const connection = await mongoose.connect(env.mongoUri, {
        dbName: env.mongoDbName
    });

    console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);

    await seedDatabase();
};

// Backward-compatible alias in case other files still use the older name.
export const connectDatabase = connectMongo;