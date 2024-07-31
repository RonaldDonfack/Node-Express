const { ObjectId } = require('mongodb')
const getDb = require('../utils/database').getDb;


class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : null;
    this.userId = userId;
  }
  save() {
    const db = getDb()
    let dbOPs;
    if (this._id)
      dbOPs = db.collection('products').updateOne({ _id: this._id }, { $set: this });
    dbOPs = db.collection('products').insertOne(this);
    return dbOPs
      .then(result => {
        console.log('inserted');
      })
      .catch(err => console.log(err));
  }
  static fetchAll() {
    const db = getDb()
    return db.collection('products')
      .find()
      .toArray()
      .then(product => {
        return product;
      })
      .catch(err => console.log(err))
  }
  static findById(id) {
    const db = getDb()
    return db.collection('products')
      .find({ _id: new ObjectId(id) })
      .next()
      .then(product => {
        return product;
      })
      .catch(err => console.log(err))
  }

  static deleteById(prodId){
    const db = getDb()
    return db.collection('products')
    .deleteOne({ _id : new ObjectId(prodId)})
    .then ( result => {
      console.log('deleted');
    })
    .catch(err => console.log(err))
  }
}


module.exports = Product;