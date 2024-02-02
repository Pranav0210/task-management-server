const { StatusCodes } = require('http-status-codes');
const User = require('../models/model.user.js');
const {validateMobile} = require('../middleware/validation.js');
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
    const { password, phone_number } = req.body;
  
    try {
      // 1. Check if the user exist
      const user = await User.findOne({phone_number: phone_number});
      console.log(user)
      if (user)
        res.status(StatusCodes.BAD_REQUEST).json({error: "User already exist"});
      // throw new Error('User already exist');

      if(!validateMobile(phone_number))
        res.status(StatusCodes.BAD_REQUEST).json({error: "Invalid Mobile Number"});

      // 2. If not user exist already, hash the password
      // const hashedPassword = await hash(password, 10); // ommited from implementation for now
      const hashedPassword = password;
      // 3. Insert the user in "database"
      const newUser = await User.create({
        phone_number : phone_number,
        password: hashedPassword,
      });

      console.log(newUser);
      res.status(StatusCodes.CREATED).json({ 
        message : 'User Created',
        user_id : newUser._id 
      });
    } catch (err) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
        error: `${err.message}`,
      });
    }
  }
const login = async (req, res) => {
  const { user_id, phone_number } = req.body;

  try {
    // 1. Find user in array. If not exist send error
    const user = await User.findOne({_id:user_id});
    console.log(user)
    if (!user) 
      return res.status(StatusCodes.NOT_FOUND).send({error: "User does not exist"});
    // throw new Error('User does not exist');

    // 2. Compare crypted password and see if it checks out. Send error if not
    // const valid = await compare(password, user.password);
    // if (!valid) throw new Error('Password not correct');

    if(phone_number !== user.phone_number)
      res.status(StatusCodes.UNAUTHORIZED).send({error:`Incorrect mobile : Access denied`})
    else{
      const token = await jwt.sign({user_id: `${user_id}`}, process.env.JWT_SECRET, {expiresIn: '6h'})
      res.status(StatusCodes.OK).json({
        message: "Authorized",
        token : token,
        instruction: "Store user_id safely and produce on login request"
      })
    }
  } catch (err) {
    res.send({
      error: `${err.message}`,
    });
  }
}

const logout = ()=>{    

}
module.exports = {
    register,
    login,
    logout
}