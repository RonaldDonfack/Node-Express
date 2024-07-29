const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');


const app = express();


const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const errorController = require('./Controllers/Error');
const mongoConnet = require('./utils/database').mongoConnet;    

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {

    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.log(err))
    next()
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFound);

mongoConnet(client => {
    app.listen(3000);
})