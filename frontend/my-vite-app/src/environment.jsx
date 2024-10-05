let IS_PROD = true;
const server = IS_PROD
  ? "http://localhost:5500/api/v1/users"
  : "http://localhost:5500";

export default server;
