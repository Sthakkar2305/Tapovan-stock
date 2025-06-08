import { useState, useEffect } from 'react'
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { getStockItem, updateStockItem } from '../services/api'

function EditItem() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    location: '',
    condition: 'Good'
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')

  const categories = [
    'Desk',
    'Chair',
    'Table',
    'Bench',
    'Whiteboard',
    'Computer',
    'Projector',
    'Cabinet',
    'Bookshelf',
    'Fan',
    'Other'
  ]

  const conditions = ['Good', 'Fair', 'Repair Needed']

  useEffect(() => {
    fetchItem()
  }, [id])

  const fetchItem = async () => {
    try {
      setFetchLoading(true)
      const response = await getStockItem(id)
      const item = response.data
      setFormData({
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        location: item.location,
        condition: item.condition
      })
      setError('')
    } catch (error) {
      setError('Failed to fetch item details')
      console.error('Error fetching item:', error)
    } finally {
      setFetchLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await updateStockItem(id, formData)
      navigate('/stock')
    } catch (error) {
      setError('Failed to update item. Please try again.')
      console.error('Error updating item:', error)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
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
        <h1 className="h2 mb-0">Edit Item</h1>
        <Button
          variant="outline-secondary"
          onClick={() => navigate('/stock')}
        >
          <i className="bi bi-arrow-left me-2"></i>
          Back to Stock List
        </Button>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-pencil me-2"></i>
                Edit Item Information
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger\" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Item Name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter item name"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Category *</Form.Label>
                      <Form.Select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map(category => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Quantity *</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="Enter quantity"
                        min="0"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Location *</Form.Label>
                      <Form.Control
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g., Class 5A, Library, Office"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Condition *</Form.Label>
                      <Form.Select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                      >
                        {conditions.map(condition => (
                          <option key={condition} value={condition}>
                            {condition}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => navigate('/stock')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="warning"
                    type="submit"
                    disabled={loading}
                    className="btn-custom"
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2\" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Updating...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Update Item
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default EditItem