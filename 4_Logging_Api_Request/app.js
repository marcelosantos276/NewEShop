const express = require("express");
const app = express();
const morgan = require('morgan');

require('dotenv/config');

const api = process.env.API_URL;

// Middlewares
// read json file
app.use(express.json());
// especificated the code message -> POST /api/v1/products 200 48 - 7.544 ms or GET /api/v1/products 200 48 - 4.363 ms
app.use(morgan('tiny'));

// htpp://localhost:3000/api/v1/products
app.get(`${api}/products`, (req, res) => {
  const product = {
    id: 1,
    name: "hair dresser",
    image: "url_img"
  }
  res.send(product);
});

app.post(`${api}/products`, (req, res) => {
  const newProduct = req.body;
  console.log(newProduct);
  res.send(newProduct);
});

app.listen(3000, () => {
  console.log(api);
  console.log("Server is running now htpp://localhost:3000!!!");
});
