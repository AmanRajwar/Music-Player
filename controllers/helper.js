var options = {
    method: 'GET',
    headers: {
       'X-RapidAPI-Key': '10c47ccc02mshe0fd12625dd1950p1927eejsn6bf33a06d825',
       'X-RapidAPI-Host': 'deezerdevs-deezer.p.rapidapi.com'
    }
 };
async function search(song){
    const url = 'https://deezerdevs-deezer.p.rapidapi.com/search?q='+ song; //track/139470659' search?q=shape%20of%20you'
    // const track = `https://deezerdevs-deezer.p.rapidapi.com/track/${id}`;
     try {
        const response = await fetch(url, options);
        const result = await response.json();
        // result.forEach(element => {
        //     const tracksResponse =await fetch(`https://deezerdevs-deezer.p.rapidapi.com/track/${element.id}`,options);
        //     var tracks = await tracksResponse.json();
        // });
        // console.log(result)
        return result;
     } catch (err) {
       return {error: err};
     }
}

async function getArtist(id){
    const url =`https://deezerdevs-deezer.p.rapidapi.com/track/${id}`;

    try {
        const response = await fetch(url, options);
        const result = await response.json();
        // result.forEach(element => {
        //     const tracksResponse =await fetch(`https://deezerdevs-deezer.p.rapidapi.com/track/${element.id}`,options);
        //     var tracks = await tracksResponse.json();
        // });
        // console.log(result)
        return result;
    } catch (error) {
        return {error: err};
    }
}

module.exports ={search, getArtist};