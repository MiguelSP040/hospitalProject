/*
Pendiente: 
Revisar el método actualizar, hay un retraso entre la actualización de información y actualización de tabla en vista
Falta comprobar la asignación de camas en registro y actualización
*/
const URL = 'http://localhost:8080';
let patientList = [];
let patient = {};
let bedList = [];
let bed = {};

//Método para obtener la lista de pacientes
const getAllPatients = async () => {
    const timestamp = new Date().getTime(); // Genera un número único
    await fetch(`${URL}/api/patient?_=${timestamp}`, { 
        method: 'GET',
        headers: {
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
                        <td><span class="badge text-bg-${item.discharged ? "secondary" : "success"}">${item.discharged ? "Alta" : "Ingreso"}</span></td>
                        <td>${item.discharged ? "N/A" : bedName ? bedName : "Sin cama asignada"}</td>
                        <td class="text-center">
                            <button class="btn btn-secondary btn-sm me-3" ${item.discharged ? "disabled" : ""} onclick="dischargePatient(${item.id})">Alta</button>
                            <button class="btn btn-primary btn-sm ms-3" ${item.discharged ? "disabled" : ""} onclick="loadPatient(${item.id})" data-bs-target="#updateModal"
                                data-bs-toggle="modal">Editar</button>
                        </td>
                    </tr>`;
    }
    tbody.innerHTML = content;
};

//Función anónima para cargar la información de la tabla
(async () => {
    await loadTable();
})();

//Método para pintar la información del piso en la card
const loadInfo = async id => {
    await findPatientById(id);
    document.getElementById("updNombres").value = floor.identificationName;
    let select = document.getElementById("updSecretary");
    content = '';
    secretaryList.forEach(item => {
        content += `<option value="${item.id}">${`${item.fullName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</option>`
    });
    select.innerHTML = content;
    select.value = floor.secretary.id;
}

//Método para cargar la lista de camas por piso
const findAllBedsByFloor = async () => {
    await fetch(`${URL}/api/...`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response =>response.json()).then(response =>{
        //ToDo
        roleList = response.data;
    }).catch(error => console.error(error));
}
//Revisar

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
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        console.log(response);
        patient = response.data;
    }).catch(console.log());
}

//Método para pintar la información del paciente en el updateModal
const loadPatient = async id => {
    await findPatientById(id);
    document.getElementById("updNombres").value = patient.fullName;
    document.getElementById("updApellidoPaterno").value = patient.surname;
    document.getElementById("updApellidoMaterno").value = patient.lastname;
    document.getElementById("updTelefono").value = patient.phoneNumber;
    /*
    let select = document.getElementById("updCama").value;
    content = '';
    bedList.forEach(item => {
        content += `<option value="${item.id}">${item.identificationName}</option>`
    });
    select.innerHTML = content;
    select.value = patient.bed;*/
}

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
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(patient)
    }).then(response => response.json()).then(async response => {
        patient = {};
        await loadTable();
    }).catch(console.log);
}

//Método para actualizar un paciente
const updatePatient = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id: patient.id,
        assignmentDate: patient.assignmentDate,
        isDischarged: patient.isDischarged,
        fullName: document.getElementById("updNombres").value,
        surname: document.getElementById("updApellidoPaterno").value,
        lastname: document.getElementById("updApellidoMaterno").value,
        phoneNumber: document.getElementById("updTelefono").value
    };

    await fetch(`${URL}/api/patient`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        patient = {};
        await loadTable();
    }).catch(console.log);
}

//Método para dar de alta a un paciente
const dischargePatient = async idPatient => {
    await fetch(`${URL}/api/patient/${idPatient}`, {
        method: 'PUT',
        headers: {
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(async response => {
        patient = {};
        await loadTable();
    }).catch(console.log);
};

const fetchBedName = async (idPatient) => {
    try {
        const response = await fetch(`${URL}/api/bed/findBedName/${idPatient}`);
        if (!response.ok) throw new Error("Error fetching bed name");
        const result = await response.json(); // Parse the response as JSON
        if (result.code !== 200) throw new Error(result.message || "Unexpected error");
        return result.data; // Return only the bed name
    } catch (error) {
        console.error(error.message);
        return "Sin cama asignada"; // Default value if fetching fails
    }
};
