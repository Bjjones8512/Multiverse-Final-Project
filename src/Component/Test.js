// STRY0984137 - Blake - Updated date range to consider assessments taken from March 1 - January 31 of the current year
var today = new GlideDateTime();
var currentYear = today.getYear();
var currentYearStartDate = new GlideDateTime(currentYear + "-03-01 00:00:00");
var currentYearEndDate = new GlideDateTime(currentYear + "-01-31 23:59:59");

grAsmt.addQuery("taken_on", ">=", currentYearStartDate);
grAsmt.addQuery("taken_on", "<=", currentYearEndDate);
// End STRY0984137

// STRY0984137 - Blake - Updated date range for issue records to consider March 1 of last year to February 28 (or 29 if leap year) of the current year
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