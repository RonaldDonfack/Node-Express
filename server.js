const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');


const app = express();


const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const errorController = require('./Controllers/Error');
const db = require('./utils/database')

app.set('view engine', 'ejs');
app.set('views', 'views');

// getting start with Express-handlebars templating Engine
// app.engine('handlebars ' , expressHbs())
// app.set('view engine' , 'handlebars');
// app.set('views' , 'views');

// getting start with the  pug templating Engine
// app.set('view engine' , 'pug');
// app.set('views' , 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFound);

app.listen(3000);

