const express = require("express");
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path')
const router = require('./routes/route.js');
const ErrorHandler = require("./Middleware/error.js");


app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}));
app.use("/",express.static("uploads"));
app.use(cookieParser());



app.get("/", (req, res) => {
  res.send("server is running");
});
app.get('/hello/:id',async(req,res)=>{
     res.send('its working')
})

// app.use("/api/v2",router);

app.use(ErrorHandler);

module.exports = app;

