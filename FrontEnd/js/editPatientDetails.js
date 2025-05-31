let patientId = null;

window.onload = function () {
    const token = sessionStorage.getItem("jwtToken");
    const patientData = sessionStorage.getItem("patientToEdit");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    if (!patientData) {
        console.error("No se encontraron datos del paciente para editar.");
        return;
    }

    const patient = JSON.parse(patientData);

    patientId = patient.patientId;

    document.getElementById("patientName").value = patient.name || "";
    document.getElementById("patientFirstSurname").value = patient.firstSurname || "";
    document.getElementById("patientSecondSurname").value = patient.secondSurname || "";
    document.getElementById("patientNif").value = patient.dni || "";
    document.getElementById("birthDate").value = patient.birthDate || "";

    document.getElementById("loading-screen").classList.add("hidden");
};


async function editPatientData() {
    const token = sessionStorage.getItem("jwtToken");

    if (!patientId) {
        console.error("No se ha cargado el ID del paciente.");
        return;
    }

    try {
        const response = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Patient/${patientId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                patientId: patientId,
                name: document.getElementById("patientName").value,
                firstSurname: document.getElementById("patientFirstSurname").value,
                secondSurname: document.getElementById("patientSecondSurname").value,
                dni: document.getElementById("patientNif").value,
                birthDate: document.getElementById("birthDate").value
            })
        });

        if (!response.ok) {
            console.error("Error al editar los datos del paciente. Código de estado: " + response.status);
            return;
        }

        const text = await response.text();

        window.location.href = "privateZone.html";

    } catch (error) {
        window.location.href = "privateZone.html";
    }
}

$(document).ready(function(){
  $('#birthDate').datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true
  });
});