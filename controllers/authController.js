const { validateSignup } = require("../validator/validator");
const db = require('../database/db');
const sendMail = require('../util/sendMail');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const httpstatus = require("../util/httpstatus");

const sendToken = require("../util/jwtToken");

const schema = Joi.object({
  firstname: Joi.string().alphanum().min(3).max(30).required(),
  lastname: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
});

function generateOTP() {
  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}
const sixDigitOTP = generateOTP();

const signup = async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  try {
    // Validate the request body

  const { error, value } = schema.validate(req.body);
    
  if (error) {

    
    json = httpstatus.invalidInputResponse({message:error.details[0].message});

    return res.end(json);
  }

   const checkuser_email = await db('users').select('*').where('email',email).first();
   if(checkuser_email){      
      json = httpstatus.invalidResponse({message:'User Email is already Exist'});
      return res.end(json);
   }
   const hashPassword = await bcrypt.hash(password, 10);
  const userdata = {
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: hashPassword,
    otp_no: sixDigitOTP,
    otp_verify:"No"
    // Add other fields as needed
  }
  db('users')
  .insert(userdata)
  .then((data) => {
    console.log('User inserted successfully');
    var json = httpstatus.successRespone({
      message: "User inserted successfully",user:userdata 
    });
    return res.send(json);
  })
  
  .catch((err) => {
    res.send(httpstatus.errorRespone({ message: err.message }));
  });
  } catch (err) {
    res.send(httpstatus.errorRespone({ message: err.message }));
  }
  try {
    await sendMail({
      email: email,
      subject: "Activate Your account",
      message: `Your Otp number is ${sixDigitOTP}`,
    });
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }

  
};


const otpverify = async (req, res) => {
  const { otp_no } = req.body;

  try {
    const user = await db('users').select('*').where('otp_no',otp_no).first();

    if(!user){
    
      json = httpstatus.invalidResponse({message:'Invalid Otp No Pls Enter Valid Otp'});
      return res.end(json);
    }

   try {
    const rowCount = await db('users')
      .where('otp_no', otp_no)
      .update({ 'otp_verify': 'Yes' });
  
      var json = httpstatus.successRespone({
        message: "Your Account has been Activated",user:user 
      });
      return res.send(json);
   } catch (err) {
    res.send(httpstatus.errorRespone({ message: err.message }));
   }

   
  
  } catch (error) {
    res.send(http.errorRespone({ message: error.message }));
  }

};


const signin = async (req, res) => {
  const { email,password } = req.body;

 try {

  const user = await db('users').select('*').where('email',email).first();

  if(!user){
  
    json = httpstatus.invalidResponse({message:'User Not Found'});
      return res.end(json);
  }

  const otp_verfiy = user.otp_verify;
  if(otp_verfiy==='No'){
    json = httpstatus.invalidResponse({message:'Your Account is Not Verified, Pls verified your Account on otp'});
    return res.end(json);
    
  }
 
  

 const match = await bcrypt.compare(password, user.password);
 if(!match){
  
  json = httpstatus.invalidResponse({message:'Invalid Email or Password'});
  return res.end(json);
 }

  sendToken(user, 201, res);
 } catch (err) {
  return res.send(httpstatus.errorRespone({ message: err.message }));
 }

};

const logout = async (req, res) => {
 try {
  var json = httpstatus.successRespone({
    message: "Your Account has been Logouted",user:null 
  });
  return res.send(json);
 } catch (error) {
  return res.send(httpstatus.errorRespone({ message: error.message }));
 }
  
};


