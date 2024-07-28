require('dotenv').config();

const JWT = require("jsonwebtoken");
const bcrypt = require("bcryptjs/dist/bcrypt");
const { Op } = require('sequelize');

const Users = require("../models/users");
const getResponse = require('../utils/getResponse');
const pick = require('../utils/pick');
const { signToken } = require('../utils/jwtUtils');
const setAccessTokenCookie = require('../utils/cookieUtils');

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

    if (existingUser) {
      const message = 'Username or email already exists';
      return res.status(400).json(getResponse(message));
    }

    const hashedPassword = await bcrypt.hash(password,12);

    const user = await Users.create({
      firstName,
      lastName ,
      userName ,
      email,password:hashedPassword
    });

    const userResponse = pick(user.dataValues,userInfo);
    const token = signToken(userResponse);

    setAccessTokenCookie(res, token);

    // Sending back the final response.
    res.status(201).json(getResponse(null,userResponse,token));

  }catch(err){
    console.error('Error details:', err);
    const message =  'Something went wrong';
    res.status(500).json(getResponse(message));
  }
}

exports.login = async (req,res)=>{
  try {
    const {email, password } = req.body;

    const user = await Users.findOne({where: { email }});

    if(!user){
      const message = "User not found";
      return res.status(404).json(getResponse(message));
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);

    if(!isPasswordValid){
      const message = 'Invalid password';
      return res.status(401).json(getResponse(message));
    }

    const userResponse = pick(user.dataValues,userInfo);
    const token = signToken(userResponse);

    setAccessTokenCookie(res, token);
    
    res.status(200).json(getResponse(null,userResponse,token));
  }catch(err){
    res.status(500).json(getResponse(err));
  }
}