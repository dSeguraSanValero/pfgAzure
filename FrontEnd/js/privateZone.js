window.onload = function() {
    const token = sessionStorage.getItem("jwtToken");
    
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    setTimeout(() => {
        document.querySelectorAll('.first-cards').forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
            setTimeout(() => {
                section.classList.add('active');
            
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 300);
            }, index * 300);
        });
    }, 300);
    
    getPhysioName(token);

    document.getElementById("loading-screen").classList.add("hidden");
};


function showSection(sectionClass) {
    document.querySelectorAll('.card').forEach(section => {

        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        section.classList.remove('active');

        setTimeout(() => {
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, 300);
    });
    
    document.querySelectorAll(`.${sectionClass}`).forEach(section => {
        section.classList.add('active');
    });
}


async function getPhysioName(token) {
    try {
        const response = await fetch("https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Physio", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            console.error("Error al obtener los datos del fisioterapeuta. Código de estado: " + response.status);
            return;
        }

        const data = await response.json();
        console.log("Datos del fisioterapeuta:", data);

        const container = document.getElementById('physioName-container');

        if (!container) {
            console.error("No se encontró un elemento con el ID 'physioName-container' en el DOM.");
            return;
        }

        if (data && data.length > 0) {
            const physio = data[0];

            const physioDiv = document.createElement('div');

            physioDiv.innerHTML = `
                <p><strong>Welcome ${physio.name}!</strong></p>
            `;

            container.appendChild(physioDiv);
        } else {
            console.error("No se encontraron fisioterapeutas en los datos.");
        }
    } catch (error) {
        console.error("Ocurrió un error al intentar obtener el nombre del fisioterapeuta:", error);
    }
}


async function fetchPatients(text) {
    try {
        const token = sessionStorage.getItem("jwtToken");
        
        if (!token) {
            console.error("Token no encontrado. Redirigiendo a la página de login.");
            window.location.href = "index.html";
            return;
        }


        const nameInputs = document.querySelectorAll('input[placeholder="Name"]');
        const firstSurnameInputs = document.querySelectorAll('input[placeholder="First Surname"]');
        const secondSurnameInputs = document.querySelectorAll('input[placeholder="Second Surname"]');
        const nifInputs = document.querySelectorAll('input[placeholder="NIF"]');

        function getInputValues(inputs) {
            return Array.from(inputs)
                .map(input => input.value.trim())
                .filter(value => value !== '');
        }

        const names = getInputValues(nameInputs);
        const firstSurnames = getInputValues(firstSurnameInputs);
        const secondSurnames = getInputValues(secondSurnameInputs);
        const nifs = getInputValues(nifInputs);

        let url = "https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Patient";

        let params = [];

        if (names.length > 0) {
            names.forEach(name => {
                params.push(`name=${encodeURIComponent(name)}`);
            });
        }

        if (firstSurnames.length > 0) {
            firstSurnames.forEach(firstSurname => {
                params.push(`firstSurname=${encodeURIComponent(firstSurname)}`);
            });
        }

        if (secondSurnames.length > 0) {
            secondSurnames.forEach(secondSurname => {
                params.push(`secondSurname=${encodeURIComponent(secondSurname)}`);
            });
        }

        if (nifs.length > 0) {
            nifs.forEach(nif => {
                params.push(`dni=${encodeURIComponent(nif)}`);
            });
        }

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });


        if (!response.ok) {
            Swal.fire({
            title: "No patients found",
            text: "Please, create a new patient",
            icon: "question"
            });
            return;
        }        

        const data = await response.json();

        if (data && Array.isArray(data)) {
            console.log("Pacientes recibidos:", data);
        
            const containers = document.querySelectorAll('#patients-container');
        
            containers.forEach(container => {
                container.innerHTML = '';
        
                const table = document.createElement('table');
                table.className = 'patients-table';
        
                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>First Surname</th>
                        <th>Second Surname</th>
                        <th>NIF</th>
                        <th>Birth Date</th>
                        <th>Select</th>
                    </tr>
                `;
                table.appendChild(thead);
        
                const tbody = document.createElement('tbody');
        
                data.forEach((patient, index) => {
                    const row = document.createElement('tr');
        
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${patient.name}</td>
                        <td>${patient.firstSurname}</td>
                        <td>${patient.secondSurname}</td>
                        <td>${patient.dni}</td>
                        <td>${patient.birthDate}</td>
                        <td><button class="btn btn-success action-button">Select</button></td>
                    `;
        
                    const button = row.querySelector('.action-button');
        
                    if (text === 'show') {
                        button.addEventListener('click', () => {
                            Swal.fire({
                                title: `${patient.name}, ${patient.firstSurname}, ${patient.secondSurname}`,
                                showCancelButton: true,
                                showDenyButton: true,
                                confirmButtonText: "Edit patient details",
                                confirmButtonColor: "#ff911c",
                                denyButtonText: "Delete patient",
                                }).then((result) => {
                                if (result.isConfirmed) {
                                    sessionStorage.setItem("patientToEdit", JSON.stringify(patient));
                                    window.location.href = "editPatientDetails.html";
                                } else if (result.isDenied) {
                                    deletePatient(patient.patientId);
                                }
                            });
                        });
                    }
        
                    if (text === 'addAssesment') {
                        button.addEventListener('click', () => {
                            addTreatment(patient.dni);
                        });
                    }

                    if (text === 'searchAssessment') {
                        button.addEventListener('click', () => {
                            searchTreatment(patient.patientId);
                        });
                    }
        
                    tbody.appendChild(row);
                });
        
                table.appendChild(tbody);
                container.appendChild(table);
            });
        } else {
            console.error("No se recibieron pacientes o el formato de respuesta es incorrecto");
        }
    } catch (error) {
        console.error("Error al obtener los pacientes:", error);
    }
}


