let physioId = null;

window.onload = function () {
    const token = sessionStorage.getItem("jwtToken");

    if (!token) {
        window.location.href = "index.html";
        return;
    }

    getPhysioData(token);
};

async function getPhysioData(token) {
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

        if (data.length > 0) {
            const physio = data[0];

            // Guardamos el ID para usar en el PUT
            physioId = physio.physioId;

            document.getElementById("physioName").value = physio.name || "";
            document.getElementById("physioFirstSurname").value = physio.firstSurname || "";
            document.getElementById("physioSecondSurname").value = physio.secondSurname || "";
            document.getElementById("registrationNumber").value = physio.registrationNumber || "";
            document.getElementById("email").value = physio.email || "";
            document.getElementById("password").value = physio.password || "";
        }

    } catch (error) {
        console.error("Ocurrió un error al intentar obtener los datos", error);
    }
}

async function editPhysioData() {
    const token = sessionStorage.getItem("jwtToken");

    if (!physioId) {
        console.error("No se ha cargado el ID del fisioterapeuta.");
        return;
    }

    try {
        const response = await fetch(`https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Physio/${physioId}`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                physioId: physioId,
                name: document.getElementById("physioName").value,
                firstSurname: document.getElementById("physioFirstSurname").value,
                secondSurname: document.getElementById("physioSecondSurname").value,
                registrationNumber: document.getElementById("registrationNumber").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value
            })
        });

        if (!response.ok) {
            console.error("Error al editar los datos del fisioterapeuta. Código de estado: " + response.status);
            return;
        }

        const text = await response.text();

        window.location.href = "privateZone.html";

    } catch (error) {
        window.location.href = "privateZone.html";
    }
}


function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type");

    passwordInput.setAttribute("type", type === "password" ? "text" : "password");
}