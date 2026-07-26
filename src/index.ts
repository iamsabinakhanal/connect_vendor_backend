import { app } from "./app";
import { env } from "./config/env";
import { connectMongo } from "./database/mongodb";

const start = async (): Promise<void> => {
  await connectMongo();

  app.listen(env.port, () => {
    console.log(`Pasaley Guff backend running on port ${env.port}`);
  });
};

void start().catch((error: unknown) => {
  console.error("Failed to start Pasaley Guff backend", error);
  process.exit(1);
});
