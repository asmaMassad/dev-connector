const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const uri = require('./config/keys').mongoURI;

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//connect to mongodb
 mongoose
     .connect(uri , { useNewUrlParser: true })
     .then(() => console.log('db connected'))
     .catch(err => console.log(err ));
    
//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);

//use routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server running on port ${port}`))


