const { verify } = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/model.user.js');

const isAuth = async (req,res,next) => {
  try{
    const authorization = req.headers['authorization'];
    if (!authorization) 
      res.status(StatusCodes.UNAUTHORIZED).send({error: "You need to login first"});
    // Based on 'Bearer ksfljrewori384328289398432'
    // console.log(authorization)
    const token = authorization.split(' ')[1];
    const { user_id } = verify(token, process.env.JWT_SECRET);
    
    const user = await User.findOne({_id:user_id});
    if(user){
      console.log("Authorized: passing to controller...");
      next();
    }
    else{
      res.status(StatusCodes.FORBIDDEN).json({error: "Invalid userId"});
    }
  }
  catch(error){
    console.log("error in auth",error)
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error: "PLease try again later"});
  }
};

module.exports = {
  isAuth,
};
