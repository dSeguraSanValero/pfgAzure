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
};