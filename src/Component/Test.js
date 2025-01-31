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

    // Update the SOX risk score field value with finalized riskscore.
    current.u_sox_risk_score = riskScore;

    /*I want '4' to be added to the SOX Risk Score' on Control record, if any Issue record is created for the Control from March 1 last year to February 28 (February 29 if leap year) current year.

Examples:
1. When calculation happens on Jan 15 2025 then we need to consider Mar 1 2023 to Feb 29 2024.
2. When calculation happens on Mar 3 2025 then we need to consider Mar 1 2024 to Feb 28 2025.

Also, I want average 'SOX Risk Score' of the Assessment Instances which were taken in current year (March 1-Jan 31).
I know this story is complete when '4' is added to the SOX Risk Score' on Control record, if any Issue record is created for the Control from March 1 last year to February 28 (February 29 if leap year) current year.

Examples:
1. When calculation happens on Jan 15 2025 then we need to consider Mar 1 2023 to Feb 29 2024.
2. When calculation happens on Mar 3 2025 then we need to consider Mar 1 2024 to Feb 28 2025.

Also, I want to add average 'SOX Risk Score' of the Assessment Instances which were taken in current year(March 1-Jan 31). 
*/


})(current, previous);