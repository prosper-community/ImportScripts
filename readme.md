# ImportScripts
This is a Google Apps script that can be uploaded to Google Sheets via 'Script Editor'.

The purpose of this script is to upload external data sets to the [RefugeeProjects.com database](https://docs.google.com/spreadsheets/d/1V3BUANVaLhPmoQAQOdrHebCH4_KzyJnjY99M04AMazE/edit#gid=0).  External data sources can either be included as a URL or within a specified Google Drive folder.

Add a data set as an to sources for it to be included in the import:

```javascript
var sources = {
  'source-name': {
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
};
```

You can also add a helper file to `source-mappings` and name it according to the name of the data set. The structure of source-mappings is as follows:

---
Name: Source Name
URL: 'https://docs.google.com/spreadsheets/d/#YOUR-ID-HERE',
---

[columnID] - [columnName]

[0] - Name
[1] - Organization Name
[2] - Organization Category
[3] - Problem
[4] - Solution
[5] - Facebook URL
[6] - Website
[7] - Email
[8] - Notes

Please make a new branch if you'd like to add any data sources to the `ImportData.js` script for import to the [RefugeeProjects.com database](https://docs.google.com/spreadsheets/d/1V3BUANVaLhPmoQAQOdrHebCH4_KzyJnjY99M04AMazE/edit#gid=0).
