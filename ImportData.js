var settings = {
	targetLanguage: 'english',
	targetSpreadSheetUrl: 'https://docs.google.com/spreadsheets/d/1V3BUANVaLhPmoQAQOdrHebCH4_KzyJnjY99M04AMazE/',
	toProcessPath: '0B3H4lorZl65edjY0TjhxZVBZNTg',
	processedPath: '0B3H4lorZl65eUGlpWUp5WjQ2bVk'
};

var sourceType = {
	urlSpreadSheet: 1, //processUrlSpreadSheet
	folderSpreadSheet: 2 //processFolder
};

var sources = {
	'refugee-projects-form-responses': {
		type: sourceType.urlSpreadSheet,
		pathUrl: 'https://docs.google.com/spreadsheets/d/1wYKZMMBerbWGFvwsOtra5jKt02IMwAwQDxWBurHTbSQ/',
		startRow: 1,
		identifierIndex: 0,
		mappings: [
			[0, 1], // Timestamp
			[1, 30], // What is your full name?
			[2, 31], // What is your email address?
			[3, 2], // What is the name of the project?
			[4, 8], // What is the project's website? (if applicable)
			[5, 10], //?? Where is this project located?
			[6, 6], // What is the problem that this project solves?
			[7, 7], // What is this project's solution?
			[10, 15], // Which single category best describes this project?
			[11, 16], // Which tags best describe this project?
			[12, 21], // If this project has a Twitter profile, what is the URL?
			[15, 22], // If this project has a Facebook page, what is the URL?
			[19, 23], // If this project has a LinkedIN page, what is the URL?
			[20, 29], // What is the additional information you'd like to provide?
			[21, 19], // What is the best way to donate to the project?
			[22, 20], // What is the category of the donation method you provided above?
			[23, 17], // What is the best way to contact the project?
			[24, 18], // What is the category that describes the contact information you provided above?
			[25, 27], // What kind of volunteers does this project need?
			[26, 3] // What is the name of the organization which runs the project?
		]
	},
	'calaid-ipedia': {
		type: sourceType.urlSpreadSheet,
		pathUrl: 'https://docs.google.com/spreadsheets/d/1A5wDMgmddNalWB77dlqWIvl1X-dYBrU-7x3mGBkBkDc/',
		startRow: 1,
		identifierIndex: 4, // Name
		mappings: [
			[0, 12], // Country
			[1, 11], // City
			[2, 10], // Address
			[3, 8], // Website
			[4, 2], // Project Name
			[5, 7], // Description
			[6, 15], // Category
			[7, 16], // Tags
			[8, 22] // Facebook
		]
	},
	'digital-refugee-projects-betterplace-lab': {
		type: sourceType.urlSpreadSheet,
		pathUrl: 'https://docs.google.com/spreadsheets/d/1t82LzxBH5GL2HOnEySZE6irLXLAI6rogJ-r8Cf573yo/',
		startRow: 1,
		identifierIndex: 0, // Name
		mappings: [
			[0, 12], // Name
			[1, 12], // Country
			[2, 8], // Website
			[3, 7], // Description
			[5, 15], // Type
			[6, 29], // Category (German)
			[10, 3] // Organization
		]
	}
};

var mappingTypes = {};
mappingTypes[[].constructor] = function(data, mapping) {
	var text = "";
	for(var i = 0, ii = mapping.length; i < ii; i++)
		text += " " + data[mapping[i]];

	return text;
};

mappingTypes[(1).constructor] = function(data, index) { return data[index]; }
mappingTypes[Function.constructor] = function(data, func) { return func(data); }

function main() {
	// CHANGE THE KEY TO THE KEY OF THE SOURCE TO MANUALLY RUN A CERTAIN IMPORT
	//ScriptProperties.setProperty("last_sources_key","refugees.sahana.io-organizations");
	processFolder();
	processSheets();
	ScriptProperties.setProperty("last_sources_key", '');
}

