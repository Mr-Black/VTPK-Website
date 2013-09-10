// Code goes here
$(function() {
  var loading = $('#videos-loading')
  loading.append($('<h3>Loading...</h3>'));
});

function useGoogleApi() {
  gapi.client.load('youtube', 'v3', function() {
    requestUserUploadsPlaylistId();
  });
}

function requestUserUploadsPlaylistId() {
  var request = gapi.client.youtube.channels.list({
    part: 'contentDetails',
    id: config.userId
  });
  
  request.execute(function(response){
    var playlistId = response.result.items[0].contentDetails.relatedPlaylists.uploads;
    requestVideoPlaylist(playlistId);
  });
  
  function requestVideoPlaylist(playlistId) {
    var requestOptions = {
      playlistId: playlistId,
      part: 'snippet',
      maxResults: 9
    };
    
    var request = gapi.client.youtube.playlistItems.list(requestOptions);
    request.execute(function(response) {
      var ids = []
      for(var i = 0; i < response.items.length; i++) {
        var item = response.items[i];
        ids.push(item.snippet.resourceId.videoId);
      }
      
      requestVideos(ids);
    });
  }
  
  function requestVideos(videoIds) {
    var requestOptions = {
      part: 'player',
      id: videoIds.toString(),
      maxResults: 9
    }
    
    var request = gapi.client.youtube.videos.list(requestOptions);
    request.execute(function(response) {
      $('#videos-loading').remove();

      var videoList = $('#videos');
      
      for(var i = 0; i < response.items.length; i++) {
        var embedHtml = response.items[i].player.embedHtml;
        var vid = $(embedHtml);
        var newVid = $('<li></li>');
        newVid.append(vid);
        videoList.append(newVid);
      }
    });
  }
}