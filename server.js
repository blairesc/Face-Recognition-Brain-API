const express = require('express');
const bcrypt = require('bcrypt-nodejs');  //hash password; security
const cors = require('cors');
const knex = require('knex');

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
app.get('/', (req, res)=> {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
  db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
    .then(data => {
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if(isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json("Unable to get user"))
        } else {
            res.status(400).json('Wrong credentials');
        }
        
    })
    .catch(err => res.status(400).json("Wrong credentials"))
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body; //gets the input info from body
    const hash = bcrypt.hashSync(password);

        //transaction used when action is to be done on two or more table
        db.transaction(trx => {
            trx.insert({
                hash: hash,
                email: email,
            })
            .into('login')
            .returning('email')
            .then(loginEmail => {
                return trx('users')
                    .returning('*')
                    .insert({
                        email: loginEmail[0],
                        name: name,
                        joined: new Date()
                    })
                    .then(user => {
                        res.json(user[0]);
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => res.status(400).json('Unable to register'));
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params; //get id from url parameter
    db.select('*').from('users').where({id})
    .then(user => {
        if( user.length) {
            res.json(user[0]);
        } else {
            res.status(400).json('Not found');
        }
    })
    .catch(err => res.status(400).json('Error getting user'));
})

app.put('/image', (req, res) => {
    const { id } = req.body; 
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('Unable to get entries'));
})

app.listen(3000, ()=> {
    console.log('app is running on port 3000');
})


/* END POINTS
    --> / :: res = this is working
    --> /signIn :: POST = success/fail  //adding data
    --> /register :: POST = user object //adding data
    --> /profile/:userId :: GET = user object //getting data
    --> /image :: PUT = user  //updating score
*/ 