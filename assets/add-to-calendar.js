var MS_IN_MINUTES = 60 * 1000

var CONFIG = {
  selector  : ".add-to-calendar",
  duration  : 60,
  texts : {
    label     : "Add to Calendar",
    title     : "New event",
    download  : "Calendar-event.ics",
    google    : "Google Calendar",
    yahoo     : "Yahoo! Calendar",
    off365    : "Office 365",
    ical      : "Apple iCal",
    outlook   : "Download Outlook",
    ienoblob  : "Sorry, your browser does not support downloading Calendar events."
  }
}

/* --------------
  browser sniffing
--------------- */

// ie < edg (=chromium) doesnt support data-uri:text/calendar
var ieCanDownload = typeof window !== 'undefined' ? ('msSaveOrOpenBlob' in window.navigator) : false
var ieMustDownload = typeof window !== 'undefined' ? /\b(MSIE |Trident.*?rv:|Edge\/)(\d+)/.exec(navigator.userAgent) : false


/* --------------
  generators
--------------- */

var calendarGenerators = {

  google: function(event) {
    var startTime,endTime

    if (event.allday) {
      // google wants 2 consecutive days at 00:00
      startTime = formatTime(event.tzstart)
      endTime = formatTime(getEndDate(event.tzstart,60*24))
      startTime = stripISOTime(startTime)
      endTime = stripISOTime(endTime)
    } else {
      if (event.timezone) {
        // google is somehow weird with timezones.
        // it works better when giving the local
        // time in the given timezone without the zulu,
        // and pass timezone as argument.
        // but then the dates we have loaded
        // need to shift inverse with tzoffset the
        // browser gave us.
        // so
        var shiftstart, shiftend
        shiftstart = new Date(event.start.getTime()-event.start.getTimezoneOffset()*MS_IN_MINUTES)
        if (event.end) {
          shiftend = new Date(event.end.getTime()-event.end.getTimezoneOffset()*MS_IN_MINUTES)
        }
        startTime = formatTime(shiftstart)
        endTime = formatTime(shiftend)
        // strip the zulu and pass the tz as argument later
        startTime = startTime.substring(0,startTime.length-1)
        endTime = endTime.substring(0,endTime.length-1)
      } else {
        // use regular times
        startTime = formatTime(event.start)
        endTime = formatTime(event.end)
      }
    }

    var href = [
      'https://www.google.com/calendar/render',
      '?action=TEMPLATE',
      '&text=' + encodeURIComponent(event.title || ''),
      '&dates=' + encodeURI(startTime || ''),
      '/' + encodeURI(endTime || ''),
      (event.timezone)?'&ctz='+encodeURI(event.timezone):'',
      '&details=' + encodeURIComponent(event.description || ''),
      '&location=' + encodeURIComponent(event.address || ''),
      '&sprop=&sprop=name:'
    ].join('')


    return '<a class="icon-google" target="_blank" href="' +
      href + '">'+CONFIG.texts.google+'</a>'
  },

  yahoo: function(event) {


    if (event.allday) {
      var yahooEventDuration = 'allday'
    } else {

      var eventDuration = event.tzend ?
      ((event.tzend.getTime() - event.tzstart.getTime())/ MS_IN_MINUTES) :
      event.duration

      // Yahoo dates are crazy, we need to convert the duration from minutes to hh:mm


      var yahooHourDuration = eventDuration < 600 ?
        '0' + Math.floor((eventDuration / 60)) :
        Math.floor((eventDuration / 60)) + ''

      var yahooMinuteDuration = eventDuration % 60 < 10 ?
        '0' + eventDuration % 60 :
        eventDuration % 60 + ''

      var yahooEventDuration = yahooHourDuration + yahooMinuteDuration
    }

    // Remove timezone from event time
    // var st = formatTime(new Date(event.start - (event.start.getTimezoneOffset() * MS_IN_MINUTES))) || ''

    var st = formatTime(event.tzstart) || ''

    var href = encodeURI([
      'http://calendar.yahoo.com/?v=60&view=d&type=20',
      '&title=' + (event.title || ''),
      '&st=' + st,
      '&dur=' + (yahooEventDuration || ''),
      '&desc=' + (event.description || ''),
      '&in_loc=' + (event.address || '')
    ].join(''))

    return '<a class="icon-yahoo" target="_blank" href="' +
      href + '">'+CONFIG.texts.yahoo+'</a>'
  },

  off365: function(event) {
    var startTime = formatTime(event.tzstart)
    var endTime = formatTime(event.tzend)

    var href = encodeURI([
      'https://outlook.office365.com/owa/',
      '?path=/calendar/action/compose',
      '&rru=addevent',
      '&subject=' + (event.title || ''),
      '&startdt=' + (startTime || ''),
      '&enddt=' + (endTime || ''),
      '&body=' + (event.description || ''),
      '&location=' + (event.address || ''),
      '&allday=' + (event.allday)?'true':'false'
    ].join(''))
    return '<a class="icon-off365" target="_blank" href="' +
      href + '">'+CONFIG.texts.off365+'</a>'
  },

  ics: function(event, eClass, calendarName) {
    var startTime,endTime

    if (event.allday) {
      // DTSTART and DTEND need to be equal and 0
      startTime = formatTime(event.tzstart)
      endTime = startTime = stripISOTime(startTime)+'T000000'
    } else {
      startTime = formatTime(event.tzstart)
      endTime = formatTime(event.tzend)
    }

    var cal = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'BEGIN:VEVENT',
        'URL:' + document.URL,
        'DTSTART:' + (startTime || ''),
        'DTEND:' + (endTime || ''),
        'SUMMARY:' + (event.title || ''),
        'DESCRIPTION:' + (event.description || ''),
        'LOCATION:' + (event.address || ''),
        'UID:' + (event.id || '') + '-' + document.URL,
        'END:VEVENT',
        'END:VCALENDAR'].join('\n')

    if (ieMustDownload) {
      return '<a class="' + eClass + '" onclick="ieDownloadCalendar(\'' +
        escapeJSValue(cal) + '\')">' + calendarName + '</a>'
    }

    var href = encodeURI('data:text/calendar;charset=utf8,' + cal)

    return '<a class="' + eClass + '" download="'+CONFIG.texts.download+'" href="' +
      href + '">' + calendarName + '</a>'


  },

  ical: function(event) {
    return this.ics(event, 'icon-ical', CONFIG.texts.ical)
  },

  outlook: function(event) {
    return this.ics(event, 'icon-outlook', CONFIG.texts.outlook)
  }
}

