window.onload = async function() {
    showSpinner();

    await new Promise(resolve => setTimeout(resolve, 500));

    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const treatmentData = sessionStorage.getItem("thisTreatment");
    const treatment = JSON.parse(treatmentData);

    const container = document.getElementById('main-container');
    const mainDiv = document.createElement('div');

    const physioUrl = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Physio?physioId=${encodeURIComponent(treatment.createdBy)}`;
    const muscularAssessmentUrl = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/MuscularAssessment?treatmentId=${encodeURIComponent(treatment.treatmentId)}`;
    const generalAssessmentUrl = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/GeneralAssessment?treatmentId=${encodeURIComponent(treatment.treatmentId)}`;

    try {

        const physioResponse = await fetch(physioUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!physioResponse.ok) {
            console.error("Error al obtener datos fisioterapéuticos:", physioResponse.status);
            alert("No se pudieron obtener datos fisioterapéuticos.");
            return;
        }

        const physio = await physioResponse.json();

        let physioHtml = "";
        if (physio.length > 0) {
            const firstPhysio = physio[0];
            physioHtml = `<p>${firstPhysio.name}, ${firstPhysio.firstSurname}, ${firstPhysio.secondSurname}. Registration number: <strong>${firstPhysio.registrationNumber}</strong></p>`;
        } else {
            physioHtml = `<p>No physiotherapist data available.</p>`;
        }


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

        let musclesHtml = "";
        muscularAssessment.forEach(muscle => {
            musclesHtml += `<p><strong>- ${muscle.muscleName} </strong>presents ${muscle.muscleAssessment}</p>`;
        });


        const generalResponse = await fetch(generalAssessmentUrl, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!generalResponse.ok) {
            console.error("Error al obtener evaluación general:", generalResponse.status);
            alert("No se pudo obtener la evaluación general.");
            return;
        }

        const generalAssessment = await generalResponse.json();

        console.log("General Assessment:", generalAssessment);

        let medicalHistoryHtml = "";
        generalAssessment.forEach(generalAssessment => {
            medicalHistoryHtml += `<p>The patient has a history of ${generalAssessment.medicalHistory}</p>`;
        });

        let medicalDataHtml = "";
        generalAssessment.forEach(generalAssessment => {
            medicalDataHtml += `
            <p>Height: ${generalAssessment.height}</p>
            <p>Weight: ${generalAssessment.weight}</p>
            <p>Occupation: ${generalAssessment.occupation}</p>`;
        });

        mainDiv.innerHTML = `
            
            <div class="mainDiv-header">
                <p class="title"><strong>Physiotherapy Treatment Report</strong></p>
                <img src="./images/logo.png" alt="Logo" class="logo">
            </div>

            <hr>

            <div class="mainDiv-sub-header">
                <p><strong>Diagnostic Impression:</strong> ${treatment.treatmentCause}</p>
                <p><strong>Date:</strong> ${treatment.treatmentDate}</p>
            </div>

            <hr>
            <div class="section">
                <p><strong>Patient Data:</strong></p>
                ${medicalDataHtml}
            </div>

            <hr>
            <div class="section">
                <p><strong>Past medical history:</strong></p>
                ${medicalHistoryHtml}
            </div>

            <hr>
            <div class="section">
                <p><strong>Muscular Assessment</strong></p>
                ${musclesHtml}
            </div>

            <hr>
            ${physioHtml}
        `;

        container.appendChild(mainDiv);

    } catch (error) {
        console.error("Error al cargar datos:", error);
        alert("Ocurrió un error al cargar los datos.");
    }

    hideSpinner();
};


async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const element = document.getElementById("main-container");

    if (!element) {
    alert("No se encontró el contenido del informe.");
    return;
    }

    const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("informe_fisioterapia.pdf");
}


function showSpinner() {
    const spinnerOverlay = document.createElement("div");
    spinnerOverlay.id = "spinner-overlay";
    Object.assign(spinnerOverlay.style, {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: "9999"
    });

    const spinner = document.createElement("div");
    Object.assign(spinner.style, {
        width: "50px",
        height: "50px",
        border: "6px solid #f3f3f3",
        borderTop: "6px solid #3498db",
        borderRadius: "50%",
        animation: "spin 1s linear infinite"
    });

    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);

    spinnerOverlay.appendChild(spinner);
    document.body.appendChild(spinnerOverlay);
}

function hideSpinner() {
    const spinner = document.getElementById("spinner-overlay");
    if (spinner) {
        spinner.remove();
    }
}
