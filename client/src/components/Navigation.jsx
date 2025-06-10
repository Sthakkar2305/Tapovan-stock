import { Navbar, Nav, Container } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'

function Navigation() {
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="shadow-sm">
      <Container fluid>
        <LinkContainer to="/">
          <Navbar.Brand>
            <i className="bi bi-boxes me-2"></i>
            Stock Management
          </Navbar.Brand>
        </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <LinkContainer to="/">
              <Nav.Link>
                <i className="bi bi-speedometer2 me-1"></i>
                Dashboard
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/stock">
              <Nav.Link>
                <i className="bi bi-list-ul me-1"></i>
                Stock List
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/add">
              <Nav.Link>
                <i className="bi bi-plus-circle me-1"></i>
                Add Item
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/add-transaction">
              <Nav.Link>
                <i className="bi bi-arrow-left-right me-1"></i>
                Add Transaction
              </Nav.Link>
            </LinkContainer>
            <LinkContainer to="/transactions">
              <Nav.Link>
                <i className="bi bi-clock-history me-1"></i>
                Transaction List
              </Nav.Link>
            </LinkContainer>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Navigation
