const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User.js');
const flight = require('./models/flight.js');
const { check, validationResult } = require('express-validator')
const cookieParser = require('cookie-parser');


require('dotenv').config();
const app = express();

const bcryptSalt = bcrypt.genSaltSync(10);
const jwtSecret = 'fasefraw4r5r3wq45wdfgw34twdfg';

const bodyParser = require('body-parser')

app.use(express.json());
app.use(cookieParser());

app.use(cors({
  credentials: true,
  origin: 'http://localhost:5173',
}));







app.post('/api/register', [
  
check('name','This username must me 3+ characters long').isLength({ min: 3 }).withMessage("Name too short.").not().isEmpty(),
  check('email', 'Email is not valid').isEmail().not().isEmpty(),
  check('password').isLength({ min: 5 }).not().isEmpty()
 ], async (req,res) => {
  let errors = validationResult(req);

  mongoose.connect(process.env.MONGO_URL);
  const {name,email,password} = req.body;

  try {
    if (!errors.isEmpty()) {
      console.log(errors.mapped());
      return res.status(422).jsonp(errors.array());
    }
    const userDoc = await User.create({
      name,
      email,
      password:bcrypt.hashSync(password, bcryptSalt),
    });
    res.json(userDoc);
  } catch (e) {

    res.json({success: false});
    
  }

});
app.delete("/api/user-flights/:id", async(req, res)=> {
  try {
    const id = req.params.id;
    console.log(id);
    const user = await flight.findById(id);
    if (!user) {
      return res.status(404).send({ message: "Flight not found" });
    }

    // Delete the user
    await flight.deleteOne({ _id: id });

    res.status(200).send({ message: "Flight deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
})
app.post('/api/login', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {email,password} = req.body;
  const userDoc = await User.findOne({email});
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, jwtSecret, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/api/profile', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});

app.post('/api/logout', (req,res) => {
  res.cookie('token', '').json(true);
});


app.post('/api/flights', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    title,address,addedPhotos,description,price,
    perks,extraInfo,checkIn,checkOut,maxGuests,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const flightDoc = await flight.create({
      owner:userData.id,price,
      title,address,photos:addedPhotos,description,
      perks,extraInfo,checkIn,checkOut,maxGuests,
    });
    res.json(flightDoc);
  });
});

app.get('/api/user-flights', (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    const {id} = userData;
    res.json( await flight.find({owner:id}) );
  });
});

app.get('/api/flights/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  res.json(await flight.findById(id));
});
app.delete('/api/flights/:id', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {id} = req.params;
  
  res.json(await flight.deleteOne({ _id: id }));
});
app.put('/api/flights', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {token} = req.cookies;
  const {
    id, title,address,addedPhotos,description,
    perks,extraInfo,checkIn,checkOut,maxGuests,price,
  } = req.body;
  jwt.verify(token, jwtSecret, {}, async (err, userData) => {
    if (err) throw err;
    const flightDoc = await flight.findById(id);
    if (userData.id === flightDoc.owner.toString()) {
      flightDoc.set({
        title,address,photos:addedPhotos,description,
        perks,extraInfo,checkIn,checkOut,maxGuests,price,
      });
      await flightDoc.save();
      res.json('ok');
    }
  });
});

app.get('/api/flights', async (req,res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json( await flight.find() );
});

app.listen(4000);