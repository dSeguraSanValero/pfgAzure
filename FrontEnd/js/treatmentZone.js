window.onload = function() {
    const token = sessionStorage.getItem("jwtToken");
    
    if (!token) {
        window.location.href = "index.html";
        return;
    }

    const patientData = sessionStorage.getItem("patientData");

    const patient = JSON.parse(patientData);

    const container = document.getElementById('patientName-container');

    const patientDiv = document.createElement('div');

    patientDiv.innerHTML = `
        <p><strong>Patient: ${patient.name} ${patient.firstSurname} ${patient.secondSurname}</strong></p>
    `;

    container.appendChild(patientDiv);

    showSection('date-card');

    document.getElementById("loading-screen").classList.add("hidden");

};

const slider = document.getElementById('slider');
const valor = document.getElementById('value');

slider.addEventListener('input', () => {
  valor.textContent = slider.value;
});

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
                <p><strong>¡Bienvenido ${physio.name}!</strong></p>
            `;

            container.appendChild(physioDiv);
        } else {
            console.error("No se encontraron fisioterapeutas en los datos.");
        }
    } catch (error) {
        console.error("Ocurrió un error al intentar obtener el nombre del fisioterapeuta:", error);
    }
}


async function createTreatment() {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const patientData = sessionStorage.getItem("patientData");
    const patient = JSON.parse(patientData);
    const patientId = patient.patientId;

    const formattedDate = document.getElementById("treatmentDate").value;
    const treatmentCause = document.getElementById("treatmentCause").value;

    const treatmentData = {
        patientId: patientId,
        treatmentCause: treatmentCause,
        treatmentDate: formattedDate,
    };

    fetch('https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Treatment', {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(treatmentData)
    })
    .then(async response => {
        const contentType = response.headers.get("Content-Type");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
        } else {
            const text = await response.text();
            console.log('Respuesta sin JSON:', text);
        }

        await storageTreatment();
    });
}



function createGeneralAssessment() {

    const token = sessionStorage.getItem("jwtToken");
        
    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const treatmentData = sessionStorage.getItem("treatmentResponse");

    console.log("Treatment response recuperada:", treatmentData);

    const treatment = JSON.parse(treatmentData);

    console.log("Tratamiento recuperado:", treatment);
    console.log("treatmentId:", treatment.treatmentId);

    const thisTreatmentId = treatment[0].treatmentId;

    console.log("thisTreatmentId:", thisTreatmentId);

    const generalAssessmentPainLevel = document.getElementById("slider").value;
    const generalAssessmentPhysicalActivity = document.querySelector('input[placeholder="Physical Activity"]').value;
    const generalAssessmentHeight = document.querySelector('input[placeholder="Height"]').value;
    const generalAssessmentWeight = document.querySelector('input[placeholder="Weight"]').value;
    const generalAssessmentOccupation = document.querySelector('input[placeholder="Occupation"]').value;
    const generalAssessmentMedicalHistory = document.querySelector('input[placeholder="Medical History"]').value;
    
    const generalAssessmentData = {
        treatmentId: thisTreatmentId,
        painLevel: generalAssessmentPainLevel,
        usualPhysicalActivity: generalAssessmentPhysicalActivity,
        height: generalAssessmentHeight,
        weight: generalAssessmentWeight,
        occupation: generalAssessmentOccupation,
        medicalHistory: generalAssessmentMedicalHistory,
    }

    fetch('https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/GeneralAssessment', {
    method: 'POST',
    headers: {
        "Authorization": `Bearer ${token}`,
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(generalAssessmentData)
    })
    .then(async response => {
        const contentType = response.headers.get("Content-Type");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
        } else {
            const text = await response.text();
            console.log('Respuesta sin JSON:', text);
        }
    })
}


function createMuscleAssessments() {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const treatmentData = sessionStorage.getItem("treatmentResponse");

    if (!treatmentData) {
        console.error("No se encontró treatmentResponse en sessionStorage.");
        return;
    }

    const treatment = JSON.parse(treatmentData);
    const thisTreatmentId = treatment[0].treatmentId;

    const muscleBlocks = document.querySelectorAll('.inputs-container .text-input');

    const fetchPromises = [];

    muscleBlocks.forEach(block => {
        const input = block.querySelector('input');
        const label = block.querySelector('label');

        if (input && label && input.value.trim() !== "") {
            const muscleName = label.getAttribute("for");
            const inputValue = input.value.trim();

            const muscleData = {
                treatmentId: thisTreatmentId,
                muscleName: muscleName,
                muscleAssessment: inputValue
            };

            console.log(`Enviando datos para ${muscleName}:`, muscleData);

            const fetchPromise = fetch('https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/MuscularAssessment', {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(muscleData)
            })
            .then(async response => {
                const contentType = response.headers.get("Content-Type");

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Error ${response.status}: ${errorText}`);
                }

                if (contentType && contentType.includes("application/json")) {
                    const data = await response.json();
                    console.log(`Respuesta del servidor para ${muscleName}:`, data);
                } else {
                    const text = await response.text();
                    console.log(`Respuesta sin JSON para ${muscleName}:`, text);
                }
            })
            .catch(error => {
                console.error(`Error al enviar datos para ${muscleName}:`, error);
            });

            fetchPromises.push(fetchPromise);
        }
    });

    Promise.all(fetchPromises).then(() => {
        Swal.fire({
            title: "Treatment created successfully",
            icon: "success"
        });
        window.location.href = "privateZone.html";
    });
}





