  //--------------------------------------------------------------------------
  // SONG FUNCTIONS
  //---------------------------------------------------------------------------

  APIKey = "ZTM0M2ZjNDAtY2Y1Ny00MjQ1LWIxYmEtMzAwY2FlNDU2ZGNj";

  var playlists = {
    energetic: "pp.243995364",
    tired: "pp.201748658",
    happy: "pp.181321249",
    calm: "pp.191473986",
    hyper: "pp.283875163",
    sad: "pp.162612012"
  };

  function loadPlaylist() {
    var moodLowercase = finalMood.toLocaleLowerCase();
    let finalPlaylist = playlists[moodLowercase];
    singlePlaylist(finalPlaylist);
  }

  function singlePlaylist(moodLowercase) {
    var queryURL = `http://api.napster.com/v2.2/playlists/${moodLowercase}/tracks?apikey=YTkxZTRhNzAtODdlNy00ZjMzLTg0MWItOTc0NmZmNjU4Yzk4&limit=10`;

    $.ajax({
      url: queryURL,

      method: "GET"
    }).then(function(response) {
      player.tracks = response.tracks;
      console.log(response.tracks);
      player.init();
      player.play();
    });
  }

  let player = {
    htmlPlayer:null,
    tracks: [], 
    currentIndex: Math.floor(Math.random() * 10),


play() {
    let songTitle = this.tracks[this.currentIndex].name;
    let artist = this.tracks[this.currentIndex].artistName;
    console.log(songTitle);
    console.log(artist);

    let songHtml = `<p class="song-title">${songTitle}</p>`;
    songHtml += `<p class="artist-name">${artist}</p>`;

    $("#current-song").html(songHtml);

    
    
    // htmlPlayer.load();
   this.htmlPlayer.play();
  },
  next() {
      this.htmlPlayer.pause()
      this.currentIndex++;
    if (typeof this.tracks[this.currentIndex] === "undefined") {
      this.currentIndex = 0;
    }
    document.getElementById("currentTrackSource").src = this.tracks[this.currentIndex].previewURL;
    console.log(this.tracks[this.currentIndex].previewURL)
    this.htmlPlayer.load();
    this.play();
  },
  previous() {
      this.htmlPlayer.pause()
      if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.tracks.length - 1;
    }
    document.getElementById("currentTrackSource").src = this.tracks[this.currentIndex].previewURL;
    this.htmlPlayer.load();
    this.play();
  },

  init() {
    $("#song-content").append('<audio id="player" controls></audio>');
    this.htmlPlayer = document.getElementById("player");
    $("#player").append(
      `<source id="currentTrackSource" src="${
        this.tracks[this.currentIndex].previewURL
      }">`
    );
    $("#song-content").append('<div id="current-song"></div>');

    document
      .getElementById("next-button")
      .addEventListener("click", function() {
        player.next();
      });
    document
      .getElementById("previous-button")
      .addEventListener("click", function() {
        player.previous();
      });
  }
};