/* --------------
   helpers
--------------- */

var changeTimezone = function(date,timezone) {
  if (date) {
    if (timezone) {
      var invdate = new Date(date.toLocaleString('en-US', {
        timeZone: timezone
      }))
      var diff = date.getTime()-invdate.getTime()
      return new Date(date.getTime()+diff)
    }
    return date
  }
  return
}

var formatTime = function(date) {
  return date?date.toISOString().replace(/-|:|\.\d+/g, ''):''
}

var getEndDate = function(start,duration) {
  return new Date(start.getTime() + duration * MS_IN_MINUTES)
}

var stripISOTime = function(isodatestr) {
  return isodatestr.substr(0,isodatestr.indexOf('T'))
}

var escapeJSValue = function(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/\'/g, '\\\'')
    .replace(/(\r?\n|\r)/gm, '\\n')
}

/* --------------
   output handling
--------------- */

var generateCalendars = function(event) {
  return {
    google: calendarGenerators.google(event),
    yahoo: calendarGenerators.yahoo(event),
    off365: calendarGenerators.off365(event),
    ical: calendarGenerators.ical(event),
    outlook: calendarGenerators.outlook(event)
  }
}

/* --------------
   input handling
--------------- */

var sanitizeParams = function(params) {
  if (!params.options) {
    params.options = {}
  }
  if (!params.options.id) {
    params.options.id = Math.floor(Math.random() * 1000000)
  }
  if (!params.options.class) {
    params.options.class = ''
  }
  if (!params.data) {
    params.data = {}
  }
  if (!params.data.start) {
    params.data.start=new Date()
  }
  if (params.data.allday) {
    delete params.data.end // may be set later
    delete params.data.duration
  }
  if (params.data.end) {
    delete params.data.duration
  } else {
    if (!params.data.duration) {
      params.data.duration = CONFIG.duration
    }
  }
  if (params.data.duration) {
    params.data.end = getEndDate(params.data.start,params.data.duration)
  }

  if (params.data.timezone) {
    params.data.tzstart = changeTimezone(params.data.start,params.data.timezone)
    params.data.tzend = changeTimezone(params.data.end,params.data.timezone)
  } else {
    params.data.tzstart = params.data.start
    params.data.tzend = params.data.end
  }
  if (!params.data.title) {
    params.data.title = CONFIG.texts.title
  }
}

var validParams = function(params) {
  return params.data !== undefined && params.data.start !== undefined &&
    (params.data.end !== undefined || params.data.allday !== undefined)
}

/* --------------
   exports
--------------- */

if (typeof window !== 'undefined') {
  window.ieDownloadCalendar = function(cal) {
    if (ieCanDownload) {
      var blob = new Blob([cal], { type: 'text/calendar' })
      window.navigator.msSaveOrOpenBlob(blob, CONFIG.texts.download)
    } else {
      alert(CONFIG.texts.ienoblob)
    }
  }
}

exports.addToCalendarData = function(params) {
  if (!params) params = {}
  sanitizeParams(params)
  if (!validParams(params)) {
    console.error('Event details missing.')
    return
  }
  return generateCalendars(params.data)
}
