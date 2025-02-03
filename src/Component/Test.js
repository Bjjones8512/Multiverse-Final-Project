// STRY0984137 - Blake - Updated date range to consider assessments taken from March 1 - January 31 of the current year
var today = new GlideDateTime();
var currentYear = today.getYearUTC(); 
var currentYearStartDate = new GlideDateTime(currentYear + "-03-01 00:00:00");
var currentYearEndDate = new GlideDateTime(currentYear + "-01-31 23:59:59");

grAsmt.addQuery("taken_on", ">=", currentYearStartDate);
grAsmt.addQuery("taken_on", "<=", currentYearEndDate);
// End STRY0984137

// STRY0984137 - Blake - Updated date range for issue records to consider March 1 of last year to February 28 (or 29 if leap year) of current year
var lastYear = currentYear - 1;
var lastYearStartDate = new GlideDateTime(lastYear + "-03-01 00:00:00");
var lastYearEndDate = new GlideDateTime(lastYear + "-02-28 23:59:59");

// Check if last year was a leap year and update end date accordingly
if (new GlideDateTime(lastYear + "-02-29").getDate().indexOf("Invalid") === -1) {
    lastYearEndDate = new GlideDateTime(lastYear + "-02-29 23:59:59");
}

var grIssue = new GlideRecord('sn_grc_issue');
grIssue.addQuery('item', current.getUniqueValue());
grIssue.addQuery('opened_at', '>=', lastYearStartDate);
grIssue.addQuery('opened_at', '<=', lastYearEndDate);
// End STRY0984137

/*I believe the requirement is not clear from the PO, added my comments on the Story.
I have looked at the changes on the Business Rule: OneRisk_Calculate_SOX_Risk_Score_Control and it shouldn't be in that way.
The code should be in the way at line 48 to get the query as below.
From: Add '4' if any Issue record created for the Control in last year (i.e. 4 January 2024 to 3 January 2025).
https://ays-dev.verizon.com/sn_grc_issue_list.do?sysparm_query=item.name%3DSTP.5.12.3%20Maintain%20System%20Settings%20%26%20Security%5Eopened_atRELATIVEGT%40year%40ago%401
To: Add '4' if any Issue record created for the Control in last year as below.
1. When calculation happens on Jan 15, 2025 --> March 1, 2023 and February 29, 2024
2. When calculation happens on Sep 3, 2026 --> March 1, 2025 and February 28, 2026.
*/