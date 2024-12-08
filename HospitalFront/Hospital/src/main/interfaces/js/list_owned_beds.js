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

let thereArePatients = '';
const loadData = async () => {       
    await findPatientsWithoutBedAndNotDischarged(); 

    const patientSelect = document.getElementById("regPaciente");
    
    let patientContent = '';
    if (patientList.length === 0) {
        patientContent = `<option><small>No hay pacientes disponibles</small></option>`;
        thereArePatients = false;
    }else{
        patientList.forEach(item => {
            patientContent += `<option value="${item.id}">${item.fullName} ${item.lastname} ${item.surname} </option>`;
        });
        thereArePatients = true;
    }

    if(!thereArePatients){
        document.getElementById('insertPatientButton').disabled = true;
    }

    patientSelect.innerHTML = patientContent;
};

const getBedsByNurse = async () => {
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

        // Verificar si bedList no está vacío
        if (bedList.length > 0) {
            // Extraer el identificationName del único floor
            const floorName = bedList[0].floor.identificationName;

            // Guardar en localStorage
            localStorage.setItem('floorName', floorName);

            console.log('Nombre del piso guardado:', floorName);
        } else {
            console.log('No hay camas asociadas.');
        }
    }).catch(console.log);
};

const loadBeds = async () => {
    await getBedsByNurse();
    
    const cards = document.getElementById('bedsCards'); 
    let content = '';

    bedList.forEach((item, index) => {
        let occupied = item.isOccupied;

        let buttonHTML = '';
        let buttonFree = '';
        let buttonSee = '';
        if (occupied) {
            buttonHTML = `<button class="btn btn btn-success btn-sm mb-2" disabled>
                            <i class="bi bi-plus-lg"></i>
                          </button>`;

            buttonFree = `<button onclick="setBedId(${item.id})" data-bs-toggle="modal"
                            data-bs-target="#confirmFreeBedModal" class="btn btn btn-secondary btn-sm mb-3">
                                <i class="bi bi-escape"></i>
                            </button>`;

            buttonSee = `<button class="btn btn btn-primary btn-sm" data-bs-toggle="modal" data-bs-target="#infoModal" onclick="seeInfoPatient('${item.patient?.fullName || 'N/A'}', '${item.patient?.surname || 'N/A'}', '${item.patient?.lastname || 'N/A'}', '${item.patient?.phoneNumber || 'N/A'}', '${item.patient?.assignmentDate || 'N/A'}')">
                                <i class="bi bi-eye"></i>
                            </button>`
        } else {
            buttonHTML = `<button class="btn btn btn-success btn-sm mb-2" data-bs-toggle="modal"
                            data-bs-target="#registerModal" id="buttonRegister" onclick="setBedId(${item.id})">
                            <i class="bi bi-plus-lg"></i>
                          </button>`;
            buttonFree = `<button class="btn btn btn-secondary btn-sm mb-3" disabled>
                              <i class="bi bi-escape"></i>
                          </button>`;
            buttonSee = `<button class="btn btn btn-primary btn-sm" disabled>
                                <i class="bi bi-eye"></i>
                        </button>`
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
                            ${buttonFree}
                            ${buttonSee}
                        </div>
                    </div>`;
    });

    cards.innerHTML = content;
};

const freePatientAndBed = async () => {
    console.log("Bed ID seleccionado para LIBERAR: ", currentBedId);

    if (!currentBedId) {
        console.error("Cama no seleccionada. No se puede liberar.");
        return;
    }

    await freeBed(currentBedId); 
    location.reload();
};

function seeInfoPatient(name, surname, lastname, phoneNumber, assignmentDate){
    document.getElementById("infNombres").value = name;
    document.getElementById("infApellidoPaterno").value = surname; 
    document.getElementById("infApellidoMaterno").value = lastname;
    document.getElementById("infTelefono").value = phoneNumber;
    document.getElementById("infIngreso").value = assignmentDate;    
};

let currentBedId = null;

const setBedId = (bedId) => {
    currentBedId = bedId;
    console.log("Bed ID seleccionado: ", currentBedId);

    const selectedBed = bedList.find(bed => bed.id === bedId);
    if (selectedBed && selectedBed.patient) {
        document.getElementById('patientName').textContent = `${selectedBed.patient.fullName} ${selectedBed.patient.surname || ''} ${selectedBed.patient.lastname || ''}`;
    } else {
        document.getElementById('patientName').textContent = 'Paciente no asignado';
    }
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
        await loadBeds(); 
        document.getElementById("registerForm").reset();
        await sweetAlert('Operación exitosa', 'Paciente insertado correctamente', 'success');
    }).catch(error => {
        console.error("Error al registrar el paciente:", error);
    });
    location.reload();
};

const freeBed = async(id) => {
    try {
        const response = await fetch(`${URL}/api/bed/freeBed/${id}`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
        });

        if (response.ok) {
            await sweetAlert('Operación exitosa', 'Se liberó la cama y se dió de alta al paciente exitosamente', 'success');
            await loadCard(); 
        } else {
            await sweetAlert('Ocurrió un error', 'No se pudo liberar la cama y no se dió de alta al paciente', 'error');
        }
    } catch (error) {
        console.log('Ocurrió un error');
    }  
}

const sweetAlert = async(titulo, descripcion, tipo)=>{
    await Swal.fire({title: `${titulo}`, text: `${descripcion}`, icon:`${tipo}`})
}

const floorName = localStorage.getItem('floorName');
(async () => {
    if(role != 1){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    console.log(username)
    document.getElementById('numPiso').textContent = floorName;
    document.getElementById('userLogged').textContent = username;
    loadBeds();
    loadData();
})();







