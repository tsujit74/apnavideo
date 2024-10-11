import dotenv from "dotenv";

dotenv.config();
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';

const jwt_secret = process.env.JWT_SECRET;

const authenticate = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token

  if (!token) {
    return res.status(httpStatus.UNAUTHORIZED).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwt_secret, (err, decoded) => {
    if (err) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Failed to authenticate' });
    }

    req.userId = decoded.id;
    req.isAdmin = decoded.isAdmin;
    
    if (!req.isAdmin) {
      return res.status(httpStatus.FORBIDDEN).json({ message: 'Access denied' });
    }
    
    next();
  });
};

export default authenticate;
