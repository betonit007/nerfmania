import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getRepos } from '../../actions/profile'
import './ProfileThingiverse.css'

const ThingiverseProfile = ({ username, getRepos, repos }) => {
  console.log(repos);
  useEffect(() => {
    getRepos(username)
  }, [getRepos])
  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Latest Projects</h2>
      <div className="projectContainer">
        {repos === null ? <Spinner /> : repos ? (
          repos.map((repo, index) => (
            <div className="projectCard">
              <img src={repo.thumbnail} alt={repo.name}/>
            </div>

          ))

        )
          :
          (
            <p>No Thingiverse account associated with user</p>
          )
        }
      </div>
    </div>
  )
}

ThingiverseProfile.propTypes = {
  getRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  repos: state.profile.repos
})

export default connect(mapStateToProps, { getRepos })(ThingiverseProfile)