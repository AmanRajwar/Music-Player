const express = require('express');
const passport = require('passport');
const router = express.Router();

const homeController = require('../controllers/home_controller');

router.get('/',passport.checkAuthentication,homeController.home);
router.get('/playlist',homeController.playlists);
router.post('/create-playlist',homeController.createPlaylist);
router.post('/add-to-playlist',homeController.addToPlaylist);
router.post('/get-playlist-songs',homeController.getPlaylistSongs);

router.post('/favorites/song',homeController.addFavourites);
 router.get('/favorites/song-list',homeController.favouritesSongs);
 router.post('/favorites/remove',homeController.removeFavourite);
 router.post('/remove-from-playlist',homeController.removeFromPlaylist);
module.exports = router;