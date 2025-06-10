import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import Dashboard from './pages/Dashboard'
import StockList from './pages/StockList'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import AddTransaction from './pages/AddTransication'  // ✅ Make sure the filename is correct
import TransactionList from './pages/TransicationList' // ✅ Check for typo, should be 'TransactionList'
import './App.css'

function App() {
  return (
    <div className="App">
      <Navigation />
      <div className="container-fluid">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stock" element={<StockList />} />
          <Route path="/add" element={<AddItem />} />
          <Route path="/edit/:id" element={<EditItem />} />
          <Route path="/add-transaction" element={<AddTransaction />} /> {/* ✅ Add Transaction Page */}
          <Route path="/transactions" element={<TransactionList />} />   {/* ✅ Transaction List Page */}
        </Routes>
      </div>
    </div>
  )
}

export default App
