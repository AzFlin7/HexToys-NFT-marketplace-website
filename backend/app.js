const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const route = require("./index");
const adminRoutes = require('./routes/admin-routes');
const cors = require('cors');

const whitelist = [
  'https://beta.hex.toys', 
  'https://hex.toys', 
  'https://www.hex.toys', 
  'https://marketplace.hex.toys', 
  'https://hex-toys-admin-panel.vercel.app', 
  'https://www.pinecone.io', 
  'https://replit.com', 
  'https://www.langchain.com', 
  'https://openai.com', 
  'https://hextoys-chat.vercel.app',
  'https://chat.hex.toys',
  'http://repl.co',
  'https://repl.co',
  'https://replit.com',
  'http://localhost:3000'
]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(null, true)
      // callback(new Error())
    }
  }
}


mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.DBNAME}?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
  .catch((e) => {
    console.log(e);
    process.exit(0);
  });
mongoose.set("useCreateIndex", true);
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors(corsOptions));

app.use('/admin-routes', adminRoutes);
app.use('/', route);


app.listen(5000, async function () {
  console.log("server started");  
});
