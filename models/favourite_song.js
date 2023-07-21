const mongoose = require('mongoose');

const FavouriteSongSchema = new mongoose.Schema({
  song_id: {
    type: Number,
    required: true,
  },
  // duration: {
  //   type: Number,
  //   required: true
  // },
  title:{
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
  picture:{
    type:String,
    required: true
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

const FavouriteSong = mongoose.model('FavouriteSong', FavouriteSongSchema);
module.exports = FavouriteSong;