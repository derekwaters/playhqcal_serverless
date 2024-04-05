const { app } = require('@azure/functions');
const ical = require('ical-generator');
const fetchSchedule = require('../lib/FetchSchedule.js');

app.http('FetchCal', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
		context.log(`Http function processing starting`);
		let teamParam = request.query.get('team');
		teamParam = (teamParam == null) ? 'angus_u16' : teamParam;
		let debugHtml = request.query.get('debugHtml');
		debugHtml = (debugHtml != null);

        context.log(`Retrieving team "${teamParam}"`);

		let scheduleUrlMap = {
			"angus_u16" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-summer-202324/teams/carnegie-chargers-u16-boys-joaquin-gold/26a5bdab",
			"angus_u18" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-summer-202324/teams/carnegie-chargers-u18-boys-joaquin/e025f609",
 			"angus_rep"  : "https://www.playhq.com/basketball-victoria/org/mckinnon-cougars-basketball-club/5f84fbd9/victorian-junior-basketball-league-2024/teams/mckinnon-u16-boys-1/3bcae747",
			"angus_tour" : "https://www.playhq.com/basketball-victoria/org/southern-peninsula-tournament/iathletic-southern-peninsula-tournament-2023/teams/mckinnon-u16-boys-1/0f42d65c",
			"jacko_u16" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-summer-202324/teams/carnegie-chargers-u16-boys-owen/e829b923",
			"bears_u15" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u15-boys-bridges/3a3aee69"
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

		let calendar = await fetchSchedule(context, scheduleUrl, debugHtml);
		calendar.name =
        context.log(`Are we done?`);
		return {
			headers: {
				'Content-Type': 'text/calendar',
				'Content-Disposition': 'inline'
			},
			body: calendar.toString()
		};

		/*
        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
		*/
    }
});