const getusers = async(req,res)=>{

  const { id,receiver_id } = req.body;

try {
  // const allUsers = await db('users').select('id','profile_image','firstname','pinned').whereNot('id',id);
  const allUsers = await db.raw(`SELECT id,profile_image as img,CONCAT(firstname, ' ', lastname) as name,
  (SELECT TOP 1 time FROM message m WHERE m.sender_id=users.id ORDER BY message DESC) as time,
  (SELECT TOP 1 message FROM message m WHERE m.sender_id=users.id ORDER BY id DESC) as msg,
  (SELECT TOP 1 unread FROM message m WHERE m.sender_id=users.id ORDER BY message DESC) as unread,
  (SELECT TOP 1 chatmaster_id FROM chatmaster ch WHERE (ch.sender_id=${id} and ch.receiver_id=users.id) or (ch.sender_id=users.id and ch.receiver_id=${id})) AS chatmasterid
   FROM users WHERE id != ${id}`);
  if(!allUsers){
    json = httpstatus.invalidResponse({message:'Users Not Found'});
    return res.end(json);
  }

  var json = httpstatus.successRespone({
    message: "Chat List",chatlist:allUsers
  });
  return res.send(json);
} catch (error) {
  return res.send(httpstatus.errorRespone({ message: error.message }));

}
};


const Profileimage = async(req,res) => {
  try {
    if (!req.file) {
      json = httpstatus.invalidResponse({message:'No file uploaded'});
      return res.end(json);
    }

    const userId = 1; // replace with the actual user ID you want to update
    const imagePath = req.file.path; // assuming Multer provides the path

    // Update the user's image path in the database
    try {
      await db('users')
        .where({ id: 48 })
        .update({ profile_image: imagePath });
     

      var json = httpstatus.successRespone({
        message: "Image uploaded successfully."
      });
      return res.send(json);
    } catch (error) {
      console.error('Error updating image:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } catch (error) {
    console.error('Error handling image upload:', error);
    return res.send(httpstatus.errorRespone({ message: err.message }));

  }
}

const getMessages = async(req,res)=>{
try{
const {chatmasterid,sender_id}=req.body;

const results = await db('message')
.select('id',
 'type',
 'message',
 'chatmaster_id',
 'sender_id',
 'receiver_id',
 'subtype',
 'img',
 'reply',
 'time',
 'blob_url',
 'reaction',
 'star',
 'call_request',
 
      )
.select(db.raw('incoming as incoming_boolean'))
.select(db.raw('outgoing as outgoing_boolean'))
.select(db.raw('incoming1 as incoming_boolean1'))
.select(db.raw('outgoing1 as outgoing_boolean1'))
.select(db.raw('FORMAT(date_added, \'yyyy-MM-dd HH:mm:ss\') as date_added')) 
.where({ chatmaster_id:chatmasterid  });

const chatmaster = await db('chatmaster')
.select('sender_id')
.where({ chatmaster_id:chatmasterid  });
// Transfrm the results to convert string values to boolean


var messages = results.map((message) => {
  let incoming, outgoing;

  
  if (chatmaster[0]?.sender_id == sender_id) {
    incoming = message.incoming_boolean === 'true' ? 1 : 0;
    outgoing = message.outgoing_boolean === 'true' ? 1 : 0;
  }else {
    incoming = message.incoming_boolean1 === 'false' ? 0 : 1;
    outgoing = message.outgoing_boolean1 === 'false' ? 0 : 1;
  }

  return {
    id: message.id,
    sender_id: message.sender_id,
    receiver_id: message.receiver_id,
    type: message.type,
    subtype: message.subtype,
    img: message.img,
    message: message.message,
    reply: message.reply == null ? '' : message.reply,
    blob_url: message.blob_url,
    time: message.time,
    reaction: message.reaction,
    star: message.star,
    chatmaster_id: message.chatmaster_id,
    date_added: message.date_added,
    incoming,
    outgoing,
    call_request:message.call_request
  };
});

console.log(sender_id);




var json = httpstatus.successRespone({
  message: "Conversation Message",history:messages,chatmasterid:chatmasterid
});
return res.send(json);
} catch(err){
  return res.send(httpstatus.errorRespone({ message: err.message }));

}
}

module.exports = { 
  getMessages,
  signup,
  signin,
  otpverify,
  logout,
  Profileimage,
  getusers
 };
