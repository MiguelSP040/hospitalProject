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

//Método para insertar las cards de pisos en el HTML
const loadCards = async () => {
    await findAllFloors();

    let tbody = document.getElementById("floorCards");
    let content = '';
    floorList.forEach((item) => {
        content += `
            <div class="col">
                <div class="card h-100 d-flex flex-row">
                    <!-- Contenido del Card -->
                    <div class="card-body flex-grow-1">
                        <h4 class="card-title">${item.identificationName}</h4>
                        Camas
                        <span class="badge text-bg-secondary">0</span><br>
                        Enfermeras
                        <span class="badge text-bg-secondary">0</span>
                        <hr>
                        <div class="text-body-secondary">
                        ${`${item.secretary.identificationName} ${item.secretary.surname} ${item.secretary.lastname}`}
                        </div>
                    </div>
                    <!-- Botones alineados verticalmente -->
                    <div class="d-flex flex-column justify-content-start align-items-center p-3">
                        <button type="button" class="btn btn-primary btn-sm mb-2" onclick="loadFloor(${item.id})"
                            data-bs-target="#updateModal" data-bs-toggle="modal">
                            <i class="bi bi-pencil"></i> <!-- Ícono de editar -->
                        </button>
                        <button type="button" class="btn btn-outline-danger btn-sm " onclick="deleteFloor(${item.id})">
                            <i class="bi bi-trash"></i> <!-- Ícono de eliminar -->
                        </button>
                    </div>
                </div>
            </div>`;
    });
    tbody.innerHTML = content;
}

//Función anónima para cargar la información
(async () => {
    await loadCards();
})();

//Método para pintar la información del piso en la card
const loadInfo = async id => {
    await findFloorById(id);
    document.getElementById("updNombre").value = floor.identificationName;
    let select = document.getElementById("updSecretary");
    content = '';
    secretaryList.forEach(item => {
        content += `<option value="${item.id}">${`${item.fullName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</option>`
    });
    select.innerHTML = content;
    select.value = floor.secretary.id;
}


//Método para obtener la lista de secretarias
const findAllSecretaries = async idRol => {
    await fetch(`${URL}/api/user/rol/${idRol}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        secretaryList = response.data;
    }).catch(console.log());
}

//Método para cargar las opciones de secretarias en el select
const loadData = async () => {
    await findAllSecretaries(2);
    let secretarySelect = document.getElementById('regSecretary');
    let content = '';
    if (secretaryList.length === 0) {
        content += `<option selected disabled>No hay secretarias para escoger</option>`
    } else {
        content = `<option selected disabled hidden>Selecciona una secretaria</option>`;
        secretaryList.forEach(item => {
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
        console.log(response);
        floor = response.data;
        console.log(floor)
    }).catch(error => console.error(error));
}

//Método para obtener la información del piso a editar
const loadFloor = async id => {
    await findFloorById(id);
    document.getElementById("updNombre").value = floor.identificationName;
    let select = document.getElementById("updSecretary");
    content = '';
    secretaryList.forEach(item => {
        content += `<option value="${item.id}">${`${item.fullName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</option>`
    });
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
        console.log(floor);
        floor = {};
        await loadCards();
        form.reset();
    }).catch(console.log);
}

//Método para eliminar un piso
const deleteFloor = async () => {
    await fetch(`${URL}/api/floor/${floor.id}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(async response => {
        console.log(response);
        floor = {};
        await loadCards();
    }).catch(console.log);
}