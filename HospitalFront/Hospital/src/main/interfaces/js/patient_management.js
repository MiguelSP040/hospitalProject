/*
Revisar retraso en actualización y registro
*/
const URL = 'http://localhost:8080';
let patientList = [];
let patient = {};
const role = localStorage.getItem('rol');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

//Método para obtener la lista de pacientes
const getAllPatients = async () => {
    await fetch(`${URL}/api/patient`, { 
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        patientList = response.data;
    }).catch(console.log());
}

//Método para insertar la lista de pacientes en el HTML
const loadTable = async () => {
    await getAllPatients(); // Assuming this fetches the patientList
    let tbody = document.getElementById("tbody");
    let content = '';

    for (const item of patientList) {
        const bedName = await fetchBedName(item.id); // Fetch the bed name for the patient
        content += `<tr style="background-color: ${item.discharged ? '#d3d3d3' : 'transparent'};">
                        <th scope="row">${patientList.indexOf(item) + 1}</th>
                        <td>${`${item.fullName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</td>
                        <td>${item.phoneNumber}</td>
                        <td><span class="badge text-bg-${item.discharged ? "secondary" : "success"}">${item.discharged ? "Alta" : "Ingresado"}</span></td>
                        <td>${item.discharged ? "N/A" : bedName ? bedName : "Sin cama asignada"}</td>
                        <td class="text-center">
                            <button class="btn btn-primary btn-sm ms-3" ${item.discharged ? "disabled" : ""} onclick="loadPatient(${item.id})" data-bs-target="#updateModal"
                                data-bs-toggle="modal">Editar</button>
                        </td>
                    </tr>`;
    }
    tbody.innerHTML = content;
};

//Función anónima para cargar la información de la tabla
(async () => {
    if(role != 1){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    document.getElementById('userLogged').textContent = username;
    await loadTable();
})();

//Método para cargar las opciones de camas en el select
/*const loadData = async () => {
    //await findAllBedsByFloor();
    let bedSelect = document.getElementById('regCama');
    let content = '';
    if (bedList.length === 0) {
        content += `<option selected disabled>No hay camas</option>`
    } else {
        content = `<option selected disabled hidden>Selecciona una cama</option>`;
        bedList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName}</option>`
        });
    }
    bedSelect.innerHTML = content;
}*/

//Método para buscar a los pacientes por id
const findPatientById = async id => {
    await fetch(`${URL}/api/patient/${id}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        console.log(response);
        patient = response.data;
    }).catch(console.log());
}

const originalValues = {};

const loadPatient = async id => {
    await findPatientById(id);
    document.getElementById("updNombres").value = patient.fullName;
    document.getElementById("updApellidoPaterno").value = patient.surname;
    document.getElementById("updApellidoMaterno").value = patient.lastname;
    document.getElementById("updTelefono").value = patient.phoneNumber;

    originalValues.updNombres = patient.fullName;
    originalValues.updApellidoPaterno = patient.surname;
    originalValues.updApellidoMaterno = patient.lastname;
    originalValues.updTelefono = patient.phoneNumber;

    toggleUpdateButtonState(); 
};

function toggleUpdateButtonState() {
    const isModified = 
        document.getElementById("updNombres").value !== originalValues.updNombres ||
        document.getElementById("updApellidoPaterno").value !== originalValues.updApellidoPaterno ||
        document.getElementById("updApellidoMaterno").value !== originalValues.updApellidoMaterno ||
        document.getElementById("updTelefono").value !== originalValues.updTelefono;

    document.querySelector("#updateModal .btn-primary").disabled = !isModified;
}

document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll("#updateForm input");

    inputs.forEach(input => {
        input.addEventListener("input", toggleUpdateButtonState);
    });
});

//Método para registrar un paciente
const savePatient = async () => {
    let form = document.getElementById('registerForm');

    patient = {
        fullName: document.getElementById("regNombres").value,
        surname: document.getElementById("regApellidoPaterno").value,
        lastname: document.getElementById("regApellidoMaterno").value,
        phoneNumber: document.getElementById("regTelefono").value
    };

    await fetch(`${URL}/api/patient`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(patient)
    }).then(response => response.json()).then(async response => {
        await sweetAlert('Operación exitosa', 'Se insertó al paciente exitosamente', 'success');
        patient = {};
        await loadTable();
        form.reset();
    }).catch(console.log());
}

//Método para actualizar un paciente
const updatePatient = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id: patient.id,
        fullName: document.getElementById("updNombres").value,
        surname: document.getElementById("updApellidoPaterno").value,
        lastname: document.getElementById("updApellidoMaterno").value,
        phoneNumber: document.getElementById("updTelefono").value
    };

    await fetch(`${URL}/api/patient`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        patient = {};
        await loadTable();
        form.reset();
        await sweetAlert('Operación exitosa', 'Se actualizó la información del paciente exitosamente', 'success');
    }).catch(console.log);
}

//Método para dar de alta a un paciente
const dischargePatient = async idPatient => {
    await fetch(`${URL}/api/patient/${idPatient}`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(async response => {
        patient = {};
        await loadTable();
    }).catch(console.log);
};

const fetchBedName = async (idPatient) => {    
    try {
        const response = await fetch(`${URL}/api/bed/findBedName/${idPatient}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`, // Añadir el token en las cabeceras
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const result = await response.json(); // Parse the response as JSON
        return result.data; // Return only the bed name
    } catch (error) {
        console.error(error.message);
        return "Sin cama asignada"; // Default value if fetching fails
    }
};

const sweetAlert = async(titulo, descripcion, tipo)=>{
    await Swal.fire({title: `${titulo}`, text: `${descripcion}`, icon:`${tipo}`})
}

document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("registerForm");
    const registerButton = registerForm.querySelector(".btn-primary");
    const inputs = registerForm.querySelectorAll("input");

    function toggleButtonState() {
        const allFilled = Array.from(inputs).every(input => input.value.trim() !== "");
        registerButton.disabled = !allFilled;
    }

    inputs.forEach(input => {
        input.addEventListener("input", toggleButtonState);
    });

    // Deshabilitar el botón inicialmente
    toggleButtonState();
});


function closeModal(){
    document.getElementById("updNombres").value = "";
    document.getElementById("updApellidoPaterno").value = "";
    document.getElementById("updApellidoMaterno").value = "";
    document.getElementById("updTelefono").value = "";
}