let treatmentId = null;
let generalAssessmentId = null;

window.onload = async function() {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const treatmentData = sessionStorage.getItem("thisTreatment");
    const treatment = JSON.parse(treatmentData);

    treatmentId = treatment.treatmentId;

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

        generalAssessmentId = generalAssessment.generalAssessmentId;

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
        card.dataset.id = assessment.muscularAssessmentId;

        const prefix = `muscle-${index}`;

        card.innerHTML = `
            <label>Músculo:
                <input type="text" id="${prefix}-muscleName" value="${assessment.muscleName || ""}">
            </label>
            <br>
            <label>Muscle Assessment:
                <input type="text" id="${prefix}-muscleAssessment" value="${assessment.muscleAssessment || ""}">
            </label>
            <br>
            <hr>
        `;

        container.appendChild(card);
    });

    document.getElementById("loading-screen").classList.add("hidden");
};

async function saveTreatmentDetails() {
    const token = sessionStorage.getItem("jwtToken");

    if (!treatmentId) {
        console.error("No se ha cargado el ID del tratamiento.");
        return;
    }

    try {
        const response = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment/${treatmentId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                treatmentId: treatmentId,
                treatmentCause: document.getElementById("treatmentCause").value,
                treatmentDate: document.getElementById("treatmentDate").value
            })
        });

        if (!response.ok) {
            console.error("Error al editar los datos del tratamiento. Código de estado: " + response.status);
            return;
        }

        Swal.fire({
            title: "Treatment Updated",
            icon: "success"
        });

    } catch (error) {
        console.error("Error al editar los datos del tratamiento:", error);
    }
}


async function saveGeneralAssessmentDetails() {
    const token = sessionStorage.getItem("jwtToken");

    if (!generalAssessmentId) {
        console.error("No se ha cargado el ID de la evaluación general.");
        return;
    }

    try {
        const response = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/GeneralAssessment/${generalAssessmentId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                generalAssessmentId: generalAssessmentId,
                painLevel: document.getElementById("painLevel").value,
                usualPhysicalActivity: document.getElementById("usualPhysicalActivity").value,
                height: document.getElementById("height").value,
                weight: document.getElementById("weight").value,
                occupation: document.getElementById("occupation").value,
                medicalHistory: document.getElementById("medicalHistory").value
            })
        });

        if (!response.ok) {
            console.error("Error al editar los datos del tratamiento. Código de estado: " + response.status);
            return;
        }

        Swal.fire({
            title: "General Assessment Updated",
            icon: "success"
        });

    } catch (error) {
        console.error("Error al editar los datos del tratamiento:", error);
    }
}


async function saveMuscularAssessmentDetails() {
    const token = sessionStorage.getItem("jwtToken");
    const container = document.getElementById("muscleAssessmentsContainer");
    const cards = container.querySelectorAll(".muscle-card");

    for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        const muscleName = document.getElementById(`muscle-${i}-muscleName`).value;
        const muscleAssessment = document.getElementById(`muscle-${i}-muscleAssessment`).value;
        const muscularAssessmentId = card.dataset.id;

        const assessmentData = {
            muscularAssessmentId: muscularAssessmentId,
            treatmentId: treatmentId,
            muscleName: muscleName,
            muscleAssessment: muscleAssessment
        };

        const response = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/MuscularAssessment/${muscularAssessmentId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(assessmentData)
        });

        if (!response.ok) {
            console.error(`Error al actualizar la evaluación muscular con ID ${muscularAssessmentId}:`, response.status);
        }
    }

    Swal.fire({
        title: "Muscle Assessments Updated",
        icon: "success"
    });
}



$(document).ready(function(){
  $('#treatmentDate').datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true
  });
});