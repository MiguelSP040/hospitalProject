const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const role = localStorage.getItem('rol');
const username = localStorage.getItem('username')


let patientList = [];
let bedList = {};
let patient = {};

const findPatientsWithoutBedAndNotDischarged = async () => {
    await fetch(`${URL}/api/patient/withoutBed`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
        
    }).then(response => response.json()).then(response => {
        console.log(response);
        patientList=null;
        patientList=response.data;
    }).catch(console.log);
}


const loadData = async () => {       
    await findPatientsWithoutBedAndNotDischarged(); 

    const patientSelect = document.getElementById("regPaciente");

    let patientContent = '';
    if (patientList.length === 0) {
        patientContent = `<option><small>No hay pacientes disponibles</small></option>`;
    }else{
        patientList.forEach(item => {
            patientContent += `<option value="${item.id}">${item.fullName} ${item.lastname} ${item.surname} </option>`;
        });
    }

    patientSelect.innerHTML = patientContent;
};

const getBedsByNurse = async() => {
    await fetch(`${URL}/api/bed/findBedsByNurse/${username}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
        
    }).then(response => response.json()).then(response => {
        console.log(response);
        bedList = response.data;
    }).catch(console.log);
}

const loadBeds = async () => {
    await getBedsByNurse();
    
    const cards = document.getElementById('bedsCards'); 
    let content = '';

    bedList.forEach((item, index) => {
        let occupied = item.isOccupied;

        let buttonHTML = '';
        if (occupied) {
            buttonHTML = `<button class="btn btn btn-success btn-sm mb-2" disabled>
                            <i class="bi bi-plus-lg"></i>
                          </button>`;
        } else {
            buttonHTML = `<button class="btn btn btn-success btn-sm mb-2" data-bs-toggle="modal"
                            data-bs-target="#registerModal" id="buttonRegister" onclick="setBedId(${item.id})">
                            <i class="bi bi-plus-lg"></i>
                          </button>`;
        }

        content += `<div class="card h-100 d-flex flex-row">
                        <div class="card-body flex-grow-1">
                            <h4 class="card-title">${item.identificationName}</h4>
                            <input type="hidden" id="bedId" value="${item.id}">
                            <span class="badge ${occupied ? 'text-bg-success' : 'text-bg-secondary'}">
                                ${occupied ? 'Ingreso' : 'Disponible'}
                            </span>
                            <hr>
                            <div class="text-body-secondary">
                                Paciente: ${item.patient?.fullName || 'N/A'} ${item.patient?.surname || ''} ${item.patient?.lastname || ''}
                            </div>
                        </div>
                        <div class="d-flex flex-column justify-content-start align-items-center p-3">
                            ${buttonHTML}
                            <button onclick class="btn btn btn-secondary btn-sm mb-3">
                                <i class="bi bi-escape"></i>
                            </button>
                            <button class="btn btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal" onclick="loadBed()">
                                <i class="bi bi-eye"></i>
                            </button>
                        </div>
                    </div>`;
    });

    cards.innerHTML = content;
};

let currentBedId = null;

const setBedId = (bedId) => {
    currentBedId = bedId;
    console.log("Bed ID seleccionado: ", currentBedId);
};

const insertPatient = async () => {
    const patientId = document.getElementById('regPaciente').value;
    if (!patientId) {
        console.error("No se seleccionó ningún paciente.");
        return;
    }

    if (!currentBedId) {
        console.error("Cama no seleccionada. No se puede registrar el paciente.");
        return;
    }

    patient = {
        id: currentBedId, 
        patient: {
            id: patientId 
        }
    };

    console.log("Registrando paciente:", patient);

    await fetch(`${URL}/api/bed/insertPatient`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(patient)
    }).then(response => response.json()).then(async response => {
        console.log("Respuesta del servidor:", response);
        await loadBeds(); // Actualizar el estado de las camas.
        document.getElementById("registerForm").reset();
    }).catch(error => {
        console.error("Error al registrar el paciente:", error);
    });
};

const changePatientDischarged = async(id) => {
    await fetch(`${URL}/api/patient/${id}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
        
    }).then(response => response.json()).then(response => {
        console.log(response);
        bedList = response.data;
    }).catch(console.log);
}



(async () => {
    if(role != 1){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    console.log(username)
    loadBeds();
    loadData();
})();







