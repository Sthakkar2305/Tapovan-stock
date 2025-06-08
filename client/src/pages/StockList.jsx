import { useState, useEffect } from 'react'
import { Table, Button, Card, Row, Col, Form, Badge, Alert } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { getStockItems, deleteStockItem } from '../services/api'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'


function StockList() {
  const [items, setItems] = useState([])
  const [filteredItems, setFilteredItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [conditionFilter, setConditionFilter] = useState('')
  const [sortBy, setSortBy] = useState('dateOfEntry')
  const [sortOrder, setSortOrder] = useState('desc')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  useEffect(() => {
    filterAndSortItems()
  }, [items, searchTerm, categoryFilter, conditionFilter, sortBy, sortOrder])

  const fetchItems = async () => {
    try {
      setLoading(true)
      const response = await getStockItems()
      setItems(response.data)
      setError('')
    } catch (error) {
      setError('Failed to fetch items')
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await deleteStockItem(id)
        fetchItems()
      } catch (error) {
        setError('Failed to delete item')
        console.error('Error deleting item:', error)
      }
    }
  }

  const filterAndSortItems = () => {
    let filtered = [...items]

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(item => item.category === categoryFilter)
    }

    if (conditionFilter) {
      filtered = filtered.filter(item => item.condition === conditionFilter)
    }

    filtered.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === 'dateOfEntry') {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else if (sortBy === 'quantity') {
        aValue = parseInt(aValue)
        bValue = parseInt(bValue)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredItems(filtered)
  }

  const getConditionBadgeVariant = (condition) => {
    switch (condition.toLowerCase()) {
      case 'good': return 'success'
      case 'fair': return 'warning'
      case 'repair needed': return 'danger'
      default: return 'secondary'
    }
  }

  const getQuantityBadgeVariant = (quantity) => {
    if (quantity <= 5) return 'danger'
    if (quantity <= 15) return 'warning'
    return 'success'
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.text('Stock Inventory Report', 14, 10)

    const tableColumn = ["Name", "Category", "Quantity", "Location", "Condition", "Date Added"]
    const tableRows = []

    filteredItems.forEach(item => {
      const rowData = [
        item.name,
        item.category,
        item.quantity,
        item.location,
        item.condition,
        new Date(item.dateOfEntry).toLocaleDateString()
      ]
      tableRows.push(rowData)
    })

autoTable(doc, {
  head: [tableColumn],
  body: tableRows,
  startY: 20
})


    doc.save('stock-inventory.pdf')
  }

  const categories = [...new Set(items.map(item => item.category))]
  const conditions = [...new Set(items.map(item => item.condition))]

  if (loading) {
    return (
      <div className="py-4">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Stock Inventory</h1>
        <div className="d-flex gap-2">
          <Link to="/add" className="btn btn-primary btn-custom">
            <i className="bi bi-plus-circle me-2"></i>
            Add New Item
          </Link>
          <Button variant="outline-success" onClick={handleDownloadPDF}>
            <i className="bi bi-download me-2"></i>
            Download PDF
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          {error}
        </Alert>
      )}

      <Card className="search-container mb-4">
        <Row>
          <Col md={4} className="mb-3">
            <Form.Group>
              <Form.Label>Search Items</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Condition</Form.Label>
              <Form.Select
                value={conditionFilter}
                onChange={(e) => setConditionFilter(e.target.value)}
              >
                <option value="">All Conditions</option>
                {conditions.map(condition => (
                  <option key={condition} value={condition}>{condition}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="dateOfEntry">Date Added</option>
                <option value="name">Name</option>
                <option value="quantity">Quantity</option>
                <option value="category">Category</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2} className="mb-3">
            <Form.Group>
              <Form.Label>Order</Form.Label>
              <Form.Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card>

      <div className="mb-3">
        <p className="text-muted">
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>

      <Card>
        <div className="table-responsive">
          <Table striped hover className="mb-0">
            <thead>
              <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Location</th>
                <th>Condition</th>
                <th>Date Added</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-muted">
                    No items found
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item._id}>
                    <td><strong>{item.name}</strong></td>
                    <td>{item.category}</td>
                    <td>
                      <Badge bg={getQuantityBadgeVariant(item.quantity)}>
                        {item.quantity}
                      </Badge>
                    </td>
                    <td>{item.location}</td>
                    <td>
                      <Badge bg={getConditionBadgeVariant(item.condition)}>
                        {item.condition}
                      </Badge>
                    </td>
                    <td>{new Date(item.dateOfEntry).toLocaleDateString()}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/edit/${item.id}`}
                          className="btn btn-sm btn-outline-primary"
                        >
                          <i className="bi bi-pencil"></i>
                        </Link>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(item._id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </div>
      </Card>
    </div>
  )
}

export default StockList
