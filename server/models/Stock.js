import { DataTypes } from 'sequelize'
import sequelize from '../config/db.js'

const Stock = sequelize.define('Stock', {
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  category: {
    type: DataTypes.ENUM(
      'Desk', 'Chair', 'Table', 'Bench', 'Whiteboard',
      'Computer', 'Projector', 'Cabinet', 'Bookshelf', 'Fan', 'Other'
    ),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 }
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  },
  condition: {
    type: DataTypes.ENUM('Good', 'Fair', 'Repair Needed'),
    allowNull: false,
    defaultValue: 'Good'
  },
  dateOfEntry: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: true
})

export default Stock
