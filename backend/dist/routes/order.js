import express from 'express';
import { allOrders, deleteOrder, myOrders, newOrder, orderDetails, processOrder } from '../controllers/orders.js';
import { adminOnly } from '../middlewares/auth.js';
const app = express.Router();
app.post("/new", newOrder);
app.get("/my", myOrders);
app.get("/all", allOrders);
app.route("/:id").get(orderDetails).delete(adminOnly, deleteOrder).put(adminOnly, processOrder);
export default app;
