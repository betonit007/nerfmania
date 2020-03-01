import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import ProfileTop from './ProfileTop'
import ProfileAbout from './ProfileAbout'
import ProfileCertifications from './ProfileCertifications'
import ProfileGithub from './ProfileGithub'
import ProfileExperience from './ProfileExperience'
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
            Back To Profiles
           </Link>
          {
            auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&
            (
              <Link to='edit/profile' className='btn btn-dark'>
                Edit Profile
                  </Link>
            )
          }
          <div className="profile-grid my-1">
            <ProfileTop profile={profile} />
            <ProfileAbout profile={profile} />
            <div className="profile-exp bg-white p-2">
              <h2 className="text-primary">Experience</h2>
              {profile.experience.length > 0 ?
                (
                  <>
                    {profile.experience.map(exp => (
                      <ProfileExperience key={exp._id} experience={exp} />
                    ))}
                  </>
                )
                :
                (<h4>No experience credentials</h4>)
              }
            </div>
            <div className="profile-edu bg-white p-2">
              <h2 className="text-primary">Certifications</h2>
              {profile.certifications && profile.certifications.length > 0 ?
                (
                  <>
                    {profile.certifications.map(edu => (
                      <ProfileCertifications key={edu._id} education={edu} />
                    ))}
                  </>
                )
                :
                (<h4>No experience credentials</h4>)
              }
            </div>
            {profile.githubusername && (
              <ProfileGithub username={profile.githubusername} />
            )}

          </div>

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
