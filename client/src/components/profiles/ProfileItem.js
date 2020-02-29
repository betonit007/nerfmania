import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

const ProfileItem = ({ profile: { user: { _id, name, avatar }, status, company, location, skills } }) => {
    return (
        <div className="profile bg-light">
            <div>
                <img src={avatar} alt="" className="round-img" />

                <h2>{name}</h2>
                <p>{status && status} {company && <span> {company} </span>} </p>
                <div className="my-1">{location && <span>location</span>}</div>
                <Link to={`/profile/${_id}`} className='btn btn-primary'>
                    View Profile
                </Link>
            </div>
            <ul>
                {skills.slice(0, 4).map((skill, index) => (
                    <li key={index} className='text-primary'>
                        <i className="fas fa-check">{skill}</i>
                    </li>
                ))
                }
            </ul>
        </div>
    )
}

ProfileItem.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileItem
