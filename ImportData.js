var settings = {
	targetLanguage: 'english',
	targetSpreadSheetUrl: 'https://docs.google.com/spreadsheets/d/1V3BUANVaLhPmoQAQOdrHebCH4_KzyJnjY99M04AMazE',
	toProcessPath: '0B3H4lorZl65edjY0TjhxZVBZNTg'//'ToProcess'//'https://drive.google.com/open?id=0B3H4lorZl65edjY0TjhxZVBZNTg',
	processedPath: '0B3H4lorZl65eUGlpWUp5WjQ2bVk'//'Processed'//'https://drive.google.com/open?id=0B3H4lorZl65eUGlpWUp5WjQ2bVk'
};

var sourceType = {
	urlSpreadSheet: 1, //processUrlSpreadSheet
	folderSpreadSheet: 2//processFolder
};

var sources = {
	// Example Source Object
	/*
	'name': {
		pathUrl: 'http://...',
		type: sourceType.urlSpreadSheet,
		translateFrom: 'language here',
		mappings: [
			[sourceColumnIndex, destinationColumnIndex],
			[1,1],
			[0,5],
			[6,2]
		]
	}
	*/
	/*
	'name': {
		'Hamburger Fl�chtlings- und Willkommensinitiativen',
		pathUrl: 'https://docs.google.com/spreadsheets/d/1tTEQT2bBv2HsTI-Zjpde2me5x3fWrWpxLq_WXWLJBEI/edit?ts=568a93db#gid=0',
		type: sourceType.urlSpreadSheet,
		translateFrom: 'german',
		mappings: [
			[sourceColumnIndex, destinationColumnIndex],
			[0,0],
			[1,1],
			[2,2]
		],
		}
	*/
	'refugee-projects-form-responses': {
		type: sourceType.urlSpreadSheet,
		pathUrl: 'https://docs.google.com/spreadsheets/d/1wYKZMMBerbWGFvwsOtra5jKt02IMwAwQDxWBurHTbSQ/edit#gid=1895427304',
		// hasHeader: 1, // I'm not clear as to hasHeader is indicating given the numeric value
		identifierIndex: 0,
		subsheet: false, // I wasn't sure how you wanted to implement the multiple sheet data in the code, but I'm including it here for clarity
		mappings: [
			[0, 1],
			[1, 30],
			[2, 31],
			[3, 2],
			[4, 8],
			[5, 12],
			[6, 6],
			[7, 7],
			[8, 25],
			// [9, ], Contact Info? boolean — data not needed
			[10, 15],
			[11, 16],
			[12, 21],
			// [13, ], Organization? boolean - data not needed
			// [14, ], Additional Info? boolean- data not needed
			[15, 22],
			[16, 26],
			// [17, ], Your info? boolean - data not needed
			// [18, ], Social media? boolean - data not needed
			[19, 23],
			[20, 29],
			[21, 19],
			[22, 20],
			[23, 17],
			[24, 18],
			[25, 27],
			[26, 3]
		]
	},
	'sbtf-daily-needs-phase-ii--organizations': {
		type: sourceType.urlSpreadSheet,
		pathUrl: 'https://docs.google.com/spreadsheets/d/1C9fmpzb3VhoGOsCnRAnhbXZNkKd3sVZIN0Ha1VOBQjk/edit#gid=1142452757',
		//hasHeader: 1, // I'm not clear as to hasHeader is indicating given the numeric value
		identifierIndex: 0,
		subsheet: true, // I wasn't sure how you wanted to implement the multiple sheet data in the code, but I'm including it here for clarity
		sheetGID: 1142452757, // I've included the GID here, feel free to place it elsewhere
		sheetIndex: 5, // As it currently stands, its index 5
		mappings: [
			[0, 0],
			[1, 28],
			[2, 1],
			[3, 3],
			[4, 4],
			[5, 5],
			[6, 7],
			[7, 15],
			[8, 10],
			[9, 9],
			[10, 11],
			[11, 12],
			[12, 29], // destinationColumnIndex 29 is the catch all 'Additional Info'. Should be appended, not overwritten
			[13, 29], // destinationColumnIndex 29 is the catch all 'Additional Info'. Should be appended, not overwritten
			[14, 21],
			[15, 22],
			[16, 24],
			[17, 8],
			[18, 31], // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
			[19, 31], // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
			[20, 31], // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
			[21, 31], // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
			[22, 31], // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
			[23, 31], // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
			[24, 31], // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
			[25, 31]  // destinationColumnIndex 31 is 'Additional Countries'. Should be appended and comma delimited, not overwritten
		]
	}
	'sahana': {
		type: sourceType.folderSpreadSheet,
		hasHeader: 1,
		identifierIndex: 3,
		mappings: [
			[0,3], //Name
			[2,5], //not sure, skipping, [2,12] //Type
			[2,10], //Services
			[3,5], //Address
			//not sure, skipping, [5,]//Phone Number
			[5,2], //Email
			[6,15], //Facebook
			[7,4], //Website
			[8,0] //LastUpdated
		]
	},
	'online_information': {
		type: sourceType.folderSpreadSheet,
		hasHeader: 1,
		identifierIndex: 3,
		mappings: [
			[0, 3], //Name
			[1, 7], //Type
			[2, 4], //Link
			[3, 6], //Description
			//not sure, skipping, [4, ] //Status
			[5, 26] //Owner
			//not sure, skipping, [6, ] //Notes
		]
	}
};

