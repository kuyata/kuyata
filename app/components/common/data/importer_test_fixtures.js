let ImporterFixtures = {
		metaDated1: {
			"name": "source dated 1",
			"guid": "100",
			"checksum": "",
			"status": "enabled",
			"url": "http://www.sd1.com",
			"last_feed_date": 1430847160000
		},
		metaDated1Stored: {
			"id": 1,
			"name": "source dated 1",
			"guid": "100",
			"checksum": "",
			"status": "enabled",
			"url": "http://www.sd1.com",
			"last_feed_date": 1430847160000
		},
		metaDated1Updated: {
			"name": "source dated 1",
			"guid": "100",
			"checksum": "",
			"status": "enabled",
			"url": "http://www.sd1.com",
			"last_feed_date": 1430847160001
		},
		metaDated2: {
			"name": "source dated 2",
			"guid": "101",
			"checksum": "",
			"status": "enabled",
			"url": "http://www.sd2.com",
			"last_feed_date": 1430847160000
		},
		metaUndated1: {
			"name": "source undated 1",
			"guid": "102",
			"checksum": "",
			"status": "enabled",
			"url": "http://www.su1.com",
			"last_feed_date": null
		},
		metaUndated1Stored: {
			"id": 1,
			"name": "source undated 1",
			"guid": "102",
			"checksum": "",
			"status": "enabled",
			"url": "http://www.su1.com",
			"last_feed_date": null
		},

		contentDated1: [
			{
				"orig_source_id": "100",
				"title": "content Dated 1.1",
				"body": "<h1>Lorem ipsum</h1> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
				"author":"John Doe",
				"guid": "1001",
				"checksum": "",
				"url":"",
				"status": "enabled",
				"last_feed_date": 1430847160000
			},
			{
				"orig_source_id": "100",
				"title": "content Dated 1.2",
				"body": "<h1>Lorem ipsum</h1> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
				"author":"John Doe",
				"guid": "1002",
				"checksum": "",
				"url":"",
				"status": "enabled",
				"last_feed_date": 1430847150000
			}
		],

		contentUndated1: [
			{
				"orig_source_id": "102",
				"title": "content Undated 1.1",
				"body": "<h1>Lorem ipsum</h1> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
				"author":"John Doe",
				"guid": "1021",
				"checksum": "",
				"url":"",
				"status": "enabled",
				"last_feed_date": null
			}
		],

		contentUndated1Updated: [
			{
				"orig_source_id": "102",
				"title": "content Undated 1.1 updated",
				"body": "<h1>Lorem ipsum</h1> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
				"author":"John Doe",
				"guid": "1021",
				"checksum": "",
				"url":"",
				"status": "enabled",
				"last_feed_date": null
			}
		],

		contentUndated1Added: [
			{
				"orig_source_id": "102",
				"title": "content Undated 1.1",
				"body": "<h1>Lorem ipsum</h1> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
				"author":"John Doe",
				"guid": "1021",
				"checksum": "",
				"url":"",
				"status": "enabled",
				"last_feed_date": null
			},
			{
				"orig_source_id": "102",
				"title": "content Undated 1.2",
				"body": "<h1>Lorem ipsum</h1> consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat volutpat.",
				"author":"John Doe",
				"guid": "1022",
				"checksum": "",
				"url":"",
				"status": "enabled",
				"last_feed_date": null
			}
		],

	}
;

export {ImporterFixtures};