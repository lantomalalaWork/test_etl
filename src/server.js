import express from 'express';
import productRoutes from './routes/productRoutes.js';
import categorieRoutes from './routes/categorieRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

app.use('/products', productRoutes);
app.use('/categorie', categorieRoutes);


app.listen(3000, () => console.log('Server running on port 3000'));
