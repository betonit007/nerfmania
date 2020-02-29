import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import Spinner from '../layout/Spinner'
import ProfileItem from './ProfileItem'
import { getProfiles } from '../../actions/profile'

const Profiles = ({ getProfiles, profile: { profiles, loading } }) => {

    useEffect(() => {
        getProfiles()
    }, [getProfiles])

    return (
        <>
            {loading ? <Spinner /> :
                <>
                    <h1 className="large text-primary">Modelers</h1>
                    <p className="lead">
                        <i className="fab fa-connectdevelop"></i>Connect with other 3d Modelers
              </p>
                    <div className="profiles">
                        {
                            profiles.length > 0 ?
                                (
                                 profiles.map(profile => (
                                     <ProfileItem key={profile._id} profile={profile} />
                                 ))
                                ) 
                                :
                                <h4>No Profiles found</h4>
                        }
                    </div>
                </>
            }
        </>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    profile: state.profile
})

export default connect(mapStateToProps, { getProfiles })(Profiles)
