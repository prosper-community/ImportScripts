var settings = {
	targetLanguage: 'english'
	, targetSpreadSheetUrl: 'https://docs.google.com/spreadsheets/d/11el9LcYbWYX0OnnXc6_frz8ufY9eypxpMzK3pktM6Yc/edit'
	, toProcessPath: '0B3H4lorZl65edjY0TjhxZVBZNTg'//'ToProcess'//'https://drive.google.com/open?id=0B3H4lorZl65edjY0TjhxZVBZNTg'
	, processedPath: '0B3H4lorZl65eUGlpWUp5WjQ2bVk'//'Processed'//'https://drive.google.com/open?id=0B3H4lorZl65eUGlpWUp5WjQ2bVk'
};

var sourceType = {
	urlSpreadSheet: 1//processUrlSpreadSheet
	, folderSpreadSheet: 2//processFolder
};

var sources = {
	//EX OBJ:
	//{name: {pathUrl: 'http://...', type: sourceType.urlSpreadSheet, translateFrom: 'language here', mappings: [[sourceColumnIndex,destinationColumnIndex], [1,1]...], startRow: int} }
	/*{ 	name: 'Hamburger Flüchtlings- und Willkommensinitiativen'
		, pathUrl: 'https://docs.google.com/spreadsheets/d/1tTEQT2bBv2HsTI-Zjpde2me5x3fWrWpxLq_WXWLJBEI/edit?ts=568a93db#gid=0'
		, type: sourceType.urlSpreadSheet
		, translateFrom: 'german'
		, mappings: [
		
		]
	}*/
	'sahana': {
		type: sourceType.folderSpreadSheet
		, hasHeader: 1
		, identifierIndex: 3
		, mappings: [
			[0,3] //Name
			[[2,5]
			//not sure, skipping, [2,12] //Type
			, [2,10]//Services
			, [3,5]//Address
			//not sure, skipping, [5,]//Phone Number
			, [5,2]//Email
			, [6,15]//Facebook
			, [7,4]//Website
			, [8,0]//LastUpdated
		]
	}
	, 'online_information': {
		type: sourceType.folderSpreadSheet
		, hasHeader: 1
		, identifierIndex: 3
		, mappings: [
			[0, 3] //Name
			, [1, 7] //Type
			, [2, 4] //Link
			, [3, 6] //Description
			//not sure, skipping, [4, ] //Status
			, [5, 26] //Owner
			//not sure, skipping, [6, ] //Notes
		]
	}
};

var mappingTypes = {
	Array: function(data, mapping) { 
		var text = "";
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
[0] - Date
[1] - What is your full name?
[2] - What is your email address?
[3] - What is the name of the project?
[4] - What is the project's URL? 
[5] - (if applicable)	Where is this project located?	
[6] - What is the problem that this project solves?	
[7] - What is this project's solution?	
[8] - Do you know if this project is currently fundraising?	
[9] - What is the name of the best person to contact for the project?	
[10] - Do you know of any contact information for this project?	
[11] - Which category best describes this project?	
[12] - Which tags best describe this project?	
[13] - If this project has a Twitter profile, what is the URL?	
[14] - Is the project apart of a bigger organization?	
[15] - Is there any additional information you'd like to provide?	
[16] - If this project has a Facebook page, what is the URL?	
[17] - Do you know if this project needs volunteers?	
[18] - Would you like to provide us with your name and email address?	
[19] - Do you know if this project has any social media accounts?	
[20] - If this project has a LinkedIN page, what is the URL?	
[21] - What is the additional information you'd like to provide?	
[22] - What is the best way to donate to the project?	
[23] - What is the category of the donation method you provided above?	
[24] - What is the best way to contact the project?	
[25] - What is the category that describes the contact information you provided above?	
[26] - What kind of volunteers does this project need?	
[27] - What is the name of the organization which runs the project?	
[28] - Do you know of any contact information for this project?
*/