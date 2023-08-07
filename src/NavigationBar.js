import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "./NavigationBar.css";
/** NavigationBar
 * 
 * Props:
 * - currentUser: {}
 * - logOut()
 * 
 * State:
 * - none
 * 
 * App --> NavigationBar
 */
function NavigationBar({ currentUser, logOut }) {

  function handleLogOut(evt) {
    evt.preventDefault();
    logOut();
  }

  return (
    <Navbar expand="lg" className="justify-content-between">
      <Navbar.Brand as={NavLink} to="/"><h2>Jobly</h2></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav" >
      {currentUser &&  <Nav className="ml-auto">
        <Nav.Link as={NavLink} to="/companies">Companies</Nav.Link>
        <Nav.Link as={NavLink} to="/jobs">Jobs</Nav.Link>
        <Nav.Link as={NavLink} to="/profile">Profile</Nav.Link>
        <Nav.Link>
        <button type="submit"
                onClick={handleLogOut}
                className="NavBar-logout">Logout {currentUser.username}</button>
        </Nav.Link>
        </Nav>}
      {!currentUser && <Nav className="ml-auto">
        <Nav.Link as={NavLink} to="/login">Login</Nav.Link>
        <Nav.Link as={NavLink} to="/signup">Signup</Nav.Link>
        </Nav>}
        </Navbar.Collapse>
    </Navbar >
  );
}

export default NavigationBar;