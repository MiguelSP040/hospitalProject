/*
Corregir el obtener el id del piso de la sesión. Manejando id estático actualmente
*/
const URL = 'http://localhost:8080';
let nurseList = [];
let floorList = [];
let nurse = {};
let floor = {};

//Método para encontrar enfermeras por piso
//El parámetro de idFloor se obtiene de la sesión de la secretaria
const getNursesByFloorId = async () => {
    await fetch(`${URL}/api/floor/nurses/2`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        nurseList = response.data;
    }).catch(console.log());
}

//Método para encontrar enferemera por id
const findNurseById = async idNurse => {
    await fetch(`${URL}/api/user/${idNurse}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        nurse = response.data;
    }).catch(error => console.error(error));
}

//Método para cargar la información en las cards
const loadCards = async () => {
    await getNursesByFloorId();

    let tbody = document.getElementById("nursesCards");
    let content = '';
    nurseList.forEach((item) => {
        content += `<div class="col">
                        <div class="card h-100 d-flex flex-row">
                            <div class="card-body flex-grow-1">
                                <h4 class="card-title">${`${item.identificationName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</h4>
                                <p class="card-text">${item.email}<br>${item.phoneNumber}<br>${item.username}</p>
                            </div>
                            <div class="d-flex flex-column justify-content-start align-items-center p-3">
                                <button class="btn btn btn-primary btn-sm mb-2" data-bs-toggle="modal"
                                    data-bs-target="#updateModal" onclick="loadNurse(${item.id})">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn btn-secondary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#transferModal" onclick="loadData(${item.id})">
                                    <i class="bi bi-box-arrow-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
    });
    tbody.innerHTML = content;
}


(async () => {
    await loadCards();
})();

//Método para cargar la información de la enfermera en el updateModal
const loadNurse = async idNurse => {
    await findNurseById(idNurse);
    document.getElementById("updNombres").value = nurse.identificationName;
    document.getElementById("updApellidoPaterno").value = nurse.surname;
    document.getElementById("updApellidoMaterno").value = nurse.lastname;
    document.getElementById("updEmail").value = nurse.email;
    document.getElementById("updTelefono").value = nurse.phoneNumber;
    document.getElementById("updUsuario").value = nurse.username;
}

//Método para encontrar todos los pisos
const findAllFloors = async () => {
    await fetch(`${URL}/api/floor`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        floorList = response.data;
    }).catch(console.log());
}


//Método para cargar las opciones de pisos en el transferModal
let selectedNurseId; // Variable global para almacenar el id de la enfermera

const loadData = async (idNurse) => {
    selectedNurseId = idNurse; 
    await findNurseById(idNurse);
    await findAllFloors();

    let floorSelect = document.getElementById('floor');
    let content = '';
    if (floorList.length === 0) {
        content += `<option selected disabled>No hay pisos para escoger</option>`;
    } else {
        content = `<option value="${nurse.nurseInFloor?.id ?? null}" selected disabled hidden>${nurse.nurseInFloor?.identificationName ?? 'Selecciona un piso'}</option>`;
        floorList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName}</option>`;
        });
    }
    floorSelect.innerHTML = content;
    console.log("Lista de enfermeras", floorList);
    console.log("Floorselect", floorSelect);
}


//Método para transferir enfermera a otro piso
const changeFloorNurse = async (idNurse, idFloor) => {
    try {
        const response = await fetch(`${URL}/api/user/changeFloorNurse/${idNurse}/${idFloor}`, {
            method: 'PUT',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Transfer successful:', result);
        return result; 
    } catch (error) {
        console.error('Error transferring nurse:', error);
    }
};


const confirmTransfer = async () => {
    const floorSelect = document.getElementById('floor');
    const selectedFloorId = floorSelect.value; 

    if (!selectedNurseId || !selectedFloorId) {
        console.log('Por favor, seleccione una enfermera y un piso.');
        return;
    }

    try {
        await changeFloorNurse(selectedNurseId, selectedFloorId);
        console.log('Transferencia realizada con éxito.');
        await loadCards();
        const transferModal = bootstrap.Modal.getInstance(document.getElementById('transferModal'));
        transferModal.hide();
    } catch (error) {
        console.error('Error al transferir:', error);
    }
}

const saveNurse = async () => {
    let form = document.getElementById('registerForm');
    nurse = {
        identificationName: document.getElementById("regNombres").value,
        surname: document.getElementById("regApellidoPaterno").value,
        lastname: document.getElementById("regApellidoMaterno").value,
        email: document.getElementById("regEmail").value,
        phoneNumber: document.getElementById("regTelefono").value,
        username: document.getElementById("regUsuario").value,
        role:{
            id: 3
        }
    };

    await fetch(`${URL}/api/user`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nurse)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        nurse = {};
        await loadCards();
        form.reset();
    }).catch(console.log());
}


const updateNurse = async () => {
    let form = document.getElementById('updateForm');
    updated = {
        id: nurse.id,
        identificationName: document.getElementById("updNombres").value,
        surname: document.getElementById("updApellidoPaterno").value,
        lastname: document.getElementById("updApellidoMaterno").value,
        email: document.getElementById("updEmail").value,
        phoneNumber: document.getElementById("updTelefono").value,
        username: document.getElementById("updUsuario").value,
        nurseInFloor: {
            id: 1
        }
    };

    await fetch(`${URL}/api/user`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        nurse = {};
        await loadCards();
        form.reset();
    }).catch(console.log());
}