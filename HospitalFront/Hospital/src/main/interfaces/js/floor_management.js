const URL = 'http://localhost:8080';
let floorList = [];
let secretaryList = [];
let floor = {};

//Método para obtener la lista de pisos
const findAllFloors = async () => {
    await fetch(`${URL}/api/floor`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        console.log(response);
        floorList = response.data;
    }).catch(error => console.error(error));
}

//Método para contar las camas por piso
const getBedsOnFloor = async (idFloor) => {
    try {
        const response = await fetch(`${URL}/api/floor/beds/${idFloor}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        
        const result = await response.json();

        // Check if the response directly contains nurses, not floors
        const bedList = Array.isArray(result.data) ? result.data : [];

        // Count nurses directly if they're not grouped by floor
        return { bedList, count: bedList.length };
    } catch (error) {
        console.error("Error al obtener las camas del piso:", error.message);
        return { bedList: [], count: 0 };
    }
};


const countNurses = async (idFloor) => {
    try {
        const response = await fetch(`${URL}/api/floor/nurses/${idFloor}`);
        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }
        const result = await response.json();

        // Check if the response directly contains nurses, not floors
        const nursesList = Array.isArray(result.data) ? result.data : [];

        // Count nurses directly if they're not grouped by floor
        return { nursesList, count: nursesList.length };
    } catch (error) {
        console.error("Error al obtener las enfermeras del piso:", error.message);
        return { nursesList: [], count: 0 };
    }
};


const loadCards = async () => {
    await findAllFloors();
    const tbody = document.getElementById("floorCards");
    tbody.innerHTML = "";

    const promises = floorList.map(async (item) => {
        const [bedsResult, nursesResult] = await Promise.all([
            getBedsOnFloor(item.id),
            countNurses(item.id),
        ]);

        return `
            <div class="col">
                <div class="card h-100 d-flex flex-row">
                    <div class="card-body flex-grow-1">
                        <h4 class="card-title">${item.identificationName}</h4>
                        Camas <span class="badge text-bg-secondary">${bedsResult.count}</span><br>
                        Enfermeras <span class="badge text-bg-secondary">${nursesResult.count}</span>
                        <hr>
                        <div class="text-body-secondary">
                            ${item.secretary?.identificationName || 'Sin secretario asignado'}
                            ${item.secretary?.surname || ''} 
                            ${item.secretary?.lastname || ''}
                        </div>
                    </div>
                    <div class="d-flex flex-column justify-content-start align-items-center p-3">
                        <button type="button" class="btn btn-primary btn-sm mb-2" 
                                onclick="loadFloor(${item.id})" data-bs-target="#updateModal" data-bs-toggle="modal">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
                </div>
            </div>`;
    });

    tbody.innerHTML = (await Promise.all(promises)).join("");
};


/*
const loadCards = async () => {
    await findAllFloors(); // Load the list of floors
    const tbody = document.getElementById("floorCards");
    tbody.innerHTML = ""; // Clear previous content

    // Map and resolve promises for both beds and nurses
    const promises = floorList.map(async (item) => {
        // Fetch beds and nurses data simultaneously
        const [bedsResult, nursesResult] = await Promise.all([
            getBedsOnFloor(item.id),
            countNurses(item.id),
        ]);

        const bedsCount = bedsResult.count; // Number of beds
        const countNurses = nursesResult.count; // Number of nurses

        // Return the card content
        return `
            <div class="col">
                <div class="card h-100 d-flex flex-row">
                    <!-- Card Content -->
                    <div class="card-body flex-grow-1">
                        <h4 class="card-title">${item.identificationName}</h4>
                        Camas
                        <span class="badge text-bg-secondary">${bedsCount}</span><br>
                        Enfermeras
                        <span class="badge text-bg-secondary">${countNurses}</span>
                        <hr>
                        <div class="text-body-secondary">
                        ${`${item.secretary.identificationName} ${item.secretary.surname} ${item.secretary.lastname}`}
                        </div>
                    </div>
                    <!-- Buttons -->
                    <div class="d-flex flex-column justify-content-start align-items-center p-3">
                        <button type="button" class="btn btn-primary btn-sm mb-2" onclick="loadFloor(${item.id})"
                            data-bs-target="#updateModal" data-bs-toggle="modal">
                            <i class="bi bi-pencil"></i> <!-- Edit icon -->
                        </button>
                    </div>
                </div>
            </div>`;
    });

    // Wait for all promises to resolve and update the HTML
    const cardsContent = await Promise.all(promises);
    tbody.innerHTML = cardsContent.join("");
};*/

//Función anónima para cargar la información
(async () => {
    await loadCards();
})();

const findAllSecretariesWithoutFloor = async () => {
    try {
        const response = await fetch(`${URL}/api/user/withoutFloor`, {
            method: 'GET',
            headers: {
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        });

        if (response.status === 404) {
            return 0; // Retorna 0 si el código es 404
        }

        const data = await response.json();
        const secretaryList = data.data || []; // Maneja posibles datos nulos o no definidos
        return secretaryList; // Retorna la lista de secretarios
    } catch (error) {
        console.error("Error al obtener los secretarios sin piso:", error);
        return 0; // Retorna 0 en caso de error
    }
};


//Método para cargar las opciones de secretarias en registro de piso
const loadData = async () => {
    const secretaries = await findAllSecretariesWithoutFloor();
    let secretarySelect = document.getElementById('regSecretary');
    let content = '';
    if (secretaries.length === 0) {
        content = `<option selected disabled>No hay secretarias para escoger</option>`;
    } else {
        content = `<option selected disabled hidden>Selecciona una secretaria</option>`;
        secretaries.forEach(item => {
            content += `<option value="${item.id}">${`${item.identificationName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</option>`
        });
    }
    secretarySelect.innerHTML = content;
}

//Método para obtener los pisos por id
const findFloorById = async idFloor => {
    await fetch(`${URL}/api/floor/${idFloor}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        floor = response.data;
    }).catch(error => console.error(error));
}

//Método para obtener la información del piso a editar
const loadFloor = async id => {
    await findFloorById(id);
    const secretaries = await findAllSecretariesWithoutFloor();
    document.getElementById("updNombre").value = floor.identificationName;
    let select = document.getElementById("updSecretary");
    let content = '';
    content = `<option value="${floor.secretary.id}" selected disabled hidden>${`${floor.secretary.identificationName} ${floor.secretary.surname} ${floor.secretary.lastname ? floor.secretary.lastname : ''}`}</option>`;
    if (secretaries === 0) {
        content += `<option disabled>No hay secretarias para escoger</option>`;
    } else {
        secretaries.forEach(item => {
            content += `<option value="${item.id}">${`${item.identificationName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</option>`;
        });
    }
    select.innerHTML = content;
    select.value = floor.secretary.id;
}

//Método para registrar un piso
const saveFloor = async () => {
    let form = document.getElementById('registerForm');
    floor = {
        identificationName: document.getElementById("regNombre").value,
        secretary: {
            id: document.getElementById('regSecretary').value
        }
    };

    console.log(floor);
    await fetch(`${URL}/api/floor`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(floor)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        floor = {};
        await loadCards();
        form.reset();
    }).catch(console.log);
}

//Método para actualizar un piso
const updateFloor = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        identificationName: document.getElementById("updNombre").value,
        secretary: {
            id: document.getElementById('updSecretary').value
        }
    };

    await fetch(`${URL}/api/floor/${floor.id}`, {
        method : 'PUT',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        floor = {};
        await loadCards();
        form.reset();
    }).catch(console.log);
}