async function fetchTreatments(patientId) {
    try {
        const token = sessionStorage.getItem("jwtToken");
        
        if (!token) {
            console.error("Token no encontrado. Redirigiendo a la página de login.");
            window.location.href = "index.html";
            return;
        }

        const treatmentCauseInputs = document.querySelectorAll('input[placeholder="Treatment Cause"]');
        const treatmentDateInputs = document.querySelectorAll('input[placeholder="Treatment Date"]');

        function getInputValues(inputs) {
            return Array.from(inputs)
                .map(input => input.value.trim())
                .filter(value => value !== '');
        }

        const treatmentCause = getInputValues(treatmentCauseInputs);
        const treatmentDate = getInputValues(treatmentDateInputs);

        let url = "https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment";

        let params = [];

        if (patientId) {
            params.push(`patientId=${encodeURIComponent(patientId)}`);
        }

        if (treatmentCause.length > 0) {
            treatmentCause.forEach(cause => {
                params.push(`treatmentCause=${encodeURIComponent(cause)}`);
            });
        }

        if (treatmentDate.length > 0) {
            treatmentDate.forEach(date => {
                params.push(`treatmentDate=${encodeURIComponent(date)}`);
            });
        }

        if (params.length > 0) {
            url += `?${params.join('&')}`;
        }

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });


        if (!response.ok) {
            console.error("Error al obtener los tratamientos. Código de estado: " + response.status);
            Swal.fire({
                title: "No treatments found",
                text: "Please, create a new treatment, or enter a different search criteria",
                icon: "question"
            }).then(() => {
                window.location.href = "privateZone.html";
            });
        }


        const data = await response.json();

        if (data && Array.isArray(data)) {
            console.log("Tratamientos recibidos:", data);

            const containers = document.querySelectorAll('#treatments-container');
        
            containers.forEach(container => {
                container.innerHTML = '';
        
                const table = document.createElement('table');
                table.className = 'treatments-table';
        
                const thead = document.createElement('thead');
                thead.innerHTML = `
                    <tr>
                        <th>#</th>
                        <th>Treatment Cause</th>
                        <th>Treatment Date</th>
                        <th>Select</th>
                    </tr>
                `;
                table.appendChild(thead);
        
                const tbody = document.createElement('tbody');

                data.forEach((treatment, index) => {
                    const row = document.createElement('tr');
        
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${treatment.treatmentCause}</td>
                        <td>${treatment.treatmentDate}</td>
                        <td><button class="btn btn-success display-button">Select</button></td>
                        <td><button class="btn btn-warning edit-button">Select</button></td>
                    `;

                    const displayButton = row.querySelector('.display-button');
                    displayButton.addEventListener('click', () => {
                        storageTreatment(treatment.treatmentId);
                    });

                    const editButton = row.querySelector('.edit-button');
                    editButton.addEventListener('click', () => {
                        Swal.fire({
                            title: `${treatment.treatmentCause}, ${treatment.treatmentDate}`,
                            showCancelButton: true,
                            showDenyButton: true,
                            confirmButtonText: "Edit treatment",
                            confirmButtonColor: "#ff911c",
                            denyButtonText: "Delete treatment"
                            }).then((result) => {
                                if (result.isConfirmed) {
                                    editTreatment(treatment.treatmentId);
                                    
                                } else if (result.isDenied) {
                                    deleteTreatment(treatment.treatmentId);
                                }
                            });
                    });
                    tbody.appendChild(row);
                });
        
                table.appendChild(tbody);
                container.appendChild(table);
            });
        } else {
            console.error("No se recibieron tratamientos o el formato de respuesta es incorrecto");
        }
    } catch (error) {
        console.error("Error al obtener los tratamientos:", error);
    }
}


async function addTreatment(dni) {
    try {
        const token = sessionStorage.getItem("jwtToken");

        if (!token) {
            console.error("Token no encontrado. Redirigiendo a la página de login.");
            window.location.href = "index.html";
            return;
        }

        const url = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Patient?dni=${encodeURIComponent(dni)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>'
            });
            return;
        }

        const patientData = await response.json();
        
        if (patientData && patientData.length > 0) {

            sessionStorage.setItem("patientData", JSON.stringify(patientData[0]));
        } else {

            Swal.fire({
            title: "No patient found",
            text: "No patient found with the provided NIF",
            icon: "question"
            });
            return;
        }

        window.location.href = "treatmentZone.html";

    } catch (error) {
        console.error("Error en la función addTreatment:", error);
    }
}


async function searchTreatment(patientId) {
    try {
        const token = sessionStorage.getItem("jwtToken");

        if (!token) {
            console.error("Token no encontrado. Redirigiendo a la página de login.");
            window.location.href = "index.html";
            return;
        }

        const url = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Patient?patientId=${encodeURIComponent(patientId)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>'
            });
            return;
        }

        const patientData = await response.json();
        
        if (patientData && patientData.length > 0) {

            sessionStorage.setItem("patientData", JSON.stringify(patientData[0]));
        } else {

            Swal.fire({
                title: "No patient found",
                text: "No patient found with the provided NIF",
                icon: "question"
            });
            return;
        }

        showSection('treatment-cards');
        fetchTreatments(patientId);
        console.log(`${patientId}`);

    } catch (error) {
        console.error("Error en la función searchTreatment:", error);
    }   
}


async function storageTreatment(treatmentId) {
    try {

        const token = sessionStorage.getItem("jwtToken");

        if (!token) {
            console.error("Token no encontrado. Redirigiendo a la página de login.");
            window.location.href = "index.html";
            return;
        }

    
        const url = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment?treatmentId=${encodeURIComponent(treatmentId)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const treatmentData = await response.json();

        sessionStorage.setItem("thisTreatment", JSON.stringify(treatmentData[0]));

    } catch (error) {
        console.error("Error en la función storageTreatment:", error);
    }   

    window.location.href = "displayTreatment.html";
}


async function editTreatment(treatmentId) {
    try {

        const token = sessionStorage.getItem("jwtToken");

        if (!token) {
            console.error("Token no encontrado. Redirigiendo a la página de login.");
            window.location.href = "index.html";
            return;
        }

    
        const url = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment?treatmentId=${encodeURIComponent(treatmentId)}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        const treatmentData = await response.json();

        sessionStorage.setItem("thisTreatment", JSON.stringify(treatmentData[0]));

    } catch (error) {
        console.error("Error en la función storageTreatment:", error);
    }   

    window.location.href = "editTreatment.html";
}


async function deletePatient(patientId) {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    try {
        const treatmentsResponse = await fetch(
            `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment?patientId=${patientId}`,
            {
                method: "GET",
                headers
            }
        );

        let treatments = [];

        if (treatmentsResponse.ok && treatmentsResponse.headers.get("content-type")?.includes("application/json")) {
            treatments = await treatmentsResponse.json();
        } else {
            console.warn("No se encontraron tratamientos o la respuesta no es JSON. Continuando con la eliminación.");
        }

        for (const treatment of treatments) {
            try {
                await silentDeleteTreatment(treatment.treatmentId);
            } catch (error) {
                console.error(`Error al eliminar el tratamiento con ID ${treatment.treatmentId}:`, error);
            }
        }

        const response = await fetch(
            `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Patient/${patientId}`,
            {
                method: "DELETE",
                headers
            }
        );

        if (!response.ok) {
            console.error("No se pudo eliminar el paciente:", response.status);
            Swal.fire({
                icon: "error",
                title: "No se pudo eliminar el paciente",
                text: "Verifica si todos los tratamientos fueron eliminados."
            });
            return;
        }

        Swal.fire({
            title: "Patient deleted successfully",
            icon: "success"
        });
        window.location.href = "privateZone.html";

    } catch (error) {
        console.error("Error en la función deletePatient:", error);
        Swal.fire({
            icon: "error",
            title: "Error inesperado",
            text: "No se pudo completar la eliminación del paciente."
        });
    }
}


async function sendForm() {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const name = document.querySelector('input[placeholder="Form Name"]').value;
    const firstSurname = document.querySelector('input[placeholder="Form First Surname"]').value;
    const secondSurname = document.querySelector('input[placeholder="Form Second Surname"]').value;
    const nif = document.querySelector('input[placeholder="Form NIF"]').value;
    const birthDate = document.getElementById("birthDate").value;

    const nifRegex = /^\d{8}$/;
    if (!nifRegex.test(nif)) {
        Swal.fire({
            icon: "warning",
            title: "Invalid NIF",
            text: "The NIF must contain exactly 8 numeric digits."
        });
        return;
    }

    const patientData = {
        name: name,
        firstSurname: firstSurname,
        secondSurname: secondSurname,
        dni: nif,
        birthDate: birthDate,
    };

    fetch('https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Patient', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(patientData)
    })
    .then(response => response.json())
    .then(data => {
        Swal.fire({
            title: "Patient created successfully",
            icon: "success"
        });
    })
    .catch(error => {
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Something went wrong!",
            footer: '<a href="#">Why do I have this issue?</a>'
        });
    });
}



async function deleteTreatment(treatmentId) {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    try {

        const muscularResponse = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/MuscularAssessment?treatmentId=${encodeURIComponent(treatmentId)}`, {
            method: "DELETE",
            headers
        });

        if (!muscularResponse.ok) {
            console.error("Error al eliminar evaluaciones musculares:", muscularResponse.status);
            alert("No se pudieron eliminar las evaluaciones musculares.");
            return;
        }


        const generalResponse = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/GeneralAssessment?treatmentId=${encodeURIComponent(treatmentId)}`, {
            method: "DELETE",
            headers
        });

        if (!generalResponse.ok) {
            console.error("Error al eliminar la evaluación general:", generalResponse.status);
            alert("No se pudo eliminar la evaluación general.");
            return;
        }


        const treatmentResponse = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment/${treatmentId}`, {
            method: "DELETE",
            headers
        });

        if (!treatmentResponse.ok) {
            console.error("Error al eliminar el tratamiento:", treatmentResponse.status);
            alert("No se pudo eliminar el tratamiento.");
            return;
        }


        Swal.fire({
            icon: "success",
            title: "Treatment deleted successfully"
        });


        window.location.href = "privateZone.html";

    } catch (error) {
        console.error("Error en la función deleteTreatment:", error);
        alert("Ocurrió un error inesperado al eliminar el tratamiento.");
    }
}


async function silentDeleteTreatment(treatmentId) {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };

    try {
        const muscularResponse = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/MuscularAssessment?treatmentId=${encodeURIComponent(treatmentId)}`, {
            method: "DELETE",
            headers
        });

        if (!muscularResponse.ok) {
            console.error("Error al eliminar evaluaciones musculares:", muscularResponse.status);
            return;
        }

        const generalResponse = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/GeneralAssessment?treatmentId=${encodeURIComponent(treatmentId)}`, {
            method: "DELETE",
            headers
        });

        if (!generalResponse.ok) {
            console.error("Error al eliminar la evaluación general:", generalResponse.status);
            return;
        }

        const treatmentResponse = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment/${treatmentId}`, {
            method: "DELETE",
            headers
        });

        if (!treatmentResponse.ok) {
            console.error("Error al eliminar el tratamiento:", treatmentResponse.status);
            return;
        }

    } catch (error) {
        console.error("Error en silentDeleteTreatment:", error);
    }
}




function popUserOptions() {
    Swal.fire({
        position: "top-end",
        title: "User Options",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonText: "Edit Profile",
        confirmButtonColor: "#ff911c",
        denyButtonText: "Log Off"
        }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "editPhysioDetails.html";
        } else if (result.isDenied) {
            logOff();
        }
    });
}


function logOff() {

    sessionStorage.clear();
    localStorage.clear();

    window.location.href = "index.html";

    return;
}

$(document).ready(function () {
  $('#birthDate').datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true
  });
});


function limpiarInputs() {
  const inputs = document.querySelectorAll('input');
  const textareas = document.querySelectorAll('textarea');
  const selects = document.querySelectorAll('select');

  inputs.forEach(input => {
    if (input.type !== 'button' && input.type !== 'submit' && input.type !== 'reset') {
      input.value = '';
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      }
    }
  });

  textareas.forEach(textarea => {
    textarea.value = '';
  });

  selects.forEach(select => {
    select.selectedIndex = 0;
  });
}

