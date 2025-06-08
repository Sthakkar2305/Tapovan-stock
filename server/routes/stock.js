import express from 'express'
import Stock from '../models/Stock.js'

const router = express.Router()

// GET /api/stock - Get all stock items
router.get('/', async (req, res) => {
  try {
    const items = await Stock.findAll({
      order: [['dateOfEntry', 'DESC']]
    })
    res.json(items)
  } catch (error) {
    console.error('Error fetching stock items:', error)
    res.status(500).json({ message: 'Failed to fetch stock items' })
  }
})

// GET /api/stock/:id - Get single stock item
router.get('/:id', async (req, res) => {
  const { id } = req.params
  try {
    const item = await Stock.findByPk(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Stock item not found' })
    }
    res.json(item)
  } catch (error) {
    console.error('Error fetching stock item:', error)
    res.status(500).json({ message: 'Failed to fetch stock item' })
  }
})

// POST /api/stock - Create new stock item
router.post('/', async (req, res) => {
  try {
    const { name, category, quantity, location, condition } = req.body

    if (!name || !category || quantity === undefined || !location || !condition) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' })
    }

    const newItem = await Stock.create({
      name: name.trim(),
      category,
      quantity: parseInt(quantity),
      location: location.trim(),
      condition
    })

    res.status(201).json(newItem)
  } catch (error) {
    console.error('Error creating stock item:', error)
    res.status(500).json({ message: 'Failed to create stock item' })
  }
})

// PUT /api/stock/:id - Update stock item
router.put('/:id', async (req, res) => {
  try {
    const { name, category, quantity, location, condition } = req.body

    if (!name || !category || quantity === undefined || !location || !condition) {
      return res.status(400).json({ message: 'All fields are required' })
    }

    if (quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be negative' })
    }

    const item = await Stock.findByPk(req.params.id)
    if (!item) {
      return res.status(404).json({ message: 'Stock item not found' })
    }

    item.name = name.trim()
    item.category = category
    item.quantity = parseInt(quantity)
    item.location = location.trim()
    item.condition = condition

    await item.save()

    res.json(item)
  } catch (error) {
    console.error('Error updating stock item:', error)
    res.status(500).json({ message: 'Failed to update stock item' })
  }
})

// DELETE /api/stock/:id - Delete stock item
router.delete('/:id', async (req, res) => {
  try {
    const item = await Stock.findByPk(req.params.id)

    if (!item) {
      return res.status(404).json({ message: 'Stock item not found' })
    }

    await item.destroy()
    res.json({ message: 'Stock item deleted successfully' })
  } catch (error) {
    console.error('Error deleting stock item:', error)
    res.status(500).json({ message: 'Failed to delete stock item' })
  }
})

export default router
