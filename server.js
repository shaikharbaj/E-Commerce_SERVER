if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
const app = require("./app.js");

// const cloudinary = require('cloudinary').v2;
const connect = require("./Database/connection.js");

//uncaught exception..
process.on("uncaughtException", (err) => {
  console.log("Error : " + err);
  console.log("Shutting down the server due to uuncaughtException");
});

//database connection.....
connect();
const server = app.listen(process.env.PORT, () => {
  console.log("server is running on PORT " + process.env.PORT);
});

//unhandled promise rejection...
process.on("unhandledRejection", (err) => {
  console.log("Error : " + err);
  console.log("Shutting down the server due to unhandled promise rejection");
  server.close(() => {
    process.exit(1);
  });
});

// module.exports = cloudinary;
