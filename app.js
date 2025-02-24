const express = require('express');
const { connectDB, getDB } = require('./db');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerSetup = require('./swagger');
const rateLimit = require('express-rate-limit');


const app = express();
app.use(express.json())
app.use(helmet());
app.use(morgan('dev'));
const cors = require('cors');

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', 'http://localhost:3000', 'http://localhost:5173');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
//   res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   res.header('Access-Control-Allow-Credentials', 'true');
  
//   if (req.method === 'OPTIONS') {
//     return res.status(200).json({});
//   }
  
//   next();
// });
app.use(cors({
  origin: ['http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  headers: ["Content-Type"],
  credentials: true
}));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100 
}));

connectDB().then(() => {
  app.listen(process.env.PORT || 3000, () => {
    console.log(`Server running on port ${process.env.PORT || 3000}`);
  });
});

/**
 * @swagger
 * /api/nfts:
 *   post:
 *     summary: Create a new NFT
 *     tags: [NFTs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nftName:
 *                 type: string
 *               nftDescription:
 *                 type: string
 *               nftLogoUrl:
 *                 type: string
 *               nftId:
 *                 type: number
 *               userWalletAddress:
 *                 type: string
 *     responses:
 *       201:
 *         description: NFT created successfully
 *       400:
 *         description: All fields are required or NFT ID already exists
 *       500:
 *         description: Internal server error
 */
app.post('/api/nfts', async (req, res) => {
  const { nftName, nftDescription, nftLogoUrl, nftId, userWalletAddress } = req.body;

  if (!nftName || !nftDescription || !nftLogoUrl || !nftId || !userWalletAddress) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const db = getDB();
    const result = await db.collection('nfts').insertOne({
      nftName,
      nftDescription,
      nftLogoUrl,
      nftId,
      userWalletAddress
    });
    res.status(201).json({ ...req.body, _id: result.insertedId });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: "NFT ID already exists" });
    }
    res.status(500).json({ error: error.message });
  }
});
/**
 * @swagger
 * /api/nfts/{id}:
 *   get:
 *     summary: Get an NFT by ID
 *     tags: [NFTs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: The NFT ID
 *     responses:
 *       200:
 *         description: NFT found
 *       404:
 *         description: NFT not found
 *       500:
 *         description: Internal server error
 */
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
/**
 * @swagger
 * /api/nfts/user/{wallet}:
 *   get:
 *     summary: Get NFTs by user wallet
 *     tags: [NFTs]
 *     parameters:
 *       - in: path
 *         name: wallet
 *         schema:
 *           type: string
 *         required: true
 *         description: The user's wallet address
 *     responses:
 *       200:
 *         description: NFTs found
 *       500:
 *         description: Internal server error
 */
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
