import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';
import Stock from './Stock.js';

const Transaction = sequelize.define('Transaction', {
  stockId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Stock,
      key: 'id'
    }
  },
  type: {
    type: DataTypes.ENUM('Damage', 'Lost', 'Sold', 'Transferred'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 1 }
  },
  remarks: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true
});

Stock.hasMany(Transaction, { foreignKey: 'stockId' });
Transaction.belongsTo(Stock, { foreignKey: 'stockId' });

export default Transaction;
