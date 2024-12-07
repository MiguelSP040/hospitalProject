const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const role = localStorage.getItem('rol');

let userList = [];
let bedList = []
let bed = {};
let floorList = [];
let floor = {};

//Método para obtener la lista de beds
const findAllBeds = async () => {
    await fetch(`${URL}/api/bed`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        bedList = response.data;
    }).catch(error => console.error(error));
};

// Método para obtener las camas de un piso específico
const getBedsByFloorId = async (idFloor) => {
    await fetch(`${URL}/api/bed/bedOnFloor/${idFloor}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        bedList = response.data;
    }).catch(error => console.error(error));
}


// Método para insertar las cards de camas en el cuerpo HTML
const loadCards = async () => {
    let selectedFloorId = document.getElementById('selectFloor').value;

    // Verificar si un piso ha sido seleccionado
    await findAllBeds()
    await getBedsByFloorId(selectedFloorId)

    let bedCards = document.getElementById("bedCards");
    let content = '';
    bedList.forEach((item, index) => {
        let nurseName = "Sin asignar";
        if (item.hasNurse && item.floor && item.floor.nurses && item.floor.nurses.length > 0) {
            nurseName = item.floor.nurses[0].identificationName;
        }
        content += `
        <div class="col">
            <div class="card h-100 d-flex flex-row">
                <div class="card-body flex-grow-1">
                    <h4 class="card-title">${item.identificationName || `Cama ${index + 1}`}</h4>
                    <hr>
                    <div class="text-body-secondary">
                        Enfermera: ${nurseName}
                    </div>
                </div>
                <div class="d-flex flex-column justify-content-start align-items-center p-3">
                    <button class="btn btn-primary btn-sm mb-2" onclick="loadBeds(${item.id})"
                        data-bs-target="#updateModal" data-bs-toggle="modal">
                        <i class="bi bi-pencil"></i> 
                    </button>
                </div>
            </div>
        </div>`;
    });
    bedCards.innerHTML = content;
};

// Función anónima para cargar la información de las cards
(async () => {
    if(role != 3){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    await loadCards();
})();

//Método para obtener camas por id
const findBedById = async idBed => {
    await fetch(`${URL}/api/bed/${idBed}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        console.log(response);
        bed = response.data;
    }).catch(error => console.error(error));
}

//Método para obtener la información de la bed a editar
const loadBeds = async (id) => {
    await findBedById(id);
    await findAllFloors();

    document.getElementById("updNombre").value = bed.identificationName;
    let select = document.getElementById("updFloor");
    let content = '';

    const currentFloorId = bed.floor?.id ?? null;
    const currentFloorName = bed.floor?.identificationName ?? 'Selecciona un piso';

    content = `<option value="${currentFloorId}" selected>${currentFloorName}</option>`;

    if (floorList.length === 0) {
        content += `<option disabled>No hay pisos disponibles</option>`;
    } else {
        floorList.forEach(item => {
            if (item.id !== currentFloorId) {
                content += `<option value="${item.id}">${item.identificationName}</option>`;
            }
        });
    }
    select.innerHTML = content;
};


const loadFloors = async (idFloor) => {
    await findAllFloors();
    let floorSelect = document.getElementById('selectFloor');
    let content = '';
    if (floorList.length === 0) {
        content += `<option selected disabled>No hay pisos para escoger</option>`;
    } else {
        content = `<option selected disabled hidden>Cambiar de piso</option>`;
        floorList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName}</option>`;
        });
    }
    floorSelect.innerHTML = content;

    floorSelect.addEventListener('change', updateSelectedFloor);

    if (idFloor) {
        await getBedsByFloorId(idFloor);
    }
};


// Función para actualizar el texto del numPiso
const updateSelectedFloor = () => {
    const floorSelect = document.getElementById('selectFloor');
    const selectedFloorName = floorSelect.options[floorSelect.selectedIndex].text;
    const numPisoElement = document.getElementById('numPiso');
    numPisoElement.textContent = selectedFloorName;
};


//Método para cargar la lista de pisos
const findAllFloors = async () => {
    await fetch(`${URL}/api/floor`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        floorList = response.data;
    }).catch(error => console.error(error));
}

//Método para cargar las opciones de pisos en el registro de camas
const loadData = async () => {
    await findAllFloors();
    let floorSelect = document.getElementById('regFloor');
    let content = '';
    if (floorList.length === 0) {
        content += `<option selected disabled>No hay pisos para escoger</option>`
    } else {
        content = `<option selected disabled hidden>Selecciona un piso</option>`;
        floorList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName}</option>`
        });
    }
    floorSelect.innerHTML = content;
}

//Método para registrar una nueva cama
const saveBed = async () => {
    let form = document.getElementById('registerForm');
    bed = {
        identificationName: document.getElementById("regNombre").value,
        floor: {
            id: document.getElementById('regFloor').value
        }
    };

    await fetch(`${URL}/api/bed`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(bed)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        bed = {};
        await loadTable();
        form.reset();
    }).catch(console.log());
}

//Método para editar bed
const updateBed = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id: bed.id,
        identificationName: document.getElementById("updNombre").value,
        floor: {
            id: document.getElementById('updFloor').value
        },
    };

    await fetch(`${URL}/api/bed`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        bed = {};
        await loadCards();
        form.reset();
    }).catch(error => console.error(error));
};
