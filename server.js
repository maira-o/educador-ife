const express   = require('express');
const dotenv    = require('dotenv');
const morgan    = require('morgan');
const cors      = require('cors');
const mongoose  = require('mongoose');

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded( { extended: true } ));
app.use(cors())
app.use(morgan('dev'));

//Importing routes
const educadorRoute = require('./routes/educador');

mongoose.connect(
  process.env.DB_CONNECT, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
      //useFindAndModify: false
});

//mongoose.set('useCreateIndex', true);   >>> https://mongoosejs.com/docs/migrating_to_6.html#no-more-deprecation-warning-options <<<

//Make routes available
app.use('/educador',  educadorRoute);

const port = process.env.PORT;

app.listen(port, function (err) {
  console.log("server.js >>>")
  console.log('api educador listening on port '+port);
  if (err) {
    console.log("err >>>")
    console.log(err)
  }
});