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
const educadorRoute   = require('./routes/educador');
const atividadeRoute  = require('./routes/atividade');

mongoose.connect(
  process.env.DB_CONNECT, 
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
});

//Make routes available
app.use('/educador',          educadorRoute);
app.use('/educador/atividade', atividadeRoute);

const port = process.env.PORT;

app.listen(port, function (err) {
  console.log("server.js >>>")
  console.log('api educador listening on port '+port);
  if (err) {
    console.log("err >>>")
    console.log(err)
  }
});
