const { app } = require('@azure/functions');
const ical = require('ical-generator');
const fetchSchedule = require('../lib/FetchSchedule.js');

app.http('FetchCal', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

		let scheduleUrl = 'https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-winter-2023/teams/carnegie-chargers-u16-boys-joaquin/9cbd6eaf';


		if (request.query.get('url'))
		{
			scheduleUrl = request.query.get('url');
		}

        context.log(`Getting schedule for "${scheduleUrl}"`);

		let calendar = await fetchSchedule(context, scheduleUrl);
		return { body: calendar.toString() };

		/*
        const name = request.query.get('name') || await request.text() || 'world';

        return { body: `Hello, ${name}!` };
		*/
    }
});
