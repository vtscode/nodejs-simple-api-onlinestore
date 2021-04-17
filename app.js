const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const api = process.env.API_URL_V1;

app.use(cors());
app.options('*', cors())

//Database and start server
mongoose.connect(process.env.CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'eshop-database'
})
.then(()=>{
  console.log('Database Connection is ready...')
  app.listen(3000, ()=>{
    console.log('server is running http://localhost:3000');
  })
})
.catch((err)=> {
  console.log(err);
});

//middleware
app.use(express.json());
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);

app.use((req,res) => {
  res.status(404).render('404',{
    title : '404'
  });
});