import express from 'express';
import Transaction from '../models/Transaction.js';
import Stock from '../models/Stock.js';

const router = express.Router();

// POST /api/transactions
router.post('/', async (req, res) => {
  try {
    const { stockId, type, quantity, remarks } = req.body;

    const stockItem = await Stock.findByPk(stockId);
    if (!stockItem) return res.status(404).json({ message: 'Stock item not found' });

    if (quantity > stockItem.quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }

    // create transaction
    const transaction = await Transaction.create({ stockId, type, quantity, remarks });

    // update stock quantity
    stockItem.quantity -= quantity;
    await stockItem.save();

    res.status(201).json(transaction);
  } catch (error) {
    console.error('Transaction Error:', error);
    res.status(500).json({ message: 'Failed to create transaction' });
  }
});

// GET /api/transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [{ model: Stock, attributes: ['name', 'category', 'location'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(transactions);
  } catch (error) {
    console.error('Fetch Transaction Error:', error);
    res.status(500).json({ message: 'Failed to fetch transactions' });
  }
});

export default router;
