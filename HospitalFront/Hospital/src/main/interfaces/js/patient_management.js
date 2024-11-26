const URL = 'http://localhost:8080';
let patientList = [];
let patient = {};

//Método para obtener la lista de pacientes
const getAllPatients = async () => {
    await fetch (`${URL}/api/patient`,{
        method : 'GET',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        }
    }).then(response => response.json()).then(response =>{
        //ToDo
        patientList = response.data;
    }).catch(console.log());
}

//Método para insertar la lista de pacientes en el HTML
const loadTable = async () => {
    await getAllPatients();
    
    let tbody = document.getElementById("tbody");
    let content ='';
    patientList.forEach((item, index)=>{
        content += `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${`${item.fullName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</td>
                        <td>${item.phoneNumber}</td>
                        <td><span class="badge text-bg-${item.discharged ? "danger" : "success"}">${item.discharged ? "Alta" : "Ingreso"}</td>
                        
                        <td class="text-center">
                            <button class="btn btn-outline-danger btn-sm me-3 ${item.discharged ? "disabled" : ""}" onclick="dischargePatient(${item.id})">Alta</button>
                            <button class="btn btn-secondary btn-sm ms-3" onclick="loadPatient(${item.id})" data-bs-target="#updateModal"
                                data-bs-toggle="modal">Editar</button>
                        </td>
                    </tr>`;
    });
    tbody.innerHTML = content;
}

//Función anónima para cargar la información de la tabla
(async () =>{
    await loadTable();
})();

//Método para buscar a los pacientes por id
const findPatientById = async id => {
    await fetch (`${URL}/api/patient/${id}`,{
        method : 'GET',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        }
    }).then(response => response.json()).then(response =>{
        //ToDo
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
}

//Método para registrar un paciente
const savePatient = async () => {
    let form = document.getElementById('registerForm');
    patient = {
        fullName : document.getElementById("regNombres").value,
        surname : document.getElementById("regApellidoPaterno").value,
        lastname : document.getElementById("regApellidoMaterno").value,
        phoneNumber : document.getElementById("regTelefono").value
    };

    await fetch(`${URL}/api/patient`, {
        method : 'POST',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify(patient)
    }).then(response => response.json()).then(async response => {
        patient = {};
        await loadTable();
        form.reset();
    }).catch(console.log);
}

//Método para registrar un paciente
const updatePatient = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id : patient.id,
        assignmentDate : patient.assignmentDate,
        isDischarged : patient.isDischarged,
        fullName : document.getElementById("updNombres").value,
        surname : document.getElementById("updApellidoPaterno").value,
        lastname : document.getElementById("updApellidoMaterno").value,
        phoneNumber : document.getElementById("updTelefono").value
    };

    await fetch(`${URL}/api/patient`, {
        method : 'PUT',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        patient = {};
        await loadTable();
        form.reset();
    }).catch(console.log);
}

//Método para dar de alta a un paciente
const dischargePatient = async idPatient => {
    await fetch(`${URL}/api/patient/${idPatient}`, {
        method : 'PUT',
        headers : {
            "Accept" : "application/json"
        }
    }).then(response => response.json()).then(async response => {
        patient = {};
        await loadTable();
    }).catch(console.log);
};
