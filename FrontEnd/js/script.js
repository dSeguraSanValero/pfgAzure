(() => {
    'use strict'
  
    const forms = document.querySelectorAll('.needs-validation')
  
    Array.from(forms).forEach(form => {
      form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
          event.preventDefault()
          event.stopPropagation()
        }
  
        form.classList.add('was-validated')
      }, false)
    })
})()

function pinkBackground() {
  document.body.classList.remove('green-background');
  document.body.classList.add('pink-background');
}

function greenBackground() {
  document.body.classList.remove('pink-background');
  document.body.classList.add('green-background');
}

async function registerPhysio() {
  const name = document.getElementById('physioName').value;
  const firstSurname = document.getElementById('physioFirstSurname').value;
  const secondSurname = document.getElementById('physioSecondSurname').value;
  const email = document.getElementById('email').value;
  const registrationNumber = parseInt(document.getElementById('registrationNumber').value);
  const password = document.getElementById('password').value;

  const physioData = {
      name: name,
      firstSurname: firstSurname,
      secondSurname: secondSurname,
      email: email,
      registrationNumber: registrationNumber,
      password: password
  };

  try {
      const response = await fetch('https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Physio', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(physioData)
      });

      if (response.ok) {
          Swal.fire({
                title: "Your registration was successful",
                icon: "success"
          });
          document.getElementById('registerPhysioForm').reset();
      } else {
          const errorData = await response.json();
          Swal.fire({
              title: "Incorrect email format",
              text: "please, complete all the fields, or check the email format and try again.",
              icon: "error"
          });
      }
  } catch (error) {
      console.error('Error al enviar los datos:', error);
        Swal.fire({
            title: "Incorrect email format",
            text: "please, complete all the fields, or check the email format and try again.",
            icon: "error"
        });
  }
}

document.addEventListener("DOMContentLoaded", function () {

  const signInForm = document.querySelector("#nav-home form");

  signInForm.addEventListener("submit", function (event) {

      event.preventDefault();

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      console.log("Email:", email);
      console.log("Password:", password);

      loginPhysio(email, password);
  });
});

async function loginPhysio(email, password) {
    try {
        const response = await fetch("https://fisioscan-e6f8ehddembuhch9.westeurope-01.azurewebsites.net/Auth/login-fisioterapeuta", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
  
        if (!response.ok) {

            console.error("Error durante el login. Código de estado: " + response.status);
            return;
        }
  
        let data;
        try {
            data = await response.json();
        } catch (jsonError) {

            console.error("La respuesta no está en formato JSON:", jsonError);
            return;
        }
  
        if (data.token) {
            console.log("Token recibido:", data.token);
            sessionStorage.setItem("jwtToken", data.token);

            
    
            window.location.href = "privateZone.html";
        
        } else {
            console.error("No se recibió un token. Respuesta del servidor:", data);
        }
    } catch (error) {
        console.error("Error durante el login:", error);
    }
}

function togglePasswordVisibility() {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type");

    passwordInput.setAttribute("type", type === "password" ? "text" : "password");
}
  







