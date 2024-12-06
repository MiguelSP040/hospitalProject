/*
Falta registrar, editar y transferir
*/
const URL = 'http://localhost:8080';
let nurseList = [];
let floorList = [];
let nurse = {};
let floor = {};

//Método para encontrar enfermeras por piso
//El parámetro de idFloor se obtiene de la sesión de la secretaria
const getNursesByFloorId = async () => {
    await fetch(`${URL}/api/floor/nurses/1`, {
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
let selectedNurseId; // Global variable to store the nurse ID

const loadData = async (idNurse) => {
    selectedNurseId = idNurse; // Save the idNurse globally
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
        const response = await fetch(`${URL}/changeFloorNurse/${idNurse}/${idFloor}`, {
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
        return result; // Return the result in case it needs to be used
    } catch (error) {
        console.error('Error transferring nurse:', error);
        throw error; // Re-throw the error to handle it where the function is called
    }
};


const confirmTransfer = async () => {
    const floorSelect = document.getElementById('floor');
    const selectedFloorId = floorSelect.value; // Get selected floor ID

    if (!selectedNurseId || !selectedFloorId) {
        alert('Por favor, seleccione una enfermera y un piso.');
        return;
    }

    try {
        await changeFloorNurse(selectedNurseId, selectedFloorId);
        alert('Transferencia realizada con éxito.');
        // Optionally, refresh the cards or close the modal
        await loadCards();
        const transferModal = bootstrap.Modal.getInstance(document.getElementById('transferModal'));
        transferModal.hide();
    } catch (error) {
        console.error('Error al transferir:', error);
        alert('Hubo un problema al realizar la transferencia.');
    }
}

/*
const savePet = async () => {
    let form = document.getElementById('saveForm');
    let modal = new bootstrap.Modal(document.getElementById('saveModal'))
    pet = {
        nickname: document.getElementById("nickname").value,
        owner: {
            id: document.getElementById('ownerList').value
        },
        type: {
            id: document.getElementById('typeList').value
        }
    };

    await fetch(`${URL}/api/petShop`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(pet)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        pet = {};
        await loadTable();
        form.reset();
    }).catch(console.log);
}

const updatePet = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        nickname: document.getElementById("u_nickname").value,
        owner: pet.owner,
        type: {
            id: document.getElementById('u_typeList').value
        }
    };

    await fetch(`${URL}/api/pet/${pet.id}`, {
        method: 'PUT',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        pet = {};
        await loadTable();
        form.reset();
    }).catch(console.log);
}

const deletePet = async () => {
    await fetch(`${URL}/api/pet/${pet.id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },

    }).then(response => response.json()).then(async response => {
        console.log(response);
        pet = {};
        await loadTable();
    }).catch(console.log);
}*/