window.onload = async function() {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const treatmentData = sessionStorage.getItem("thisTreatment");
    const treatment = JSON.parse(treatmentData);

    const muscularAssessmentUrl = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/MuscularAssessment?treatmentId=${encodeURIComponent(treatment.treatmentId)}`;
    const generalAssessmentUrl = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/GeneralAssessment?treatmentId=${encodeURIComponent(treatment.treatmentId)}`;

    document.getElementById("treatmentCause").value = treatment.treatmentCause || "";
};