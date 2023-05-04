const { Order } = require("../models/order");
const express = require("express");
const { OrderItem } = require("../models/order-item");
const router = express.Router();

router.get(`/`, async (req, res) => {
  const orderList = await Order.find()
    .populate("user", "name")
    .populate({
      path: "orderItems",
      populate: { path: "product", populate: "category" },
    });

  if (!orderList) {
    res.status(500).json({ success: false });
  }
  res.send(orderList);
});

router.get("/:id", (req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (order) {
        return res.status(200).send(order);
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: "order not Found!!!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        sucess: false,
        error: err,
        message: "order don´t exist!!!",
      });
    });
});

router.post("/", async (req, res) => {
  var orderItemsIds = req.body.OrderItems;
  //console.log(orderItemsIds);
  const orderItemsIdsList = Promise.all(
    orderItemsIds.map(async (orderItem) => {
      let newOrderItem = new OrderItem({
        quantity: orderItem.quantity,
        product: orderItem.product,
      });
      //console.log(newOrderItem)
      newOrderItem = await newOrderItem.save();
      return newOrderItem._id;
    })
  );
  const orderItemsIdsResolved = await orderItemsIdsList;
  //console.log(orderItemsIdsResolved);

  let order = new Order({
    orderItems: orderItemsIdsResolved,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    city: req.body.city,
    zip: req.body.zip,
    country: req.body.country,
    phone: req.body.phone,
    status: req.body.status,
    totalPrice: req.body.totalPrice,
    user: req.body.user,
  });
  order = await order.save();
  if (!order) return res.status(404).send("the order cannot be created");

  res.send(order);
});

router.put("/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    {
      status: req.body.status,
    },
    { new: true }
  );
  if (!order) {
    return res.status(404).send("the order cannot be created");
  } else {
    res.send(order);
  }
});

router.delete("/:id", (req, res) => {
  Order.findByIdAndRemove(req.params.id)
    .then(async (order) => {
      if (order) {
        await order.orderItems.map(async orderItem =>{
          await OrderItem.findByIdAndRemove(orderItem)
        })
        return res
          .status(200)
          .json({ success: true, message: "the order is deleted!!!" });
      } else {
        return res
          .status(404)
          .json({ sucess: false, message: "order not Found!!!!" });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        sucess: false,
        error: err,
        message: "order don´t exist!!!",
      });
    });
});

module.exports = router;
