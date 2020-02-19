// function buildQueryURL() {




// var queryURL = "http://api.napster.com/v2.2/genres/g.115/stations?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4"

//  APIKey = "ZTM0M2ZjNDAtY2Y1Ny00MjQ1LWIxYmEtMzAwY2FlNDU2ZGNj"


// queryParams.q = $("#search-term")

// }

var playlists= {
    energetic: "pp.243995364",
    sleepy: "pp.201748658",
    happy: "pp.181321249",
    calm:"pp.191473986",
    hyper: "pp.283875163",
    sad: "pp.162612012",
};




function getMoodPlaylist(tagId){

   //  returns all playlist by mood(chill)
   // http://api.napster.com/v2.2/tags/tag.152196523/playlists?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4



//  returns a playlist by playlist ID(eletronic Chill playlist)
    // http://api.napster.com/v2.2/playlists/pp.237239631/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=5


    $.ajax({
        url:`http://api.napster.com/v2.2/tags/${tagId}/playlists?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4`,
        
        method:"GET"
    })
    .then(function(response) {
        console.log(response)

        var playlistId = response.playlists[7].id;
        console.log(playlistId)

        singlePlaylist(playlistId)

    })

}
// getMoodPlaylist("tag.152196437")

function singlePlaylist(playlistId) {

    var queryURL = `http://api.napster.com/v2.2/playlists/${playlistId}/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`

    $.ajax({
        url: queryURL,
        
        method:"GET"
    })
    .then(function(response) {
        console.log(response)

        

    })

   

   
}
singlePlaylist(playlists["sleepy"])
console.log(singlePlaylist)


   $("audio").attr("src", "https://listen.hs.llnwd.net/g3/2/6/2/5/2/1329325262.mp3");
   
//    <source src="https://api.napster.com/v2.2/tracks/tra.257425041" type="audio/mpeg">
//   Your browser does not support the audio tag.


