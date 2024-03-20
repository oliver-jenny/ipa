process.env = Object.assign(process.env, {
  // Set MONGO_URI from MONGO_URL which is set automatically by jest-mongodb
  MONGO_URI: process.env.MONGO_URL,
});
