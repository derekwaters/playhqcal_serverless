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
			"angus_u18": "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/vofs-junior-domestic-u8-u20-summer-202425/teams/carnegie-chargers-u18-boys-greg-gold/ff08dd3a",
			"angus_rep": "https://www.playhq.com/basketball-victoria/org/mckinnon-cougars-basketball-club/5f84fbd9/victorian-junior-basketball-league-2025/teams/mckinnon-u18-boys-1/c5d5e1ff",
			"angus_u20": "https://www.playhq.com/basketball-victoria/org/mckinnon-cougars-basketball-club/5f84fbd9/victorian-junior-basketball-league-2025/teams/mckinnon-u20-boys-1-vjl/859fbca2",
			//"angus_u16" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/vofs-junior-domestic-u8-u20-winter-2024/teams/carnegie-chargers-u16-boys-joaquin-gold/80a05482",
			//"angus_u18" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/vofs-junior-domestic-u8-u20-winter-2024/teams/carnegie-chargers-u18-boys-joaquin/e6fd2ac8",
 			//"angus_rep"  : "https://www.playhq.com/basketball-victoria/org/mckinnon-cougars-basketball-club/5f84fbd9/victorian-junior-basketball-league-2024/teams/mckinnon-u16-boys-1/3bcae747",
			//"angus_tour" : "https://www.playhq.com/basketball-victoria/org/southern-peninsula-tournament/iathletic-southern-peninsula-tournament-2023/teams/mckinnon-u16-boys-1/0f42d65c",
			//"jacko_u16" : "https://www.playhq.com/basketball-victoria/org/carnegie-basketball-club/e064387a/junior-domestic-u8-u20-summer-202324/teams/carnegie-chargers-u16-boys-owen/e829b923",
			//"bears_u15" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u15-boys-bridges/3a3aee69",

			//"bears_u8m" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u8-mixed-rayner/c43ecc99",
			//"bears_u9m" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u9-mixed-dunbar/342afe09",
			//"bears_u11g" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-st-pauls-doggies-u11-girls-clohesy/d847f913",
			//"bears_u11m" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u11-mixed-ratner/0b9dd9e1",
			//"bears_u13m_fryar" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u13-mixed-fryar/4878f6f1",
			//"bears_u13m_colwell" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u13-mixed-colwell/35347692",
			//"bears_u14m" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u14-mixed-acklom/7c0081d1",
			//"bears_u15m_chrystie" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u15-boys-chrystie/8b24e6e1",
			//"bears_u16b_segar" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-kangaroos-u16-boys-segar-bernier/6da648b7",
			//"bears_u16b_wigney" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-kangaroos-u16-boys-wigney/84c089ee",
			//"bears_u17b" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u18-boys-rowlands/a9d2a6b9",
			//"bears_u18g" : "https://www.playhq.com/afl/org/caulfield-bears-junior-football-club-smjfl/4a2b554a/south-metro-junior-football-league-smjfl-2024/teams/caulfield-bears-u18-girls-marin/da865616"
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
