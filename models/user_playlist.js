const mongoose = require('mongoose');


const userPlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    user: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    songs: [
        {
            type:  mongoose.Schema.Types.ObjectId,
            ref: 'Playlist'
        }
    ]
},{
    timestamps: true
});

const UserPlaylist = mongoose.model('UserPlaylist', userPlaylistSchema);
module.exports = UserPlaylist;