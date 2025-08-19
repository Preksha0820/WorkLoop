import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

//Makes sure only logged-in users can access that route.
export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // { id, role }
      req.user = decoded; // Now req.user has id and role
      next();
    } catch (err) {
      console.error('JWT verification failed:', err);
      return res.status(401).json({ message: 'Invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'No token provided' });
  }
};

//Makes sure only users with the right role can access that route.
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Insufficient role' });
    }
    next();
  };
};

