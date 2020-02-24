import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { logout } from '../../actions/auth'

const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {

    const authLinks = (
        <ul>
            <li>
                <Link to='/dashboard'>
                    <i className="fas fa-user"></i>{' '}
                    <span className='hide-sm'>Dashboard</span>
                </Link>
            </li>
            <li>
                <a onClick={logout} href="#!">
                    <i className="fas fa-sign-out-alt"></i>{' '}
                    <span className='hide-sm'>Logout</span>
                </a>
            </li>
        </ul>
    )


    const guestLinks = (

        <ul>
            <li><Link to="#!">Modelers</Link></li>
            <li><Link to="/register">Register</Link></li>
            <li><Link to="/login">Login</Link></li>
        </ul>

    )

    return (
        <nav className="navbar bg-dark">
            <h1>
                <Link to="/"><i className="fab fa-unity"></i>In3d</Link>
            </h1>
            {!loading && (<>{isAuthenticated ? authLinks : guestLinks}</>)}
        </nav>
    )
}

Navbar.prototypes = {
    logout: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStatetoProps = state => ({
    auth: state.auth
})

export default connect(mapStatetoProps, { logout })(Navbar)
