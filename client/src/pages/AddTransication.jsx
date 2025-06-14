import { useState, useEffect } from 'react'
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function AddTransaction() {
  const navigate = useNavigate()

  const [items, setItems] = useState([])
  const [formData, setFormData] = useState({
    stockId: '',
    type: '',
    quantity: '',
    remarks: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const actions = ['Damage', 'Lost', 'Sold', 'Transferred']

  useEffect(() => {
   axios.get(`${process.env.VITE_API_URL}/api/stock`)
      .then(res => setItems(res.data))
      .catch(() => setError('Failed to load stock items.'))
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    const { stockId, type, quantity } = formData
    console.log('stockId:', stockId, 'type:', type, 'quantity:', quantity)

    if (!stockId || ! type || !quantity || quantity <= 0) {
      setError('Please fill all required fields correctly.')
      setLoading(false)
      return
    }

    try {
    await axios.post(`${process.env.VITE_API_URL}/api/transactions`, formData)

      setSuccess('Transaction recorded successfully!')
      setFormData({ stockId: '', type: '', quantity: '', remarks: '' })
    } catch (err) {
      setError(err.response?.data?.error || 'Transaction failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Add Transaction</h1>
        <Button variant="outline-secondary" onClick={() => navigate('/transactions')}>
          <i className="bi bi-arrow-left me-2"></i>
          Back to Transactions
        </Button>
      </div>

      <Row className="justify-content-center">
        <Col lg={8}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-plus-circle me-2"></i>
                Transaction Information
              </h5>
            </Card.Header>
            <Card.Body>
              {error && (
                <Alert variant="danger" dismissible onClose={() => setError('')}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert variant="success" dismissible onClose={() => setSuccess('')}>
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Item *</Form.Label>
                      <Form.Select
                        name="stockId"
                        value={formData.stockId}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Item</option>
                        {items.map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Action *</Form.Label>
                      <Form.Select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Action</option>
                        {actions.map(action => (
                          <option key={action} value={action}>
                            {action.charAt(0).toUpperCase() + action.slice(1)}
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
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>

                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Label>Remarks</Form.Label>
                      <Form.Control
                        type="text"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="Optional remarks"
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex gap-2 justify-content-end">
                  <Button
                    variant="outline-secondary"
                    type="button"
                    onClick={() => navigate('/transactions')}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={loading}
                    className="btn-custom"
                  >
                    {loading ? (
                      <>
                        <div className="spinner-border spinner-border-sm me-2" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        Adding...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Add Transaction
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

export default AddTransaction
