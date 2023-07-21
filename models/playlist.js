const mongoose = require('mongoose');
// const { playlists } = require('../controllers/home_controller');


const playlistSchema = new mongoose.Schema({
    song_id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true
    },
    artistName: {
        type: String,
        required: true
    },
    preview: {
        type: String,
        required: true
    },
    picture: {
        type: String,
        required: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    user_playlist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserPlaylist'
    }
}, {
    timestamps: true
});

const Playlist = mongoose.model('Playlist', playlistSchema);
module.exports = Playlist;