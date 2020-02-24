import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { setAlert } from '../../actions/alert'
import { register } from '../../actions/auth'
import PropTypes from 'prop-types'


const Register = ({ setAlert, register, isAuthenticated }) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const { name, email, password, password2 } = formData

    const onSubmit = async e => {
        e.preventDefault();
        if (password !== password2) {
           setAlert('Passwords do not match', 'danger')
        } else {

           register({ name, email, password })
        }
    }

    //Redirect is logged in

    if(isAuthenticated) {
        return <Redirect to='/dashboard' />
    }

    return (

        <>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
            <form className="form" action="create-profile.html">
                <div className="form-group">
                    <input
                        type="text"
                        value={name}
                        onChange={e => onChange(e)}
                        placeholder="Name"
                        name="name"
                        required />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        value={email}
                        onChange={e => onChange(e)}
                        placeholder="Email Address"
                        name="email"
                    />
                    
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={password}
                        onChange={e => onChange(e)}
                        placeholder="Password"
                        name="password"
                        minLength="6"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        value={password2}
                        onChange={e => onChange(e)}
                        placeholder="Confirm Password"
                        name="password2"
                        minLength="6"
                    />
                </div>
                <input type="submit" onClick={e => onSubmit(e)} className="btn btn-primary" value="Register" />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </>
    )
}

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, { setAlert, register })(Register)
