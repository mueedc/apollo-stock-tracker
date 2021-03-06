import React from 'react'
import { connect } from 'react-redux'
import { withRouter, Link } from 'react-router-dom'
import { logout } from '../store'

const Main = ({ children, handleClick, isLoggedIn }) => (
  <div>
    <h1>Apollo Stock Tracker</h1>
    <nav>
      {isLoggedIn ? (
        <div>
          {/* The navbar will show these links after you log in */}
          <Link to="/portfolio">Portfolio</Link>
          <a href="#" onClick={handleClick}>
            Logout
          </a>
        </div>
      ) : (
        <div>
          {/* The navbar will show these links before you log in */}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
        </div>
      )}
    </nav>
    <hr />
    {children}
  </div>
)

const mapState = state => ({ isLoggedIn: !!state.user.id })
const mapDispatch = dispatch => ({
  handleClick () {
    dispatch(logout())
   }
})

export default withRouter(connect(mapState, mapDispatch)(Main))
