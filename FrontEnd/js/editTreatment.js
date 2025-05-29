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


    const response = await fetch(muscularAssessmentUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!response.ok) {
        console.error("Error al obtener datos musculares:", response.status);
        alert("No se pudieron obtener datos musculares.");
        return;
    }
    
    const muscularAssessment = await response.json();

    document.getElementById("painLevel").value = muscularAssessment.painLevel || "";
    document.getElementById("usualPhysicalActivity").value = muscularAssessment.usualPhysicalActivity || "";
    document.getElementById("patientHeight").value = muscularAssessment.patientHeight || "";
    document.getElementById("patientWeight").value = muscularAssessment.patientWeight || "";
    document.getElementById("occupation").value = muscularAssessment.occupation || "";
    document.getElementById("pastMedicalHistory").value = muscularAssessment.pastMedicalHistory || "";
};

$(document).ready(function(){
  $('#treatmentDate').datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true
  });
});