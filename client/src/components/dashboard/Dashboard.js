import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import DashboardActions from './DashboardActions'
import { getCurrentProfile } from '../../actions/profile'
import { loadUser } from '../../actions/auth'

const Dashboard = ({ loadUser, getCurrentProfile, auth: { user }, profile: { profile, loading } }) => {

  useEffect(() => {
    if (user === null) {
      loadUser()
    }
    getCurrentProfile()
  }, [])

  return (
    (!loading && !profile === null) && user.name !== '' ?
      <Spinner />
      :
      <>
        <h1 className="larg text-primary">
          Dashboard
          </h1>
        <p className="lead">
          <i className="fas fa-user"></i> Welcome {user && user.name}
        </p>
        {profile !== null ?
          <DashboardActions />
          :
          (
            <>
              <p>You have not yet setup a profile, please add some info</p>
              <Link to='/createprofile' className='btn btn-primary my-1'>
                Create Profile
          </Link>
            </>
          )
        }
      </>
  )
}

Dashboard.propTypes = {
  getCurrentProfile: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  profile: PropTypes.object.isRequired,
  loadUser: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  auth: state.auth,
  profile: state.profile
})

export default connect(mapStateToProps, { getCurrentProfile, loadUser })(Dashboard)
