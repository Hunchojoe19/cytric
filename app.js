const express = require('express');
const { connectDB, getDB } = require('./db');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerSetup = require('./swagger');


const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
const cors = require('cors');

app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://yourdomain.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

app.post('/api/nfts', async (req, res) => {
  try {
    const db = getDB();
    const result = await db.collection('nfts').insertOne(req.body);
    res.status(201).json({ ...req.body, _id: result.insertedId });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "NFT ID already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nfts/:id', async (req, res) => {
  try {
    const db = getDB();
    const nft = await db.collection('nfts').findOne({ 
      nftId: Number(req.params.id) 
    });
    
    nft ? res.json(nft) : res.status(404).json({ error: "NFT not found" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/nfts/user/:wallet', async (req, res) => {
  try {
    const db = getDB();
    const nfts = await db.collection('nfts')
      .find({ owner: req.params.wallet })
      .toArray();
      
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

swaggerSetup(app);
