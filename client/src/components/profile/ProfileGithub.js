import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Spinner from '../layout/Spinner'
import { getRepos } from '../../actions/profile'

const ProfileGithub = ({ username, getRepos, repos }) => {
  console.log(repos);
  useEffect(() => {
    getRepos(username)
  }, [getRepos])
  return (
    <div className="profile-github">
      <h2 className="text-primary my-1">Github Repos</h2>
      {repos === null ? <Spinner /> : repos ? (
        repos.map(repo => (
          <div className="repo bg-white p-1 my-1">
            <div>
              <h4>
                <a href={repo.html_url} target='_blank' rel='noopener noreferrer'>
                  {repo.name}
                </a>
              </h4>
              <p>{repo.description}</p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">
                  Stars: {repo.stargazers_count}
                </li>
                <li className="badge badge-dark">
                  Watchers: {repo.watchers}
                </li>
                <li className="badge badge-primary">
                  Forks: {repo.forks_count}
                </li>
              </ul>
            </div>
          </div>
        ))
      )
        :
        (
          <p>No Github account associated with user</p>
        )
      }
    </div>
  )
}

ProfileGithub.propTypes = {
  getRepos: PropTypes.func.isRequired,
  repos: PropTypes.array.isRequired,
  username: PropTypes.string.isRequired,
}

const mapStateToProps = state => ({
  repos: state.profile.repos
})

export default connect(mapStateToProps, { getRepos })(ProfileGithub)