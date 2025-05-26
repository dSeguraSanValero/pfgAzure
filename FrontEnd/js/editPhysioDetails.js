window.onload = function() {
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

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type");

    passwordInput.setAttribute("type", type === "password" ? "text" : "password");
}