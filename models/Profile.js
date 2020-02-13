const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    occupation: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    status: {
        type: String
    },
    skills: {
        type: [String] //an array of Strings
    },
    bio: {
        type: String
    },
    githubusername: {
        type: String
    },
    experience: [  // an array of the following
      {
          title: {
              type: String
          },
          company: {
              type: String
          },
          location: {
              type: String
          },
          from: {
              type: Date
          },
          to: {
              type: Date
          }
      }
    ],

    education: [  // an array of the following
        {
            school: {
                type: String
            },
            certificate: {
                type: String
            },
            fieldofstudy: {
                type: String
            },
            from: {
                type: Date
            },
            to: {
                type: Date
            },
            description: {
                type: String
            }
        }
      ],
      social: {
          youtube: {
              type: String
          },
          twitter: {
              type: String
          },
          facebook: {
              type: String
          },
          linkedin: {
              type: String
          },
          instagram: {
              type: String
          },
          date: {
              type: Date,
              default: Date.now
          }
      }

    
})

module.exports = Profile = mongoose.model('profile', ProfileSchema); 