const express = require('express');
const bcrypt = require('bcrypt-nodejs');  //hash password; security
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

//connect server to database
const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',   //local host
      user : 'postgres',
      password : 'Faylinshaw00',
      database : 'smartbrain'
    }
});

const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//End Points
app.get('/', (req, res) => { res.send('It is working!') })
app.post('/signin', signin.handleSignin(db, bcrypt)) //dependency injection
app.post('/register', register.handleRegister(db, bcrypt))
app.get('/profile/:id', profile.handleProfile(db))
app.put('/image', image.handleImage(db))
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res)})


app.listen(process.env.PORT || 3000, ()=> {
    console.log(`App is running on port 3000 ${process.env.PORT}`);
})


/* END POINTS
    --> / :: res = this is working
    --> /signIn :: POST = success/fail  //adding data
    --> /register :: POST = user object //adding data
    --> /profile/:userId :: GET = user object //getting data
    --> /image :: PUT = user  //updating score
*/ 