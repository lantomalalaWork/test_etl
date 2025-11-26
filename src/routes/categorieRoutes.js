import express from 'express';
import * as productService from '../services/productService.js';
import axios from 'axios';

const router = express.Router();
const pushOne = async url => {
    try {
        const urlToScrape = url; // ou une URL fixe
        const response = await axios.get(`http://taapit-scraping-api-etyf.onrender.com/api/ebay/product?path=${encodeURIComponent(urlToScrape)}`, {
            maxBodyLength: Infinity,
            headers: {}
        });

        const productData = response.data;

        // Mapper le JSON reçu vers les champs Prisma
        const productToCreate = {
            itemId: productData.itemId,
            title: productData.title,
            oemReference: productData.oemReference,
            priceNet: parseFloat(productData.price?.net_price) || null,
            priceBrut: parseFloat(productData.price?.brut_price) || null,
            currency: productData.price?.currency || null,
            url: productData.url,
            images: productData.images || [],
            seller: productData.seller || null,
            listingStartDate: productData.listingStartDate ? new Date(productData.listingStartDate) : null,
            status: productData.status || 'ACTIVE'
        };

        const product = await productService.createProduct(productToCreate);

        // utilisation
        console.log('push done pour: ' + product.itemId);
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e.message});
    }
};

// Créer un produit
router.post('/', async (req, res) => {
    try {
        const urlToScrape = req.body.categorie || req.query.categorie; // ou une URL fixe
        const response = await axios.get(`http://taapit-scraping-api-etyf.onrender.com/api/ebay/categorie?path=${encodeURIComponent(urlToScrape)}`, {
            maxBodyLength: Infinity,
            headers: {}
        });

        const product_links = await response;

        res.json(product_links);
    } catch (e) {
        console.error(e);
        res.status(500).json({error: e.message});
    }
});

export default router;
