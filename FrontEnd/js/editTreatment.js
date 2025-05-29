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
    document.getElementById("treatmentDate").value = treatment.treatmentDate || "";


    const response = await fetch(generalAssessmentUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error("Error al obtener datos generales:", response.status);
        alert("No se pudieron obtener datos generales.");
        return;
    }

    const generalAssessment = await response.json();
    console.log("General Assessment Data:", generalAssessment);

    document.getElementById("painLevel").value = generalAssessment.painLevel || "";
    document.getElementById("usualPhysicalActivity").value = generalAssessment.usualPhysicalActivity || "";
    document.getElementById("patientHeight").value = generalAssessment.patientHeight || "";
    document.getElementById("patientWeight").value = generalAssessment.patientWeight || "";
    document.getElementById("occupation").value = generalAssessment.occupation || "";
    document.getElementById("pastMedicalHistory").value = generalAssessment.pastMedicalHistory || "";
};

$(document).ready(function(){
  $('#treatmentDate').datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true
  });
});