
const cheerio = require('cheerio');
const axios = require('axios');
const ical = require('ical-generator');
const moment = require('moment-timezone');


const titleClass = ".hbZeKu";
//const matchClass = "li[data-testid='games-on-date']";
const matchClass = ".gehImT";
// const dateClass = ".bVBHJp";
const dateClass = ".emDkPM";
// const timeClass = "svg[name='clock'] + div";
const timeClass = ".dTddCR";
// const timeClass = "svg[name*='calendar'] + div";
// const homeTeamClass = "img[data-testid*='home-logo'] + span";
// const homeTeamClass = ".cdnZHA + div:nth-child(1)"
const homeTeamClass = ".eYUIma"
// const awayTeamClass = "img[data-testid*='away-logo'] + span";
// const awayTeamClass = ".cdnZHA + div:nth-child(3)"
const awayTeamClass = ".xsZMh"
// const venueClass = "a[data-testid*='court']";
const teamClass = ".iXloFG";
const venueClass = ".gIKUwU";
// const linkClass = "a[data-testid*='fixture']";
const linkClass = ".gdEmqr";
const baseUrl = 'https://www.playhq.com/';

const calendar = ical({name: 'Some Title I Need To Get From The Page'});

const parseHtml = function(context, html, debugHtml) {
    const $ = cheerio.load(html);
    context.log('We got it!');

    if (debugHtml) {
      context.log(html);
    }

    var calendarTitle = $(titleClass).text();
    var calendar = ical({name: calendarTitle});

    /*
    var tmpDate = new Date();
    var tzOffset = -tmpDate.getTimezoneOffset();
    var stringTz;
    if (tzOffset < 0) {
      stringTz = " -" + (String((-tzOffset) / 60)).padStart(2, '0') + (String((-tzOffset) % 60)).padStart(2, '0');
    } else {
      stringTz = " +" + (String(tzOffset / 60)).padStart(2, '0') + (String(tzOffset % 60)).padStart(2, '0');
    }
    */

    $(matchClass).each(function() {
      context.log('Found an event!');
      var timeString = $(this).find(timeClass).text();
      var timeBits = timeString.split(',');

      context.log('TimeString: ' + timeString);

      var dateTime = $(this).find(dateClass).text() + ' ' +
        timeBits[0];

      // dateTime = dateTime + stringTz;
      context.log('Got DateTime: ' + dateTime);
      // var startDate = moment(dateTime, "dddd, D MMMM YYYY hh:mm A ZZ");
      var startDate = moment.tz(dateTime, "dddd, D MMMM YYYY hh:mm A", "Australia/Melbourne");

      // Check moment date!
      context.log(' Parsed to: ' + startDate.format());

      // if (moment().isBefore(startDate))
      {
        var endDate = startDate;
        endDate.add(1, 'h');
        //context.log(startDate);
        //context.log(endDate);

        var homeTeam = $(this).find(homeTeamClass).text();
        var awayTeam = $(this).find(awayTeamClass).text();

        var teams = $(this).find(teamClass);
        if (teams.length === 2)
        {
          homeTeam = $(teams[0]).text();
          awayTeam = $(teams[1]).text();
        }

        if (homeTeam === null || homeTeam.length === 0 || awayTeam === null || awayTeam.length === 0)
        {
          context.log('Event does not have teams defined - skipping...');
        }
        else
        {
          var venue = $(this).find(venueClass).text();
          var url = $(this).find(linkClass).attr('href');
          //context.log(homeTeam + ' vs ' + awayTeam + '   ====> AT ' + venue + '   ====> LINK: ' + url);

          calendar.createEvent({
              start: startDate,
              end: endDate,
              summary: homeTeam + ' vs ' + awayTeam,
              description: homeTeam + ' vs ' + awayTeam,
              location: venue,
              url: baseUrl + url
          });
        }
      }
    });

    return calendar;

}

const fetchSchedule = function(context, url) {
  context.log('About to fetch schedule');
  return axios({
    method: 'GET',
    url: url,
    headers: {
      'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36'
    }
  })
  .then(function(response) {
    context.log('Got response - now parsing');
    return parseHtml(context, response.data);
  })
  .catch((error) => {context.log('An error occurred: ' + error); return null;} );
};


module.exports = fetchSchedule;