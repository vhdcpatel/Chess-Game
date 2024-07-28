require('dotenv').config();

const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { Op } = require('sequelize');

const Users = require("../models/users");
const getResponse = require('../utils/getResponse');
const pick = require('../utils/pick');
const { signToken } = require('../utils/jwtUtils');

const userInfo = ['firstName','lastName','userName','email']

exports.signUpUser = async (req, res) => {
  try{
    const {
      firstName,lastName ,userName ,email,password
    } = req.body;

    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [
          { userName: userName },
          { email: email }
        ]
      }
    });

    console.log(existingUser);

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password,12);

    const user = await Users.create({
      firstName,
      lastName ,
      userName ,
      email,password:hashedPassword
    });
    const userResponse = pick(user.dataValues,userInfo);
    signToken
    const token = signToken(userResponse);
    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None'
    });

    // Sending back the final response.
    res.status(201).json(getResponse(null,userResponse,token));

  }catch(err){
    console.error('Error details:', err); 
    res.status(500).json({ message: 'Something went wrong', err });
  }
}

exports.login = async (req,res)=>{
  try {
    const {email, password } = req.body;

    const user = await Users.findOne({where: { email }});
    console.log(user);

    if(!user){
      return res.status(404).json({message:"User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
      return res.status(401).json({message: 'Invalid password'});
    }

    const token = JWT.sign(
      { userId: user.id, email: user.email },
      process.env.ACCESS_TOKEN_JWT,
      { expiresIn: '2d' }
    );

    res.cookie('accessToken', token, {
      httpOnly: true,
      maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'None'
    });

    const response = {
      token: token,
      user: user,
      error: null
    }
    res.status(200).json(response);
  }catch(err){
    res.status(500).json({message: err});
  }
}