const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session)

const MONGODB_URI = 'mongodb://localhost:27017/shop';

const app = express();
const store = new MongoDbStore({
    uri : MONGODB_URI,
    collection : 'sessions'
})


const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const authRoutes = require('./Routes/auth');
const errorController = require('./Controllers/Error');

const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))
app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false , store : store })
)

app.use((req, res, next) => {

    User.findById('66ab5973d18f927682655ff5')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
    // next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.notFound);

mongoose.connect(MONGODB_URI)
    .then(result => {
        User.findOne().then(user => {

            if (!user) {

                const user = new User({
                    name: 'Ronald',
                    email: 'ron@test.com',
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })
        app.listen(3000)
    })
    .catch(err => console.log(err))