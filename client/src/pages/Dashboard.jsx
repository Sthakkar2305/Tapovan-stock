import { useState, useEffect, useRef } from 'react'
import { Row, Col, Card, Badge, ListGroup, Button } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getStockItems } from '../services/api'


function Dashboard() {
  const [stats, setStats] = useState({
    totalItems: 0,
    lowStockItems: 0,
    categories: 0,
    locations: 0
  })
  const [lowStockItems, setLowStockItems] = useState([])
  const [recentItems, setRecentItems] = useState([])
  const [categoryData, setCategoryData] = useState({})
  const [locationData, setLocationData] = useState({})
  const pdfRef = useRef()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await getStockItems()
      const items = response.data

      const lowStock = items.filter(item => item.quantity <= 5)
      const categories = [...new Set(items.map(item => item.category))].length
      const locations = [...new Set(items.map(item => item.location))].length
      const recent = items
        .sort((a, b) => new Date(b.dateOfEntry) - new Date(a.dateOfEntry))
        .slice(0, 5)

      const categoryCounts = {}
      const locationCounts = {}
      items.forEach(item => {
        categoryCounts[item.category] = (categoryCounts[item.category] || 0) + 1
        locationCounts[item.location] = (locationCounts[item.location] || 0) + 1
      })

      setStats({
        totalItems: items.length,
        lowStockItems: lowStock.length,
        categories,
        locations
      })
      setLowStockItems(lowStock)
      setRecentItems(recent)
      setCategoryData({
        labels: Object.keys(categoryCounts),
        datasets: [{
          data: Object.values(categoryCounts),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#66bb6a', '#ffa726']
        }]
      })
      setLocationData({
        labels: Object.keys(locationCounts),
        datasets: [{
          label: 'Stock per Location',
          data: Object.values(locationCounts),
          backgroundColor: '#42a5f5'
        }]
      })

      toast.success('Dashboard data loaded successfully!')
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      toast.error('Failed to load dashboard data.')
    }
  }

  const getConditionBadgeVariant = (condition) => {
    if (!condition) return 'secondary'
    switch (condition.toLowerCase()) {
      case 'good': return 'success'
      case 'fair': return 'warning'
      case 'repair needed': return 'danger'
      default: return 'secondary'
    }
  }

  const downloadPDF = () => {
    const input = pdfRef.current
    html2canvas(input).then(canvas => {
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save('dashboard.pdf')
    })
  }

  return (
    <div className="py-4" ref={pdfRef}>
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h2 mb-0">Dashboard</h1>
        <div>
          <Link to="/add" className="btn btn-primary me-2">
            <i className="bi bi-plus-circle me-1"></i> Add New Item
          </Link>
          <Button variant="outline-success" onClick={downloadPDF}>
            <i className="bi bi-download me-1"></i> Export PDF
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        {[
          { title: 'Total Items', value: stats.totalItems, icon: 'bi-boxes' },
          { title: 'Low Stock', value: stats.lowStockItems, icon: 'bi-exclamation-triangle' },
          { title: 'Categories', value: stats.categories, icon: 'bi-tags' },
          { title: 'Locations', value: stats.locations, icon: 'bi-geo-alt' }
        ].map(({ title, value, icon }, index) => (
          <Col lg={3} md={6} className="mb-3" key={title}>
            <Card className="h-100 bg-light border-0 shadow-sm">
              <Card.Body className="d-flex align-items-center">
                <div className="flex-grow-1">
                  <h5>{title}</h5>
                  <h2>{value}</h2>
                </div>
                <i className={`bi ${icon} fs-2 text-secondary`}></i>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Charts */}
      {/* transiction */}
      <Col lg={12} className="mb-4">
  <Card className="h-100">
    <Card.Header className="bg-info text-white">
      <i className="bi bi-cash-stack me-2"></i>Latest Transactions
    </Card.Header>
    <Card.Body>
      {recentItems.length === 0 ? (
        <p className="text-muted text-center py-3">No recent transactions</p>
      ) : (
        <ListGroup variant="flush">
          {recentItems.map(item => (
            <ListGroup.Item key={item._id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong><br />
                  <small>{new Date(item.dateOfEntry).toLocaleString()} • {item.category} • {item.location}</small>
                </div>
                <Badge bg={getConditionBadgeVariant(item.condition)}>
                  {item.condition || 'N/A'}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card.Body>
  </Card>
</Col>
<Col lg={12} className="mb-4">
  <Card className="h-100">
    <Card.Header className="bg-info text-white">
      <i className="bi bi-cash-stack me-2"></i>Latest Transactions
    </Card.Header>
    <Card.Body>
      {recentItems.length === 0 ? (
        <p className="text-muted text-center py-3">No recent transactions</p>
      ) : (
        <ListGroup variant="flush">
          {recentItems.map(item => (
            <ListGroup.Item key={item._id}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>{item.name}</strong><br />
                  <small>{new Date(item.dateOfEntry).toLocaleString()} • {item.category} • {item.location}</small>
                </div>
                <Badge bg={getConditionBadgeVariant(item.condition)}>
                  {item.condition || 'N/A'}
                </Badge>
              </div>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Card.Body>
  </Card>
</Col>


      {/* Low Stock + Recent Items */}
      <Row>
        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-danger text-white">
              <i className="bi bi-exclamation-triangle me-2"></i>Low Stock Alert
            </Card.Header>
            <Card.Body>
              {lowStockItems.length === 0 ? (
                <p className="text-muted text-center py-3">No low stock items</p>
              ) : (
                <ListGroup variant="flush">
                  {lowStockItems.map(item => (
                    <ListGroup.Item key={item._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.name}</strong><br />
                          <small>{item.location}</small>
                        </div>
                        <Badge bg="danger">{item.quantity} left</Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6} className="mb-4">
          <Card className="h-100">
            <Card.Header className="bg-primary text-white">
              <i className="bi bi-clock-history me-2"></i>Recent Additions
            </Card.Header>
            <Card.Body>
              {recentItems.length === 0 ? (
                <p className="text-muted text-center py-3">No recent items</p>
              ) : (
                <ListGroup variant="flush">
                  {recentItems.map(item => (
                    <ListGroup.Item key={item._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.name}</strong><br />
                          <small>{item.category} • {item.location}</small>
                        </div>
                        <Badge bg={getConditionBadgeVariant(item.condition)}>
                          {item.condition || 'N/A'}
                        </Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard
