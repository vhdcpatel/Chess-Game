require('dotenv').config();

const bcrypt = require("bcryptjs/dist/bcrypt");
const Users = require("../models/users");
const JWT = require("jsonwebtoken");


exports.signUpUser = async (req, res) => {
  try{
    const {
      firstName,lastName ,userName ,email,password
    } = req.body;

    const hashedPassword = await bcrypt.hash(password,12);

    const user = await Users.create({
      firstName,
      lastName ,
      userName ,
      email,password:hashedPassword
    })

    res.status(201).json({message: 'User created successfully',user});

  }catch(err){
    res.status(500).json({ message: 'Something went wrong', error });
  }
}

exports.login = async (req,res)=>{
  try {
    const {email, password } = req.body;

    const user = await Users.findByPk({where: { email }});

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
      return res.status(401).json({message: 'Invalid password'});
    }

    // latter add expiry into this.
    const token = JWT.sign({userId: user.id, email: user.email},process.env.ACCESS_TOKEN_JWT);
    res.status(200).json({accessToken: token});
  }catch(err){
    res.status(500).json({message: err});
  }
}