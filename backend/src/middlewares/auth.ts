import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.body.token;

  if (!token) {
    return res
      .status(403)
      .send({ message: 'A token is required for authentication' });
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY as string);
    if (decoded) {
      return res.status(200).send({ message: 'Successfully Verified' });
    }
  } catch (err) {
    return res.status(401).send({ message: 'Invalid Token' });
  }
  return next();
};

export default verifyToken;
