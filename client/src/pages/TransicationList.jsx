import { useState, useEffect } from "react"
import {
  Table,
  Button,
  Card,
  Row,
  Col,
  Form,
  Badge,
  Alert,
} from "react-bootstrap"
import { Link } from "react-router-dom"
import axios from "axios"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function TransactionList() {
  const [transactions, setTransactions] = useState([])
  const [filtered, setFiltered] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortOrder, setSortOrder] = useState("desc")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchTransactions()
  }, [])

  useEffect(() => {
    filterAndSortTransactions()
  }, [transactions, searchTerm, sortBy, sortOrder])

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/transactions`)
      setTransactions(res.data)
      setError("")
    } catch (err) {
      console.error(err)
      setError("Failed to fetch transactions.")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortTransactions = () => {
    let filteredData = [...transactions]

    if (searchTerm) {
      filteredData = filteredData.filter((tx) =>
        tx.Stock?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    filteredData.sort((a, b) => {
      let aValue = a[sortBy]
      let bValue = b[sortBy]

      if (sortBy === "createdAt") {
        aValue = new Date(aValue)
        bValue = new Date(bValue)
      } else if (sortBy === "quantity") {
        aValue = parseInt(aValue)
        bValue = parseInt(bValue)
      }

      return sortOrder === "asc"
        ? aValue > bValue ? 1 : -1
        : aValue < bValue ? 1 : -1
    })

    setFiltered(filteredData)
  }

  const handleDownloadPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Transaction History", 14, 22)

    const tableRows = filtered.map((tx) => [
      tx.Stock?.name || "N/A",
      tx.type,
      tx.quantity,
      tx.remarks || "-",
      new Date(tx.createdAt).toLocaleString(),
    ])

    autoTable(doc, {
      startY: 30,
      head: [["Item", "Action", "Quantity", "Remarks", "Date"]],
      body: tableRows,
      styles: { fontSize: 10, halign: "center" },
      headStyles: { fillColor: [52, 58, 64], textColor: "#fff" },
    })

    doc.save("Transaction-History.pdf")
  }

  const getActionBadge = (type) => {
    switch (type?.toLowerCase()) {
      case "add":
        return "success"
      case "remove":
        return "danger"
      default:
        return "secondary"
    }
  }

  if (loading) {
    return (
      <div className="py-4 text-center">
        <div className="spinner-border" role="status" />
      </div>
    )
  }

  return (
    <div className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Transaction History</h2>
        <Button variant="outline-success" onClick={handleDownloadPDF}>
          <i className="bi bi-download me-2" />
          Download PDF
        </Button>
      </div>

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Card className="mb-4 p-3">
        <Row>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Search by Item Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g. Marker, Duster..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Sort By</Form.Label>
              <Form.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="createdAt">Date</option>
                <option value="quantity">Quantity</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
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

      <Card>
        {filtered.length === 0 ? (
          <p className="text-center py-4 text-muted">No transactions found.</p>
        ) : (
          <div className="table-responsive">
            <Table striped hover>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Qty</th>
                  <th>Remarks</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
             <tbody>
  {filtered.map((tx) => {

    return (
      <tr key={tx.id}>
        <td>{tx.Stock?.name || "N/A"}</td>
        <td>{tx.quantity}</td>
        <td>{tx.remarks || "-"}</td>
        <td>{new Date(tx.createdAt).toLocaleString()}</td>
        <td>
          <Badge bg={getActionBadge(tx.type)}>{tx.type || "N/A"}</Badge>
        </td>
      </tr>
    )
  })}
</tbody>
            </Table>
          </div>
        )}
      </Card>
    </div>
  )
}

export default TransactionList