function importSpreadSheet(path, sets, key) {
	try {
		var ssTarget = SpreadsheetApp.openByUrl(settings.targetSpreadSheetUrl);
		var targetSheet = ssTarget.getActiveSheet();


		var sourceSP = SpreadsheetApp.openByUrl(path);
		var sourceSheet = _getSheet(sourceSP, sets.sheetGID)

		if(sourceSheet == -1)
			throw "Could not find sheet with id "+ sets.sheetGID + " in spreadsheet";

		sourceSheet = sourceSheet || sourceSP.getActiveSheet();
		var rowCount = sourceSheet.getDataRange().getNumRows();
		var start = 0;

		if(sets.startRow)
			start += sets.startRow;
	} catch(e) {
		Logger.log('importSpreadSheet failed with an error:');
		Logger.log(e);
		return;
	}

	for(var i = start, ii = rowCount; i < ii; i++) {
		var cols = sourceSheet.getRange(i+1, 1, 1, 50);
		var vals = cols.getDisplayValues();

		for(var x = 0, xx = vals.length; x < xx; x++) {
			var isEmpty = vals[x].join('') == '';
			if(isEmpty) {
				Logger.log('found empty row');
				continue;
			}

			var data = _mapColumnsAndTranslate(vals[x], sets.mappings, sets.translateFrom);
			data = _clearArray(data);

			var rangeKey = null;
			var rangeKeyAppend = vals[x][sets.identifierIndex].replace(/[^A-Za-z0-9]/gi, '_') || '';

			if(rangeKeyAppend.trim() != '')
				rangeKey = key.replace(/[^A-Za-z0-9]/gi, '_') + '_'+rangeKeyAppend;

			var range = _getRangeByNameOrIndexes(ssTarget, rangeKey, data.length);

			try {
				if((rangeKey || '') != '')
					ssTarget.setNamedRange(rangeKey, range);
			} catch(e) {
				Logger.log("Could not set ranged name due to following error:");
				Logger.log(e);
			}

			range.setValues([data]);
		}
	}

	return true;
}

function _getSheet(spreadsheet, sheetid) {
	if(sheetid == '' || sheetid == null || sheetid == undefined)
		return null;

	var sheets = spreadsheet.getSheets();
	for(var i = 0, ii = sheets.length; i < ii; i++) {
		if((sheets[i].getSheetId()+'').indexOf(sheetid) == -1)
			continue;

		return sheets[i];
	}

	return -1;
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

		if(importSpreadSheet(url, sets, sets.name)) {
			file.makeCopy((new Date().getTime() + fileName), destFolder);
			file.setTrashed(true);
		}
	}
}

function processSheets() {
	var startKey = ScriptProperties.getProperty("last_sources_key");
	for(var key in sources) {
		if(sources[key].type != sourceType.urlSpreadSheet)
			continue;

		if(startKey != '' && key != startKey)
			continue;

		ScriptProperties.setProperty("last_sources_key", key);
		importSpreadSheet(sources[key].pathUrl, sources[key], key);
		//break;
	}
}

function _clearArray(data) {
	for(var i = 0, ii = data.length; i < ii; i++) {
		if(data[i] == null)
			data[i] = '';
	}
	return data;
}

function _mapColumnsAndTranslate(rowData, mappings, translateFrom) {
	var result = [];
	for(var i = 0, ii = mappings.length; i < ii; i++) {
		var to = mappings[i][1];
		var text = mappingTypes[mappings[i][0].constructor+''](rowData, mappings[i][0]);//rowData[frm];

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
			ScriptProperties.setProperty("last_sources_key", prop);
			return sets;
		}
	}
	return null;
}

function _getRangeByNameOrIndexes(spreadSheet, rangeName, numColumns) {
	rangeName = rangeName || '';
	var range = spreadSheet.getRangeByName(rangeName);
	var sheet = spreadSheet.getActiveSheet();

	if(range != null) {
		spreadSheet.removeNamedRange(rangeName);
		range.clear();
		sheet.deleteRow(range.getRow());
	}

	var rows = spreadSheet.getDataRange().getNumRows()+1;
	newRange = sheet.getRange(rows, 1, 1, numColumns);
	return newRange;
}

function _getFirstKeyInObj(obj) {
	for(var prop in obj) {
		return prop;
	}
}
