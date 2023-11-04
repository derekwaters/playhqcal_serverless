const { app } = require('@azure/functions');
const ical = require('ical-generator');
const fetchSchedule = require('../lib/FetchSchedule.js');

app.http('FetchCal', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
		context.log('Http function processing starting');
		let teamParam = request.query.get('team');
		if (teamParam === undefined)
		{
			teamParam = 'gus_u16s';
		}
        context.log('Retrieving team "${teamParam}"');

		let scheduleUrlMap = {
			"gus_u16s" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-summer-202324/teams/carnegie-chargers-u16-boys-joaquin-gold/26a5bdab",
			"gus_u18s" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-summer-202324/teams/carnegie-chargers-u18-boys-joaquin/e025f609",
// 			"gus_rep"  : "",
			"gus_tour" : "https://www.playhq.com/basketball-victoria/org/southern-peninsula-tournament/iathletic-southern-peninsula-tournament-2023/teams/mckinnon-u16-boys-1/0f42d65c"
		}

		if (scheduleUrlMap[teamParam] === undefined)
		{
			return {
				status: 404,
				body: "couldn't find that schedule"
			};
		}
		var scheduleUrl = scheduleUrlMap[teamParam];

        context.log(`Getting schedule for "${scheduleUrl}"`);

		let calendar = await fetchSchedule(context, scheduleUrl);
        context.log(`Are we done?`);
		return { body: calendar.toString() };

		/*
        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
		*/
    }
});
