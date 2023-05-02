const { Product } = require("../models/product");
const { Category} = require("../models/category");
const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');

router.get(`/`, async (req, res) => {
  const productList = await Product.find()//.select('name description -_id'); -> list the fields in the select

  if (!productList) {
    res.status(500).json({ success: false });
  }
  res.send(productList);
});

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category'); // populate('category') -> List of the category of the product

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});


router.post(`/`, async (req, res) => {
    const category = await Category.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid category');
    let product = new Product({
    name: req.body.name,
    description: req.body.description,
    richDescription: req.body.richDescription,
    image: req.body.image,
    brand: req.body.brand,
    price: req.body.price,
    category: req.body.category,
    countInStock: req.body.countInStock,
    rating: req.body.rating,
    numReviews: req.body.numReviews,
    isFeatured: req.body.isFeatured,
  });
  product = await product.save();
  if(!product)
  return res.status(500).send('Product cannot be created')
  res.send(product);
});

router.put('/:id', async (req,res) => {
  if(!mongoose.isValidObjectId(req.params.id)){
    res.status(400).send('Invalid Product Id');
  }

  const category = await Category.findById(req.body.category);
  if(!category) return res.status(400).send('Invalid category');
  
  const product = await Product.findByIdAndUpdate(
  req.params.id, 
    {
      name: req.body.name,
      description: req.body.description,
      richDescription: req.body.richDescription,
      image: req.body.image,
      brand: req.body.brand,
      price: req.body.price,
      category: req.body.category,
      countInStock: req.body.countInStock,
      rating: req.body.rating,
      numReviews: req.body.numReviews,
      isFeatured: req.body.isFeatured,
    },{new:true});
    if (!product) {
      return res.status(500).send("the product cannot be update!!!!");
    } else {
      res.send(product);
    }
})

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted!!!" });
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: "Product not Found!!!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        sucess: false,
        error: err,
      });
    });
});


module.exports = router;
