const express = require('express');
const mongoose = require('mongoose');
const Product = require('./models/product.model.js');
const app = express();
const cors = require('cors');
app.use(express.json())
app.use(cors());
app.get('/', (req, res) => {
    res.send('Hello run uday dsds')
});

app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


app.post('/api/products', async (req, res) => {
    try {
       const product = await Product.create(req.body);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Update product
app.put('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, req.body);

        if(!product) {
            return res.status(404).json({message: "Product Not Found"})
        }
        const updatedProduct = await Product.findById(id);
         res.status(200).json(updatedProduct);

     } catch (error) {
         res.status(500).json({message: error.message});
     }
})

// Delete product
app.delete('/api/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByIdAndDelete(id);

        if(!product) {
            return res.status(404).json({message: "Product Not Found"})
        }
         res.status(200).json({message: "Product deleted successfully"});
         
     } catch (error) {
         res.status(500).json({message: error.message});
     }
})


mongoose.connect('mongodb+srv://udaysalunke13:3Mf9vo6j78dZl9oy@apibackend.b2iaswx.mongodb.net/APIBackend?retryWrites=true&w=majority')
.then(() => {
    console.log('Connected to database!')
    app.listen(8080, () => {
        console.log('Server is running on port 8080')
    })
})
.catch(() => console.log('Connection failed!'))