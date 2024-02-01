const { verify } = require('jsonwebtoken');
import { StatusCodes } from 'http-status-codes';
import User from '../models/model.user.js';

const isAuth = async (req,res,next) => {
  const authorization = req.headers['authorization'];
  if (!authorization) 
     res.status(StatusCodes.UNAUTHORIZED).json({error: "You need to login first"});
  // Based on 'Bearer ksfljrewori384328289398432'
  const token = authorization.split(' ')[1];
  const { userId } = verify(token, process.env.ACCESS_TOKEN_SECRET);
  
  if(await User.exists({_id: userId}))
    next();
  else{
    res.status(StatusCodes.FORBIDDEN).json({error: "Invalid userId"});
  }
};

module.exports = {
  isAuth,
};
