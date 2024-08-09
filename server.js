const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const uniqid = require('uniqid')
// const expressHbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDbStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');

const MONGODB_URI = 'mongodb://localhost:27017/shop';

const app = express();
const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
})
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
    destination: 'images',
    filename: (req, file, cb) => {
      cb(null, uniqid('',  `-${file.originalname}`));
    },
  });

// File filter function
const fileFilter = (req, file, cb) => {
    // Check if the file type is allowed
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true); // Accept the file
    } else {
        cb(null, false); // Reject the file
    }
};

const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const authRoutes = require('./Routes/auth');
const errorController = require('./Controllers/Error');

const User = require('./models/user')

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(
    session({ secret: 'my secret', resave: false, saveUninitialized: false, store: store })
)
app.use(csrfProtection)
app.use(flash())

app.use((req, res, next) => {
    if (!req.session.user)
        return next()
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next()
        })
        .catch(err => console.log(err))
    // next()
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();

})
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes)

app.use(errorController.notFound);

app.use('/500', (error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Server Error',
        path: '',
        isAuthenticated: req.session.isLoggedIn
    })
})

mongoose.connect(MONGODB_URI)
    .then(result => {
        app.listen(3000)
    })
    .catch(err => console.log(err))