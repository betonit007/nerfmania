import React, { useState } from 'react'
import { Link, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { login } from '../../actions/auth'


const Login = ({ login, isAuthenticated }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    })

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value })

    const { email, password } = formData

    const onSubmit = async e => {
        e.preventDefault();
           login(email, password)
    }

    //Redirect is logged in

    if(isAuthenticated) {
        return <Redirect to='/dashboard' />
    }

    return (
        <>
            <h1 className="large text-primary">Sign In</h1>
        
            <form className="form" action="create-profile.html">
    
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
                <input type="submit" onClick={e => onSubmit(e)} className="btn btn-primary" value="Log In" />
            </form>
        </>
    )
}

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool,
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {login})(Login)
