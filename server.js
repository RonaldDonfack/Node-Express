const path = require('path')

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');


const app = express();


const adminRoutes = require('./Routes/admin');
const shopRoutes = require('./Routes/shop');
const errorController = require('./Controllers/Error');
const sequelize = require('./utils/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {

    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.notFound);

Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });


sequelize.sync({ })
    .then(result => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user)
            return User.create({ name: 'Max', email: 'max@test.fr' });
        return Promise.resolve(user);
    })
    .then(user => {
      return  user.createCart()
    })
    .then(result => {
        
        app.listen(3000);
    })
    .catch(err => {
        console.log(err)
    })

