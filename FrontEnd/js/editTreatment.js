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

    const generalAssessmentArray = await response.json();

    if (generalAssessmentArray.length > 0) {
        const generalAssessment = generalAssessmentArray[0];

        document.getElementById("painLevel").value = generalAssessment.painLevel || "";
        document.getElementById("usualPhysicalActivity").value = generalAssessment.usualPhysicalActivity || "";
        document.getElementById("height").value = generalAssessment.height || "";
        document.getElementById("weight").value = generalAssessment.weight || "";
        document.getElementById("occupation").value = generalAssessment.occupation || "";
        document.getElementById("medicalHistory").value = generalAssessment.medicalHistory || "";
    } else {
        console.warn("No general assessment data found.");
    }

    const muscularResponse = await fetch(muscularAssessmentUrl, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    });

    if (!muscularResponse.ok) {
        console.error("Error al obtener datos musculares:", muscularResponse.status);
        alert("No se pudieron obtener los datos musculares.");
        return;
    }

    const muscleAssessments = await muscularResponse.json();
    const container = document.getElementById("muscleAssessmentsContainer");
    container.innerHTML = "";

    muscleAssessments.forEach((assessment, index) => {
        const card = document.createElement("div");
        card.className = "muscle-card";

        const prefix = `muscle-${index}`;

        card.innerHTML = `
            <label>Músculo:
                <input type="text" id="${prefix}-muscleName" value="${assessment.muscleName || ""}">
            </label>
            <br>
            <label>Muscle Assessment:
                <input type="number" id="${prefix}-muscleAssessment" value="${assessment.muscleAssessment || ""}">
            </label>
            <br>
            <hr>
        `;

        container.appendChild(card);
    });

};

function collectEditedMuscleAssessments() {
    const container = document.getElementById("muscleAssessmentsContainer");
    const cards = container.querySelectorAll(".muscle-card");

    const editedAssessments = Array.from(cards).map((card, index) => {
        return {
            muscleName: card.querySelector(`#muscle-${index}-muscleName`).value,
            strength: parseInt(card.querySelector(`#muscle-${index}-strength`).value),
            pain: parseInt(card.querySelector(`#muscle-${index}-pain`).value),
            comment: card.querySelector(`#muscle-${index}-comment`).value
        };
    });

    return editedAssessments;
}


$(document).ready(function(){
  $('#treatmentDate').datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true
  });
});