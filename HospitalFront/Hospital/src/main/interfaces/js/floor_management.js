/*
Revisar método save y update, restraso para mostrar información actualizada
*/
const URL = 'http://localhost:8080';
let floorList = [];
let floor = {};
const role = localStorage.getItem('rol');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username')

//Método para obtener la lista de pisos
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

//Método para contar las camas por piso
const getBedsOnFloor = async (idFloor) => {
    try {
        const response = await fetch(`${URL}/api/floor/beds/${idFloor}`, {
            method: 'GET',  // Asegúrate de especificar el método si es necesario
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"  // Asegúrate de indicar el tipo de contenido si es necesario
            }
        });

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
        const response = await fetch(`${URL}/api/floor/nurses/${idFloor}`, {
            method: 'GET',  // Asegúrate de especificar el método si es necesario
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"  // Asegúrate de indicar el tipo de contenido si es necesario
            }
        });

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

//Función anónima para cargar la información
(async () => {
    if(role != 2){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    document.getElementById('userLogged').textContent = username;
    await loadCards();
})();

const findAllSecretariesWithoutFloor = async () => {
    try {
        const response = await fetch(`${URL}/api/user/withoutFloor`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
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
    const secretarySelect = document.getElementById('regSecretary');
    let content = '';

    try {
        // Llama a la función para obtener la lista de secretarias
        const secretaryList = await findAllSecretariesWithoutFloor();

        if (!secretaryList || secretaryList.length === 0) {
            content = `<option selected disabled>No hay secretarias para escoger</option>`;
        } else {
            content = `<option selected disabled hidden>Selecciona una secretaria</option>`;
            secretaryList.forEach(item => {
                const fullName = `${item.identificationName} ${item.surname} ${item.lastname || ''}`.trim();
                content += `<option value="${item.id}">${fullName}</option>`;
            });
        }
    } catch (error) {
        console.error("Error cargando las secretarias:", error);
        content = `<option selected disabled>Error al cargar las opciones</option>`;
    }

    // Actualiza el contenido del select
    secretarySelect.innerHTML = content;
};

//Método para obtener los pisos por id
const findFloorById = async idFloor => {
    await fetch(`${URL}/api/floor/${idFloor}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
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

// Método para registrar un piso
const saveFloor = async () => {
    let form = document.getElementById('registerForm');
    let identificationName = document.getElementById("regNombre").value.trim();
    let secretaryId = document.getElementById('regSecretary').value;

    if (!identificationName || !secretaryId) {
        await Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios. Por favor, completa el formulario.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    let floor = {
        identificationName: identificationName,
        secretary: {
            id: secretaryId
        }
    };

    try {
        const response = await fetch(`${URL}/api/floor`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(floor)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            await Swal.fire({
                title: 'Error',
                text: errorData.message || 'Ocurrió un error al registrar el piso. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        const data = await response.json();
        console.log(data);
        await Swal.fire({
            title: 'Registro exitoso',
            text: 'El piso ha sido registrado correctamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
        floor = {};
        await loadCards();
        form.reset();
    } catch (error) {
        console.error("Error en saveFloor:", error);
        await Swal.fire({
            title: 'Error',
            text: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
};


//Método para actualizar un piso
const updateFloor = async () => {
    let form = document.getElementById('updateForm');

    const nameField = document.getElementById("updNombre").value.trim();
    const updSecretary = document.getElementById("updSecretary").value
    const validNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s]{1,}$/;

    if (!nameField || !updSecretary) {
        await Swal.fire({
            title: 'Campos inválidos',
            text: 'Los campos son obligatorios',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset();
        return;
    }

    if (!validNameRegex.test(nameField)) {
        await Swal.fire({
            title: 'Nombre inválido',
            text: 'El nombre de la cama debe tener al menos 2 caracteres y contener solo letras o números.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset();
        return;
    }

    let updated = {
        id : floor.id,
        identificationName: document.getElementById("updNombre").value,
        secretary: {
            id: document.getElementById('updSecretary').value
        }
    };


    await fetch(`${URL}/api/floor/${floor.id}`, {
        method : 'PUT',
        headers : {
            "Authorization": `Bearer ${token}`,
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        await Swal.fire({
            title: 'Actualización exitosa',
            text: 'El usuario ha sido actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
        floor = {};
        await loadCards();
    }).catch(console.log());
}