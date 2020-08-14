require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
   // const encrypt = require('mongoose-encryption');
   // const md5 = require('md5');
const bcrypt =  require('bcrypt');
const saltRounds = 10;

const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});

///////LEVEL 2: ENCRYPTION WITH ENVIRONMENTAL VARIABLES IGNORED///////////////


     // userSchema.plugin(encrypt, {secret: process.env.SECRET, encryptedFields: ['password']});

/////////////////////LEVEL 2: ENCRYPTION////////////////////




const User = new mongoose.model('User', userSchema);

app.get('/', function(req,res){
  res.render('home.ejs');
});

app.get('/login', function(req,res){
  res.render('login.ejs');
});

app.get('/register', function(req,res){
  res.render('register.ejs');
  });

/////////////////////LEVEL 1: USERNAME AND PASSWORD////////////////////
app.post('/register', function(req,res){

 // const newUser = new User({
 //   email: req.body.username,
   // LEVEL 2 ENCRYPTION
   //password: req.body.password
   // LEVEL 2 ENCRYPTION

   /////LEVEL 3 SECURITY: HASHING////
    // password: md5(req.body.password)
   /////LEVEL 3 HASHING////



   /////LEVEL 4 SECURITY: BCRYPT AND SALT////
   bcrypt.hash(req.body.password, 10, function(err, hash) {
     const newUser = new User({
       email: req.body.username,
       password: hash
        });
        newUser.save(function(err){
          if(err){
            console.log(err);
          } else {
            res.render('secrets.ejs');
          }
        });
       });
    /////LEVEL 4 SECURITY: BCRYPT AND SALT////


 });

//  newUser.save(function(err){
//    if(err){
//      console.log(err);
//    } else {
//      res.render('secrets.ejs');
//    }
//  });
// });

app.post('/login', function(req,res){
  const username = req.body.username;
//LEVEL2: ENCRYPTION    const password = req.body.password;

//LEVEL 3: HASHING MD5
  // const password = md5(req.body.password);
  //LEVEL 3: HASHING MD5


  /////LEVEL 4 SECURITY: BCRYPT AND SALT////
  const password = req.body.password;

  /////LEVEL 4 SECURITY: BCRYPT AND SALT////



  User.findOne({email: username}, function(err, foundUser){
    if(err){
      console.log(err);
    } else {
      if(foundUser){
        /////LEVEL 4 SECURITY: BCRYPT AND SALT////
        bcrypt.compare(password, foundUser.password, function(err, result) {
          if (result === true) {
                res.render('secrets');
          }
        });
        /////LEVEL 4 SECURITY: BCRYPT AND SALT////


      /////LEVEL 3 SECURITY: HASHING////
        // if(foundUser.password === password){
        /////LEVEL 3 SECURITY: HASHING////

          // res.render('secrets');
        // }
      }
    }
  });
});
/////////////////////LEVEL 1: USERNAME AND PASSWORD////////////////////




app.listen(3000,function(){
  console.log('Server running on port 3000.');
});
