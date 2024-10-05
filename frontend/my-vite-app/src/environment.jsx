let IS_PROD = true;
const server = IS_PROD
  ? "https://apnavideobackend.onrender.com"
  : "http://localhost:5500";

export default server;
