import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { getBarChart, getDashboardStats, getLineChart, getPieCharts } from '../controllers/statistics.js';

const app = express.Router();


app.get("/stats" ,adminOnly, getDashboardStats );
app.get("/pie" ,adminOnly, getPieCharts);
app.get("/bar" ,adminOnly, getBarChart);
app.get("/line" ,adminOnly, getLineChart);


export default app;