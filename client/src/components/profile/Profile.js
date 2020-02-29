import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getProfileById } from '../../actions/profile'

const Profile = ({ getProfileById, profile: { profile, loading }, auth, match }) => { //this gets the id from the url (props.match)

    useEffect(() => {
        getProfileById(match.params.id) //this gets the id from the url (props.match)
        console.log(auth)
    }, [getProfileById])

    return (
        <>
         {profile === null || loading ? <Spinner /> :
         <>
           <Link to='/profiles' className='btn btn-light'>
               Backt To Profiles
           </Link>
           {
             auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && 
               (
                 <Link to='edit/profile' className='btn btn-dark'>
                   Edit Profile
                  </Link>
                )
            }
         </>
         }
        </>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStatetoProps = state => ({
    profile: state.profile,
    auth: state.auth
})

export default connect(mapStatetoProps, { getProfileById })(Profile)
