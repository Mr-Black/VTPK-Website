var MONTH_NAMES = ['January', 'February', 'March', 'April', 'May',
                   'June', 'July', 'August', 'September', 'October',
                   'November', 'December'];

function useGoogleApi() {
  gapi.client.load('calendar', 'v3', function() {
    requestCalendarEvents();
  });
}

function requestCalendarEvents() {
  var request = gapi.client.calendar.events.list({
    calendarId: config.calendarId,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 10
  });

  request.execute(function(response) {
    $('#events-loading').remove();

    var events = response.items; 
    var eventsLength = events.length;
    var eventsList = $("#events-list");
    for(var i = events.length - 1; i >= 0; i--) {
      eventsList.append(createCalendarElement(events[i]));
    }

    $('#events-list li:gt(2)').hide();
    $('#showMoreEvents').click(function(e) {
      $('#events-list li:gt(2)').slideToggle('slow', function() {
        if($(this).is(':visible')) {
          $('#showMoreEvents').text('Show Less');
        } else {
          $('#showMoreEvents').text('Show More');
        }
      });
      return false;
    });
  });
}

function createCalendarElement(calEventObject) {
  var start = new Date(Date.parse(calEventObject.start.dateTime));
  var end = new Date(Date.parse(calEventObject.end.dateTime));

  var calLi = $('<li></li>');

  // Set up calendar header.
  var calHeader = $('<h3></h3>');
  var calLink = $('<a></a>', {
    href: calEventObject.htmlLink,
    target: 'blank_'
  });
  calLink.append(calEventObject.summary);
  calHeader.append(calLink);
  calLi.append(calHeader);

  // Get parts of date.
  var calMonth = $('<span></span>', { class: 'month' })
  calMonth.text(MONTH_NAMES[start.getMonth()]);
  var calDay = $('<span></span>', { class: 'day' })
  calDay.text(start.getDate() + ' ');
  var calYear = $('<span></span>', { class: 'year' })
  calYear.text(start.getFullYear());

  // Add date to list element.
  var calDate = $('<p></p>', { class: 'date' });
  calDate.append(calDay);
  calDate.append(calMonth);
  calLi.append(calDate);

  // Entry content div for styling
  var entryContent = $('<div></div>', { class: 'entry-content' });

  // Add location
  var location = $('<p></p>');
  var locationText = $('<span></span>', { class: 'cal-heading' })
  locationText.text('Where: ');
  location.append(locationText);
  location.append(calEventObject.location);
  entryContent.append(location);

  // Add start time for event
  var startTime = $('<p></p>');
  var startTimeText = $('<span></span>', { class: 'cal-heading' });
  startTimeText.text('Start Time: ');
  startTime.append(startTimeText);
  startTime.append(twelveHourFormat(start));
  entryContent.append(startTime);

  // Add calendar description.
  if(calEventObject.description) {
    var calDescription = $('<p></p>');
    calDescription.append(replaceLinksInText(calEventObject.description));
    entryContent.append(calDescription);
    calLi.append(entryContent);
  }

  // Add calendar separator
  var calSeparator = $('<hr></hr>');
  calLi.append(calSeparator);

  return calLi;
}

function twelveHourFormat(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? '0' +  minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}