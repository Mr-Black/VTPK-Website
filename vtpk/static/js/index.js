$(function() {
  var twLoading = true;

  // Get twitter feed
  $.getJSON(SCRIPT_ROOT + '/tw/feed', {}, function(result) {
    $('#tw-feed-loading').remove();
    
    var twFeed = $('#tw-feed');
    var resultLength = result.length;
    for(var i = 0; i < resultLength; i++) {
      twFeed.append(createTwElement(result[i]));
    }
    $('#tw-feed li:gt(3)').hide();
    $('#showMoreTweets').click(function(e){
      $('#tw-feed li:gt(3)').slideToggle('slow', function() {
        if($(this).is(':visible')) {
          $('#showMoreTweets').text('Show Less');
        } else {
          $('#showMoreTweets').text('Show More');
        }
      });
      return false;
    });
  });

  // Get facebook wall
  $.getJSON(SCRIPT_ROOT + '/fb/group/wall', {}, function(result){
    $('#fb-wall-loading').remove();

    var fbWall = $('#fb-wall');
    var resultDataLength = result.data.length;
    var resultData = result.data;
    for(var i = 0; i < resultDataLength; i++) {
      fbWall.append(createFbElement(resultData[i]));
    }
    $('#fb-wall li:gt(2)').hide();
    $('#showMoreWall').click(function(e) {
      $('#fb-wall li:gt(2)').slideToggle('slow', function() {
        if($(this).is(':visible')) {
          $('#showMoreWall').text('Show Less');
        } else {
          $('#showMoreWall').text('Show More');
        }
      });
      return false;
    });
  });

  var fbWallLoading = $('#fb-wall-loading');
  fbWallLoading.append('<h3>Loading...</h3>');

  var twFeedLoading = $('#tw-feed-loading');
  twFeedLoading.append('<h3>Loading...</h3>');

  var eventsLoading = $('#events-loading');
  eventsLoading.append('<h3>Loading...</h3>');
});

function createTwElement(twObject) {
  var createdAt = new Date(Date.parse(twObject.created_at));
  var twLi = $('<li></li>');

  var twUserImage = $('<img>', { src: twObject.user.profile_image_url_https });
  twLi.append(twUserImage);

  var twCreatedAt = $('<p></p>')
  var twTime = $('<time></time>')
  twTime.attr('datetime', createdAt.toISOString())
        .text(createdAt.toUTCString());
  twCreatedAt.append(twTime);
  twLi.append(twCreatedAt);

  var twArticle = $('<article></article>');
  var twContent = $('<p></p>');
  twContent.append(replaceLinksInText(twObject.text));
  twArticle.append(twCreatedAt);
  twArticle.append(twContent);
  twLi.append(twArticle);

  return twLi;
}

function createFbElement(fbObject) {
  //console.log(fbObject);
  var fbLi = $('<li></li>', { class: 'fb-post' });

  var fbPostTitle = $('<h3></h3>', { class: 'fb-post-title' });
  var fbPoster = $('<span></span>', { class: 'fb-poster' });
  fbPoster.text(fbObject.from.name);
  fbPostTitle.append(fbPoster);
  if(fbObject.name) {
    var fbPostName = $('<span></span>', { class: 'fb-post-name' });
    fbPostName.append(': ' + fbObject.name);
    fbPostTitle.append(fbPostName);
  }
  fbLi.append(fbPostTitle);

  var fbContent = $('<p></p>', { class: 'fb-post-content' }); 
  fbContent.append(replaceLinksInText(fbObject.message)); 
  //console.log(fbObject);
  if(fbObject.link) {
    if(fbObject.message.indexOf(fbObject.link) == -1) {
      var fbLink = $('<a></a>', {
        href: fbObject.link,
        target: '_blank'
      });
      fbLink.text(' ' + fbObject.link)
      fbContent.append(fbLink);
    }
  }
  fbLi.append(fbContent);

/*  var fbDivider = $('<hr></hr>');
  fbLi.append(fbDivider);*/

  return fbLi;
}