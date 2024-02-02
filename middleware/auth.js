const { verify } = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const {User} =  require('../models/model.user.js');

const isAuth = async (req,res,next) => {
  const authorization = req.headers['authorization'];
  if (!authorization) 
     res.status(StatusCodes.UNAUTHORIZED).send({error: "You need to login first"});
  // Based on 'Bearer ksfljrewori384328289398432'
  const token = authorization.split(' ')[1];
  const { user_id } = verify(token, process.env.ACCESS_TOKEN_SECRET);
  
  if(await User.exists({_id: user_id}))
    next();
  else{
    res.status(StatusCodes.FORBIDDEN).json({error: "Invalid userId"});
  }
};

module.exports = {
  isAuth,
};
