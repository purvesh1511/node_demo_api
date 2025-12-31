const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth.routes');
const categoryRoutes = require('./routes/categories.routes');
const productRoutes = require('./routes/products.routes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);

module.exports = app;
