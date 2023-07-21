

$(document).ready(function () {
  let formAppended = false;

  // Function to make a GET AJAX call
  function makeGetAjaxCall(url) {
    return $.ajax({
      url: url,
      method: 'GET',
      dataType: 'json',
    });
  }

  // Function to make a POST AJAX call
  function makePostAjaxCall(url, data) {
    return $.ajax({
      url: url,
      method: 'POST',
      dataType: 'json',
      data: data,
    });
  }



  // function to get the users favourite songs
  function getFavouriteSonges(data) {
    formAppended=false;
    const songList = $('#song-list');
    songList.empty(); // Clear the current contents of the <ul> tag
    const element = document.getElementById("create-playlist");
    if (element) {
      element.parentNode.removeChild(element);
    }
    // Loop through the received data and add new <li> elements to the <ul> tag
    data.forEach(song => {
    
                      const liElement = `<li>
                          <img class="cover" src="${song.picture}">
                          <div class="song-details-container">
                          <h4>${song.title}</h4>
                          <p>${song.artistName}</p>
                          </div>
                          <a href="#" class="remove-favourite" data-song-id="${song.song_id}">X</a>
                          <button class="show-playlists" data-song-id="${song.song_id}">Show Playlists</button>
                          <ul class="playlist-list" style="display: none;"></ul> 
                      </li>`;
      songList.append(liElement);
    });
  }




  //function to remove the favourite songs from favourite list
  function removeFavourite(data) {
     formAppended=false;
    const songList = $('#song-list');
    songList.empty(); // Clear the current contents of the <ul> tag
    const element = document.getElementById("create-playlist");
    if (element) {
      element.parentNode.removeChild(element);
    }
    // Loop through the received data and add new <li> elements to the <ul> tag
    data.forEach(song => {
                      const liElement = `<li>
                      <img class="cover" src="${song.picture}">
                      <div class="song-details-container">
                      <h4>${song.title}</h4>
                      <p>${song.artistName}</p>
                      </div>
                      <a href="#" class="remove-favourite" data-song-id="${song.song_id}">X</a>
                      <button class="show-playlists" data-song-id="${song.song_id}">Show Playlists</button>
                      <ul class="playlist-list" style="display: none;"></ul> 
                  </li>`;
      songList.append(liElement);
    });
  }


  //function to get the playlists
  function getPlayList(data) {
    // Handle the response data here
    const requestedData = $('#requested-data');
    const songList = $('#song-list');
    songList.empty();

    // Append the form for creating a new playlist
    if (!formAppended) {
      const form = `<form action="/users/home/create-playlist" method="post" id="create-playlist">
                <input type="text" name="playlist-name" placeholder="Enter Playlist name">
                <input type="submit" value="Create Playlist">
              </form>`;
      requestedData.append(form);
      createPlaylist();
      formAppended = true;
    }
    if (data.length === 0) {
      // If the user doesn't have any playlists, display a message
      songList.append('<li>No playlists found.</li>');
    } else {
      // If the user has playlists, append the playlist names to the songList
      data.forEach(playlist => {
        const liElement = `<li><a class="playlist-link" data-playlist-id="${playlist._id}">${playlist.name}</a></li>`;
        songList.append(liElement);
      });
    }
  }

  async function createPlaylist() {
    // Add event listener to the form for creating a playlist
    $('#create-playlist').submit( async function (event) {
      event.preventDefault(); // Prevent the default form submission

      // Get the playlist name from the form input
      const playlistName = $('input[name="playlist-name"]').val();
       const url ='/users/home/create-playlist';
      // Make the AJAX POST request to create the playlist
      const data=await makePostAjaxCall(url, { name: playlistName });
   
        const songList = $('#song-list');
        const liElement = `<li><a class="playlist-link" data-playlist-id="${data._id}">${playlistName}</a></li>`;
        songList.append(liElement);
    
  })
}


async function showPlaylistSongs(response){
    const songList = $('#song-list');
    songList.empty(); // Clear the current contents of the <ul> tag
    if (response.length === 0) {
      songList.html('<li>No songs in this Playlist</li>');
    }
    // Loop through the received data and add new <li> elements to the <ul> tag
    response.forEach(song => {
      
                      const liElement = `<li>
                      <img class="cover" src="${song.picture}">
                      <div class="song-details-container">
                      <h4>${song.title}</h4>
                      <p>${song.artistName}</p>
                      </div>
                      <a href="#" class="favorite-link" data-song-id="${song.song_id}">O</a>
                      <button class="remove-song" data-song-id="${song.song_id}"  data-playlist-id="${song.user_playlist}">remove</button>
                  </li>`;
      songList.append(liElement);

    });
}


$(document).on('click', '.remove-song', async function (event) {
  event.preventDefault(); 
  const songId = $(this).data('song-id');
  const playlistId = $(this).data('playlist-id');
  console.log(playlistId);
  const url ="/users/home/remove-from-playlist"
  
 const response =await makePostAjaxCall(url,{songId,playlistId});
 console.log(response)
showPlaylistSongs(response);
})


//add a event listener to ---> PLAYLISTS NAME
  $(document).on('click', '.playlist-link', async function (event) {
    event.preventDefault(); // Prevent the default behavior of clicking a link

    // Get the playlist ID from the data attribute of the clicked link
    const playlistId = $(this).data('playlist-id');
    const url =`/users/home/get-playlist-songs`
    const response = await makePostAjaxCall(url,{playlistId});
    console.log(response);
    showPlaylistSongs(response);
  
  });


  $(document).on('click', '.add-to-playlist', async function (event) {
    event.preventDefault(); // Prevent the default behavior of clicking a link
  
    // Get the playlist ID and song id  
    const songId = $(this).closest('ul').siblings('.show-playlists').data('song-id');
    console.log(songId);
    const url = `/users/home/add-to-playlist`
     const playlistId =$(this).data('playlist-id');
     const data = { songId: songId, playlistId: playlistId };
    
     const response =await makePostAjaxCall(url,data);
    
  });



  //show playlist button under songs
  $(document).on('click', '.show-playlists', async function (event) {
    event.preventDefault(); // Prevent the default behavior of clicking a link

    // Get the song ID from the clicked button's data attribute
    const songId = $(this).data('song-id');
    const url = `/users/home/playlist`;

    try {
      const response = await makeGetAjaxCall(url);
       console.log('Playlists data:', response);

      const closestLi = $(this).closest('li');

  // Find the .playlist-list element within the closest li
  const playlistList = closestLi.find('.playlist-list');

      if (response.length === 0) {
        playlistList.html('<li>Create a Playlist first</li>');
      } else {
        const playlistNames = response.map(playlist => `<li><a href="#" class="add-to-playlist" data-playlist-id="${playlist._id}">${playlist.name}</a></li>`).join('');        playlistList.html(playlistNames);
      }

      // Toggle the display of the playlist list (show/hide)
      playlistList.toggle();
    } catch (error) {
      console.error('Error:', error);
    }
  });






  $('#playlist').click(async function (event) {
    event.preventDefault();
    const url = '/users/home/playlist';
    const response = await makeGetAjaxCall(url)
    getPlayList(response);

  })






  // remove from favourites button  is clicked 
  $(document).on('click', '.remove-favourite', async function (event) {
    event.preventDefault();
    const url = '/users/home/favorites/remove'
    // Get the song ID from the clicked anchor tag
    const songId = $(this).data('song-id');
    const response = await makePostAjaxCall(url, { songId });
    removeFavourite(response);
  })



  $('#favorite-songs').click(async function (event) {
    event.preventDefault();
    const url = '/users/home/favorites/song-list'
    const response = await makeGetAjaxCall(url);
    await getFavouriteSonges(response);

  })

  $('.favorite-link').click(async function (event) {
    event.preventDefault(); // Prevent the default behavior of clicking a link

    const songId = $(this).data('song-id');// Get the songId from the data attribute of the clicked anchor tag
    const url = '/users/home/favorites/song'
    const response = await makePostAjaxCall(url, { songId });
    console.log(response);
  })





})