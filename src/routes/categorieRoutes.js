import express from 'express';
import * as productService from '../services/productService.js';
import axios from 'axios';

const router = express.Router();

const pushOne = async url => {
    try {
        let response = await axios.get(`http://taapit-scraping-api-etyf.onrender.com/api/ebay/product?path=${encodeURIComponent(url)}`, {
            maxBodyLength: Infinity,
            headers: {}
        });

        let productData = response.data;

        let productToCreate = {
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

        let product = await productService.createProduct(productToCreate);
        console.log('push done pour: ' + product.itemId);
    } catch (e) {
        console.error('Erreur pushOne:', e.message);
    }
};

router.post('/', async (req, res) => {
    try {
        let urlToScrape = req.body.categorie || req.query.categorie;

        if (!urlToScrape) return res.status(400).json({error: 'categorie manquante'});

        let response = await axios.get(`http://taapit-scraping-api-etyf.onrender.com/api/ebay/categorie?path=${encodeURIComponent(urlToScrape)}`, {
            maxBodyLength: Infinity,
            headers: {}
        });

        let data = response.data;

        let wait = ms => new Promise(resolve => setTimeout(resolve, ms));

        for (let product_link of data.product_links) {
            console.log(product_link);
            await pushOne(product_link.link);
            await wait(10000);
        }

        res.json(data.product_links);
    } catch (e) {
        console.error('Erreur route:', e.message);
        res.status(500).json({error: e.message});
    }
});

export default router;