var mappingTypes = {
	Array: function(data, mapping) {
		var text = "";
		// I've never seen this 'ii' pattern before. What is it?
		for(var i = 0, ii = mapping.length; i < ii; i++)
			text += " " + data[i];
		return text;
	}
	, Number: function(data, index) { return data[index]; }
	, Function: function(data, func) { return func(data); }
};

function main() {
	processFolder();
	processSheets();
}

function importSpreadSheet(path, sets, key) {
	try {
		var ssTarget = SpreadsheetApp.openByUrl(settings.targetSpreadSheetUrl);
		var targetSheet = ssTarget.getActiveSheet();

		var sourceSheet = SpreadsheetApp.openByUrl(path).getActiveSheet();
		var rowCount = sourceSheet.getDataRange().getNumRows();
		var start = 0;

		if(sets.hasHeader)
			start += sets.hasHeader;
	} catch(e) {
		Logger.log('importSpreadSheet failed with an error:');
		Logger.log(e);
		return;
	}

	for(var i = start, ii = rowCount; i < ii; i++) {
		var cols = sourceSheet.getRange(i+1, 1, 1, 50);
		var vals = cols.getDisplayValues();
		var isEmpty = vals.join('');

		if(isEmpty)
			continue;

		for(var x = 0, xx = vals.length; x < xx; x++) {
			var data = _mapColumnsAndTranslate(vals[x], sets.mappings, sets.translateFrom);
			var rangeKey = key +'_'+data[sets.identifierIndex].replace(/[^A-Za-z0-9]/gi, '_')
			data = _clearArray(data);

			var range = _getRangeByNameOrIndexes(ssTarget, rangeKey, data.length);
			ssTarget.setNamedRange(rangeKey, range);
			range.setValues([data]);
		}
	}

	return true;
}

function processFolder() {
	var folder = DriveApp.getFolderById(settings.toProcessPath);
	var destFolder = DriveApp.getFolderById(settings.processedPath);

	var files = folder.getFiles();

	while(files.hasNext()) {
		var file = files.next();
		var url = file.getUrl();
		var fileName = file.getName();
		var sets = _getSettingsByFileName(fileName);

		if(!sets)
		  continue;

		Logger.log(sets);
		if(importSpreadSheet(url, sets, sets.name)) {//SUCCESS MOVE TO PROCESSED FOLDER
			file.makeCopy((new Date().getTime() + fileName), destFolder);
			file.setTrashed(true);
		}
	}
}

function processSheets() {
	for(var key in source) {
		if(source[key].type != sourceType.urlSpreadSheet)
			continue;

		importSpreadSheet(source[key].pathUrl, source[key], key);
	}
}

function _clearArray(data) {
	for(var i = 0, ii = data.length; i < ii; i++) {
		if(!data[i])
			data[i] = '';
	}
	return data;
}

function _mapColumnsAndTranslate(rowData, mappings, translateFrom) {
	var result = [];
	for(var i = 0, ii = mappings.length; i < ii; i++) {
		var to = mappings[i][1];
		var text = mappingTypes[mappings[i][0].constructor](rowData, mappings[i][1]);//rowData[frm];

		if(translateFrom)
			text = LanguageApp.translate(text, translateFrom, settings.targetLanguage);

		result[to] = text;
	}
	return result;
}

function _getSettingsByFileName(filename) {
	for(var prop in sources) {
		if(filename.toLowerCase().indexOf(prop.toLowerCase()) != -1) {
			var sets = sources[prop];
			sets.name = prop;
			return sets;
		}
	}
	return null;
}

function _getRangeByNameOrIndexes(spreadSheet, rangeName, numColumns) {
	var range = spreadSheet.getRangeByName(rangeName);
	var sheet = spreadSheet.getActiveSheet();
	var rows = 0;

	if(range == null)
		rows = spreadSheet.getDataRange().getNumRows()+1;
	else {
		rows = range.getRow();
		spreadSheet.removeNamedRange(rangeName);
	}

	range = sheet.getRange(rows, 1, 1, numColumns);
	return range;
}
//DESTINATION COLUMNS
/*
See destination-mapping.txt
*/
