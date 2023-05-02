const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");

require("dotenv/config");

const api = process.env.API_URL;
// create the routers variable
const productsRouter = require('./routers/product');

// Middlewares

// read json file
app.use(express.json());
// especificated the code message -> POST /api/v1/products 200 48 - 7.544 ms or GET /api/v1/products 200 48 - 4.363 ms
app.use(morgan("tiny"));

// use the route - productRouter variable....
app.use(`${api}/products`, productsRouter);

const { Product } = require("./models/products");

mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "eshop-database",
  })
  .then(() => {
    console.log("Database connection is ready");
  })
  .catch(() => {
    console.log(err);
  });

app.listen(3000, () => {
  console.log(api);
  console.log("Server is running now htpp://localhost:3000!!!");
});
