const { name } = require('ejs');
const UserPlaylist = require('../models/user_playlist');
const FavouriteSong = require('../models/favourite_song')
const Playlist =require('../models/playlist');
const { search, getArtist } = require('./helper.js')
var tracks = [];
module.exports.home = async (req, res) => {

  const response = await search('Eminem');

  if (response.error) {
    return res.render('home');
  }

  try {
    const trackPromises = response.data.map(data => getArtist(data.id));
    const tracks = await Promise.all(trackPromises);

    return res.render('home', { tracks });
  } catch (error) {
    console.error(error);
    return res.render('home');
  }

}



module.exports.addFavourites = async (req, res) => {
  const songId = req.body.songId;

  // console.log(track);
  try {
    // Check if the song is already in favorites for the user
    const existingFavourite = await FavouriteSong.findOne({
      song_id: songId,
      user: req.user._id,
    });

    if (existingFavourite) {
      return res.status(200).json({ message: 'Song is already in favorites' });
    }
    const track = await getArtist(songId);

    // If the song is not in favorites, create a new record
    const song = await FavouriteSong.create({
      song_id: songId,
      user: req.user._id,
      artistName: track.artist.name,
      picture: track.artist.picture,
      preview: track.preview,
      title: track.title
    });

    // Respond with a success status or data if needed
    return res.status(200).json({ message: 'Song added to favorites' });
  } catch (error) {
    // Handle any errors that occurred during database interaction
    console.error(error);
    return res.status(500).json({ error: 'Something went wrong' });
  }
}

module.exports.favouritesSongs = async (req, res) => {
  try {
    // Find all user's favourite songs from the database
    const songs = await FavouriteSong.find({ user: req.user._id });

    // Send the favouriteSongs array as the response
    return res.status(200).json(songs);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }

}




module.exports.removeFavourite = async (req, res) => {
  try {
    const songId = req.body.songId;
    const userId = req.user._id;

    // Use findOneAndDelete to find and delete the favorite song that matches the given songId and user
    const deletedSong = await FavouriteSong.findOneAndDelete({ song_id: songId, user: userId });
    console.log(deletedSong)
    if (!deletedSong) {
      // If the song was not found, return an error response
      return res.status(404).json({ error: 'Favorite song not found' });
    }

    // Song successfully deleted then
    const songs = await FavouriteSong.find({ user: req.user._id });
    return res.status(200).json(songs);
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports.playlists = async (req, res) => {
  try {
    // Find the user's playlist in the database based on the user's ID
    const playlists = await UserPlaylist.find({ user: req.user._id }).exec();

    // If the playlist is found, send it as a JSON response
    if (playlists) {
      return res.status(200).json(playlists);
    } else {
      // If the user doesn't have any playlists, return an empty array
      return res.status(200).json([]);
    }
  } catch (error) {
    // Handle any errors that occur during the query
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports.createPlaylist=  async (req, res) => {
  const { name } = req.body;
  const userId = req.user._id; // Assuming you have the authenticated user's ID stored in req.user

  try {
    // Create a new playlist with the provided name and user ID
    const playlist = await UserPlaylist.create({ name, user: userId });

    return res.status(200).json(playlist);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}


module.exports.addToPlaylist=async(req,res)=>{
try{

  const exists = await Playlist.findOne({
    song_id: req.body.songId,
    user: req.user._id,
     user_playlist: req.body.playlistId
  });

  if (exists) {

    return res.status(200).json({ message: 'Song is already in playlist' });
  }

  const playlist=await  UserPlaylist.findById(req.body.playlistId);

  const track = await getArtist(req.body.songId);
  const song = await Playlist.create({
    song_id: req.body.songId,
    user: req.user._id,
    artistName: track.artist.name,
    picture: track.artist.picture,
    preview: track.preview,
    title: track.title,
    user_playlist:req.body.playlistId
  })
  playlist.songs.push(song);
  await playlist.save();
  const populatedSong = await song.populate('user_playlist');


   return res.status(200).json({ message: 'Song added to playlist successfully', song });
}catch(error){
  console.log(error);
  return res.status(500).json({ error: 'Internal Server Error' });
}
}


module.exports.getPlaylistSongs = async (req,res)=>{
  try{
    const playlist = await UserPlaylist.findById(req.body.playlistId).populate('songs');
    return  res.status(200).json( playlist.songs);
  }catch(err){
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
  
}


module.exports.removeFromPlaylist = async (req, res) => {

const {songId, playlistId}= req.body;
try {
    // Find the song in the Playlist model using songId and playlistId
    const song = await Playlist.findOneAndDelete({
      user_playlist:playlistId,
      song_id: songId,
    });
console.log(song);
    if (!song) {
      return res.status(404).json({ message: 'Song not found in the playlist' });
    }

    // Remove the song from the UserPlaylist model
    const userPlaylist = await UserPlaylist.findByIdAndUpdate(
      playlistId,
      { $pull: { songs: song._id } },
      { new: true }
    );

    if (!userPlaylist) {
      return res.status(404).json({ message: 'User playlist not found' });
    }

    // Save the updated UserPlaylist model
    await userPlaylist.save();

    // Retrieve the updated list of songs from the UserPlaylist model
    const playlist = await UserPlaylist.findById(playlistId).populate('songs');
    return  res.status(200).json( playlist.songs);
  } catch (error) {
    console.error('Error removing song from playlist:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};