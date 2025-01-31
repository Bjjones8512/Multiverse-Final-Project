var riskScore = 0; // Initialize the variable to 0

// Fetch the Average of all completed control attestation's sox risk score related to control
var grAsmt = new GlideAggregate('asmt_assessment_instance');
grAsmt.addQuery("sn_grc_item", current.getUniqueValue());

// STRY0984137 - Blake - Updated date range to consider assessments taken from March 1 - January 31 of the current year
var today = new GlideDateTime();
var currentYear = today.getYear();
var currentYearStartDate = new GlideDateTime(currentYear + "-03-01 00:00:00");
var currentYearEndDate = new GlideDateTime(currentYear + "-01-31 23:59:59");

grAsmt.addQuery("taken_on", ">=", currentYearStartDate);
grAsmt.addQuery("taken_on", "<=", currentYearEndDate);
// End STRY0984137

grAsmt.query("state", "complete");
grAsmt.setGroup(false);
grAsmt.addAggregate('AVG', 'u_sox_risk_score');
grAsmt.query();
if (grAsmt.next()) {
    var avgRiskScore = grAsmt.getAggregate('AVG', 'u_sox_risk_score');
    riskScore = parseInt(avgRiskScore); // set the average sox risk score value to riskscore variable
}

// Check if control's nature is either "manual" or "IT Dependent - Manual". If it is then add 2 to risk score variable	
if (current.u_nature == 'Manual' || current.u_nature == 'IT Dependent - Manual') {
    riskScore += 2;
}

// Check if primary entity linked with control is a business process record. If it is then add the risk score on business process record to riskscore variable
var grEnt = new GlideRecord("sn_grc_profile");
grEnt.addQuery("sys_id", current.profile);
grEnt.addQuery("table", "cmdb_ci_business_process");
grEnt.query();
if (grEnt.next()) {
    var grBP = new GlideRecord("cmdb_ci_business_process");
    grBP.addQuery("sys_id", grEnt.applies_to);
    grBP.query();
    if (grBP.next()) {
        riskScore += grBP.u_sox_business_process_risk_rating_score;
    }
}

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
grIssue.query();
if (grIssue.hasNext()) {
    riskScore += 4;
}
// End STRY0984137

// Update the SOX risk score field value with finalized riskscore.
current.u_sox_risk_score = riskScore;