const { app } = require('@azure/functions');
const ical = require('ical-generator');
const fetchSchedule = require('../lib/FetchSchedule.js');

app.http('FetchCal', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

		// Chargers U16s Joaquin
		let scheduleUrl = 'https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-winter-2023/teams/carnegie-chargers-u16-boys-joaquin/9cbd6eaf';

		// Bears U14 Waters
		scheduleUrl = 'https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2023/teams/caulfield-bears-u14-boys-waters/c383bd05';

		// McKinnon Cougars U16.4
		scheduleUrl = 'https://www.playhq.com/basketball-victoria/org/mckinnon-cougars-basketball-club/5f84fbd9/victorian-junior-basketball-league-2023/teams/mckinnon-u16-boys-4/ae7ea468';

		// Chargers U18 Joaquin
		scheduleUrl = 'https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-summer-202324/teams/carnegie-chargers-u18-boys-joaquin/e025f609';

		if (request.query.get('url'))
		{
			scheduleUrl = request.query.get('url');
		}

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
