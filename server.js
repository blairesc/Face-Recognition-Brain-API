const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');


const app = express();
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

//an array of objects
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124',
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}
app.get('/', (req, res)=> {
    res.send(database.users);
})


app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
    } else {
        res.status(400).json('error');
    }
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body; //gets the input info from body
    database.users.push({
        id: '125',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params; //get id from url parameter
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if(!found) {
        res.status(404).json('no such user');
    } 
})

app.put('/image', (req, res) => {
    const { id } = req.body; 
    let found = false;
    database.users.forEach(user => {
        if(user.id === id) {
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(!found) {
        res.status(404).json('no such user');
    } 
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