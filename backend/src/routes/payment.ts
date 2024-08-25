import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { allCoupons, applyDis, createCoupon, deleteCoupons } from '../controllers/payment.js';

const app = express.Router();

// E11000 duplicate key error collection: E-Comm.coupons index: coupon_1 dup key: { coupon: null }" fix this error
app.post("/coupon/new" ,adminOnly , createCoupon);

app.get("/discount", applyDis);

app.get("/coupon/all" , adminOnly, allCoupons);
app.delete("/coupon/:id", adminOnly , deleteCoupons);





export default app;