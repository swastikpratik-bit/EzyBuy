import express from 'express';
import { adminOnly } from '../middlewares/auth.js';
import { getBarChart, getDashboardStats, getLineChart, getPieCharts } from '../controllers/statistics.js';

const app = express.Router();


app.get("/stats" , getDashboardStats );
app.get("/pie" , getPieCharts);
app.get("/bar" , getBarChart);
app.get("/line" , getLineChart);


export default app;