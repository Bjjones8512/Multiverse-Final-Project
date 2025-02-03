(function executeRule(current, previous /*null when async*/ ) {

    /*
     This BR is created as part of STRY0605832. This BR updates the SOX Risk score on associated control record.
    The Final Risk score will be sum of below :
    a) Average of all completed control attestation's sox risk score related to control.
    b) If the control nature is "Manual" or "IT Dependent", add 2
    c) If the control's primary entity is a process, add the risk rating found on that business process record (SOX Business Process Risk Rating Score)
    d) If the Control has had any issues opened in the last year, add 4
     */
    var riskScore = 0; // Initialize the variable to 0

    // Fetch the Average of all completed control attestation's sox risk score related to control

    var grAsmt = new GlideAggregate('asmt_assessment_instance');
    grAsmt.addQuery("sn_grc_item", current.getUniqueValue());
	grAsmt.addEncodedQuery("taken_onONThis year@javascript:gs.beginningOfThisYear()@javascript:gs.endOfThisYear()"); // Added per STRY0951832
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

    // Check if there are any issue created within last 1 year for this control. If it is then add 4
    var grIssue = new GlideRecord('sn_grc_issue');
    grIssue.addEncodedQuery('item=' + current.getUniqueValue() + '^opened_atRELATIVEGT@year@ago@1');
    grIssue.query();
    if (grIssue.hasNext()) {
        riskScore += 4;
    }

	// STRY0984137 - Blake - Updated date range to consider assessments taken from March 1 - January 31 of the current year
	var today = new GlideDateTime();
	var currentYear = today.getYearUTC(); 
	var currentYearStartDate = new GlideDateTime(currentYear + "-03-01 00:00:00");
	var currentYearEndDate = new GlideDateTime(currentYear + "-01-31 23:59:59");

	grAsmt.addQuery("taken_on", ">=", currentYearStartDate);
	grAsmt.addQuery("taken_on", "<=", currentYearEndDate);


	// STRY0984137 - Blake - Updated date range for issue records to consider March 1 of last year to February 28 (or 29 if leap year) of current year
	var lastYear = currentYear - 1;
	var lastYearStartDate = new GlideDateTime(lastYear + "-03-01 00:00:00");
	var lastYearEndDate = new GlideDateTime(lastYear + "-02-28 23:59:59");

	// Check if last year was a leap year and update end date accordingly
	if (new GlideDateTime(lastYear + "-02-29").getDate().indexOf("Invalid") === -1) {
		lastYearEndDate = new GlideDateTime(lastYear + "-02-29 23:59:59");
	}

	grIssue.addQuery('item', current.getUniqueValue());
	grIssue.addQuery('opened_at', '>=', lastYearStartDate);
	grIssue.addQuery('opened_at', '<=', lastYearEndDate);

    // Update the SOX risk score field value with finalized riskscore.
    current.u_sox_risk_score = riskScore;


})(current, previous);

/*I believe the requirement is not clear from the PO, added my comments on the Story.
I have looked at the changes on the Business Rule: OneRisk_Calculate_SOX_Risk_Score_Control and it shouldn't be in that way.
The code should be in the way at line 48 to get the query as below.
From: Add '4' if any Issue record created for the Control in last year (i.e. 4 January 2024 to 3 January 2025).
https://ays-dev.verizon.com/sn_grc_issue_list.do?sysparm_query=item.name%3DSTP.5.12.3%20Maintain%20System%20Settings%20%26%20Security%5Eopened_atRELATIVEGT%40year%40ago%401
To: Add '4' if any Issue record created for the Control in last year as below.
1. When calculation happens on Jan 15, 2025 --> March 1, 2023 and February 29, 2024
2. When calculation happens on Sep 3, 2026 --> March 1, 2025 and February 28, 2026.
*/