async function storageTreatment() {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        console.error("Token no encontrado. Redirigiendo a la página de login.");
        window.location.href = "index.html";
        return;
    }

    const dateInput = document.getElementById("treatmentDate");
    const causeInput = document.getElementById("treatmentCause");

    if (!dateInput || !causeInput) {
        console.error("Elementos de fecha o causa no encontrados en el DOM.");
        return;
    }

    const rawDate = dateInput.value;
    const treatmentDate = formatDateToMMDDYYYY(rawDate);
    const treatmentCause = causeInput.value;

    const url = `https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net//Treatment?treatmentCause=${encodeURIComponent(treatmentCause)}&treatmentDate=${encodeURIComponent(treatmentDate)}`;

    await fetch(url, {
        method: "GET",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
    .then(async response => {
        const contentType = response.headers.get("Content-Type");

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        if (contentType && contentType.includes("application/json")) {
            const data = await response.json();
            console.log('Respuesta del servidor:', data);
            sessionStorage.setItem("treatmentResponse", JSON.stringify(data));
        } else {
            const text = await response.text();
            console.log('Respuesta sin JSON:', text);
            sessionStorage.setItem("treatmentResponseText", text);
        }
    })
    .catch(error => {
        console.error('Error al enviar los datos:', error.message);
    });
}



function showMuscle(muscleId) {
    document.querySelectorAll(`.${muscleId}`).forEach(section => {
        section.classList.add('active');
    });
}


function hideMuscle(muscleId) {
    document.querySelectorAll(`.${muscleId}`).forEach(section => {
        section.classList.remove('active');
    });
}


document.getElementById('rotateImage').addEventListener('click', function() {
    var img = document.getElementById('muscle-map');
    var svg = document.getElementById('muscle-svg');
    if (img.src.includes('images/back-muscles.png')) {
        img.src = 'images/back-muscles-2.png';

        const template = document.getElementById('back-muscle-svg-template');
        svg.innerHTML = template.innerHTML;
        

    } else {
        img.src = 'images/back-muscles.png';

        svg.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="768" height="768" viewBox="0 0 768 768">
                <path id="left-trapezius" class="muscle" onclick="showMuscle('left-trapezius')" d="M355,57s10.4,31.487-1,74c-8.2,37.931-17.291,65.379-47,88-15.106,9.752-45.173,31.785-51,34-38.534,12.565-68.854,31.113-94,35-11.247.985-27.341,14.2-28,15s0.062,13.94,1,16,14.081,21.746,46,41c27.887,24.2,50,43,50,43s-8.38,4.81-17,2,51.437,66.909,65,91c6.563,23.157,76.942,154.536,77,158s31.45,51.4,36,75c7.721,11.155,4-11,4-11s-1.136-25.856,3-31-2.574-18.757-3-20,3.06-23.974,4-27-1.671-10.825-5-19c1.306-14.761,5.523-17.823,5-23s-4-14-4-14-0.648-17.746,3-23c0.45-5.63-1-17-1-17s1.326-15.5,2-18,1.158-13.677,0-20,5-18,5-18-0.056-21.561-1-24,1.446-8.765,3-10-5.1-17.932-2-26,3.3-23.987-1-33c-0.813-14.51,4-23,4-23s-2.485-15.458-2-23,3.866-8.3,3-18-5.768-20.928-3-26,4.3-17.6-1-22,1.248-16.068,1-27-7.522-14.042-7-20-4.6-21.891-3-48c-1.088-27.329-7.911-113.978-9-121-0.469-3.4-8.183-2.564-8-12-5.3-6.746-23.284-3.323-25-1A1.75,1.75,0,0,0,355,57Z"/>
                <path id="right-supraespinatus" class="muscle" onclick="showMuscle('right-supraespinatus')" d="M525,320s12.487,12.388,46,8c17.139-2.049,42.383-16.536,88-9,2.2,8.559-23.265,18.237-31,21s-37.7,22.6-54,36c-18.79,12.813-37.113,22.2-52,11S515.936,335.2,525,320Z"/>
                <path id="right-splenius-cervicis" class="muscle" onclick="showMuscle('right-splenius-cervicis')" d="M455,177s-7,17.9-9,25-8.506,26.513-9,30c-1.458,4.161-5.819,16.152-6,17,1.325,5.929,13.357,17.876,16,24,3.471,5.836,17,30,17,30s7.063,16.532,8,18,60.32,98.279,8-1c-2.96-6.6-14.468-46.326-14-44s-10.278-37.485-10-56c-1.031-7.607,2.525-39.231,3-41S460.409,164.469,455,177Z"/>
                <path id="right-splenius-capitis" class="muscle" onclick="showMuscle('right-splenius-capitis')" d="M451,54s-3.63,18.949-17,34c-12.085,14.7-22,35-22,35l-10,19s0.226,13.528,2,19c0.049,1.8.214,4.987,0.444,8.878C404.584,179.156,407,208,407,208s0.349,16.61,14,32c0.943,0.911,5.649,9.531,9,9,2.7-7.138,3.992-8.4,7-21,7.069-21.55,17.22-52.213,18-54s10.5-27.54,34-68c3.443-5.98,10-22,10-22s2.954-2.912-9-10-19.013-12.914-27-16S455.37,52.667,451,54Z"/>
                <path id="right-levator-scapulae" class="muscle" onclick="showMuscle('right-levator-scapulae')" d="M470,165s11,40.8,12,44,11.7,44.467,13,47,14.7,40.461,18,46,7.746,15.235,11,17c-0.213,2.805-5.427,13.224-6,15s-7.069,15.2-5,39c0.449,5.169-3.066,1.455-4-1s-11.752-21.4-13-25-12.663-18.628-17-32c-2.74-8.447-8.937-28.023-10-32s-8.817-32.463-10-50c-0.442-6.546-3.869-30.276,1-55C462.808,163.739,468.862,145.085,470,165Z"/>
                <path id="left-deltoid" class="muscle" onclick="showMuscle('left-deltoid')" d="M154,286s-7.276-11.061-41-9c-9.621.588-25.119,3.176-34,6s-23.941,9.509-25,11-0.847,13.42-2,19-12,17-12,17-10.128,15.741-11,19-4.94,29.334-5,32-1.835,13.97,21,20c15.519,6.148,12,19,12,19s-15.182,10.751-23,16c-0.266,8.789-1.846,11.759-2,17,1.734,2.055,3.994-.563,9,7,11.613,0.247,28.545-4.695,33-6s27.672,0.661,34,0,17.994,0.555,46-6,63.043-13.3,77-10c9.385,1.981-27.616-41.325-32-44-5.439-4.521-13.534-16.842-29-22-13.62-10.609-29.408-14.2-50-19-6.085-4.27-16.99-7.815-18-22-3.032-7.415-8.659-12.8-12-16s0.35-15.2,8-19S146,286.264,154,286Z"/>
                <path id="left-infraespinatus" class="muscle" onclick="showMuscle('left-infraespinatus')" d="M152,450s18.894,41.541,23,47c3.718,6.766,25.312,57.931,46,70,19.373,2.858,42,1,42,1s22.1-28.106,22-36-1.621-29.546-21-55c-6.9-9.127-15.2-22.915-26-34-2.144-.77-6.919-6.6-27-4C199.259,439.408,157.357,447.93,152,450Z"/>
                <path id="right-infraespinatus" class="muscle" onclick="showMuscle('right-infraespinatus')" d="M691,343s-0.417-4.189-34,6c-12.079,4.932-22.364,6.679-34,19s-17.267,18.918-20,20a134.056,134.056,0,0,1-33,9c-18.845,3.912-22.672,10.346-27,20s-4.091,31.751-4,39,7.869,36.739,11,45,10.9,34.329,14,41,7.888,18.619,16,25c1.54,0.757,28-26,28-26s13.6-22.628,18-29,25.3-32.342,29-40,12.359-13.046,18-26-1-9-1-9-2.872,8.044-5,11,0.785-19.463,0-19,0.957-29.656-4-39c2.619-4.826,10-9,10-9s8.216-5.9,10-16c2.826,0.053,9-2,9-2s0.236-1.9-7-1C687.633,357.755,688.706,356.484,691,343Z"/>
                <path id="left-teres-major" class="muscle" onclick="showMuscle('left-teres-major')" d="M151,451s-22.312,1.359-33,7c4.048,10.658,26,43,26,43s25.05,34.368,33,41,14.2,15.736,40,24a2.962,2.962,0,0,0,0-2s-14.525-11.725-26-34c-5.8-9.421-17.6-36.275-22-42S155.625,456.174,151,451Z"/>
                <path id="right-teres-major" class="muscle" onclick="showMuscle('right-teres-major')" d="M667,458s12.295-1.481,22,11c-4.863,7.531-36.06,49-51,63-17.957,17.088-32.781,21.079-46,35-7.325,1.151-9,0-9,0a61.713,61.713,0,0,1,9-10c5.48-4.864,15.984-13.395,21-23s15.758-26.648,26-38C644.919,487.073,663.1,461.281,667,458Z"/>
                <path id="right-rhomboid-major" class="muscle" onclick="showMuscle('right-rhomboid-major')" d="M575,567s-28.716-36.579-32-55-4.918-25.173-9-60c-12.071-10.613-43-48-43-48s-13.177-16.864-17-24c-6.492-8.766-16-24-16-24s-20.149-39.89-22-43c-1.5-3.764-3.728-12.124-12-22-1.508-4.383-4.826-8.116-8-9,0,2.292-1,10-1,10s5.712,16.378,1,28c-2.227,5.753,2.52,19.1,2,22,1.171,3.072,1.538,15.7-4,23a45.834,45.834,0,0,0,3,20,26.162,26.162,0,0,1-2,21c12.963,16.251,23.531,39.944,31,48,8.182,14.235,54.685,61.5,65,69S559.91,562.366,575,567Z"/>
                <path id="right-rhomboid-minor" class="muscle" onclick="showMuscle('right-rhomboid-minor')" d="M415,236s9.232,6.714,31,38c3.528,5.071,19.029,33.012,23,42s20.806,34.468,22,37,16.489,22.543,24,28c3.163,7.359,9.752,42.356,13,47,2.336,5.6,5.75,16.124,6,22-11.644-10.12-26-28-26-28s-27.468-32.722-35-46c-18.036-27.124-27.726-45.346-33-58s-17.037-34.849-24-37c-0.453-4.222-1.2-12.138-3-16-1.008-5.87,0-16,0-16s1.761-12.015,0-13h2Z"/>
                <path id="right-semispinalis-capitis" class="muscle" onclick="showMuscle('right-semispinalis-capitis')" d="M398,61s18.012-19.287,51-7c0.629,1.484-1.188,9.967-3,14s-14.879,23.46-19,28-12.92,20.719-15,25-6.874,12.712-9,18-4.787-18.523-5-23S396.43,70.754,398,61Z"/>
                <path id="left-sternocleidomastoid" class="muscle" onclick="showMuscle('left-sternocleidomastoid')" d="M349,60s1.043-2.886-5-2-41.446,1.43-46,13,5,41,5,41,10.2,45.069,10,49,2.9,42.039,3,45-0.41,9.048,6,0,5.29-27.231,7-34,5.188-48.7,5-53,4.081-41.165,7-46C342.118,66.964,346.2,63.8,349,60Z"/>
                <path id="right-serratus-posterior" class="muscle" onclick="showMuscle('right-serratus-posterior')" d="M509,583s-65.165,30.5-71,54-16.371,49.974-11,96c40.765,0.137,101,0,101,0s-20.459-16.176-28-18,0-7,0-7,14.853-8.829,23-8-20-13.441-12-31c-7.017-1.92-9-1-9-1s18.712-11.82,30-11-11.044-10.77-22-29c12.5-7.324,34.982-12.824,40-11S517.643,600.7,509,583Z"/>
                <path id="right-serratus-anterior" class="muscle" onclick="showMuscle('right-serratus-anterior')" d="M573,570s-0.521,9.166,36,66c3.141-1.468,6.8,4.129,20-43,3.823-6.277,8-13,8-13a35.783,35.783,0,0,1-3-6c0.147-6.014,2-7,2-7a20.946,20.946,0,0,0-2-6c-1.4-2.393,3-5,3-5s-1.813-5.8,1-9c-0.463-2.882,0-10,0-10s-2.111-5.053-11,6c-11.157,7.273-21,13-21,13s-10.974,8.324-12,11S578.922,566.724,573,570Z"/>
                <path id="left-latissimus-dorsi" class="muscle" onclick="showMuscle('left-latissimus-dorsi')" d="M393,733s-14.57-39.353-20-45-42.35-82.2-46-88-8.383-26.826-30-28c-16.735-2.331-38.912-4.569-62-3-10.08-1.249-27.328-2.676-37-10s-27.789-17.167-41-40c-7.319-7.681-39.107-55.373-40-62-0.782-.831-4.577-1.1-4,2,1.647,3.156,14.3,27.406,17,33s13.463,29.373,30,53,23.88,50.671,25,55a140.416,140.416,0,0,1,6,42c-0.254,22.206,9,91,9,91H393Z"/>
            </svg>
        `;
    }
});


function formatDateToMMDDYYYY(dateString) {
    const date = new Date(dateString);
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${mm}-${dd}-${yyyy}`;
}


function updateFormattedDate() {
    const rawDate = document.getElementById("treatmentDate").value;
    const preview = document.getElementById("formattedDatePreview");
    if (rawDate) {
        preview.textContent = formatDateToMMDDYYYY(rawDate);
    } else {
        preview.textContent = "None";
    }
}


$(document).ready(function () {
  $('#treatmentDate').datepicker({
    format: 'mm-dd-yyyy',
    autoclose: true,
    todayHighlight: true
  });
});


