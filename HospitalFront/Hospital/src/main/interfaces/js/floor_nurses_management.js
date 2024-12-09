const URL = 'http://localhost:8080';
let nurseList = [];
let floor = {};
let nurse = {};
let currentIdFloor = ''; // ID del piso asignado al secretario
const role = localStorage.getItem('rol');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

// Método para obtener enfermeras por piso
const getNursesByFloorId = async () => {
    if (!currentIdFloor) {
        console.error("El ID del piso no está definido.");
        return;
    }
    try {
        const response = await fetch(`${URL}/api/floor/nurses/${currentIdFloor}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener enfermeras: ${response.status}`);
        }

        const data = await response.json();
        nurseList = data.data || [];
    } catch (error) {
        console.error("Error al obtener enfermeras:", error);
    }
};


// Método para obtener el piso del secretario
const getFloorBySecretaryUsername = async () => {
    try {
        const response = await fetch(`${URL}/api/floor/floor/${username}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Error al obtener el piso: ${response.status}`);
        }

        const data = await response.json();
        floor = data.data;

        if (!floor || !floor.id) {
            console.warn("No se encontró un piso asignado para este usuario.");
            currentIdFloor = '';
        } else {
            currentIdFloor = floor.id;
        }
    } catch (error) {
        console.error("Error al obtener el piso del secretario:", error);
    }
};


//Método para encontrar enferemera por id
const findNurseById = async idNurse => {
    await fetch(`${URL}/api/user/${idNurse}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        nurse = response.data;
    }).catch(error => console.error(error));
}

// Método para cargar la información en las cards
const loadCards = async () => {
    await getNursesByFloorId();

    const tbody = document.getElementById("nursesCards");
    let content = '';

    nurseList.forEach((item) => {
        content += `<div class="col">
                        <div class="card h-100 d-flex flex-row">
                            <div class="card-body flex-grow-1">
                                <h4 class="card-title">${`${item.identificationName} ${item.surname} ${item.lastname || ''}`}</h4>
                                <p class="card-text">${item.email}<br>${item.phoneNumber}<br>${item.username}</p>
                            </div>
                            <div class="d-flex flex-column justify-content-start align-items-center p-3">
                                <button class="btn btn-primary btn-sm mb-2" data-bs-toggle="modal"
                                    data-bs-target="#updateModal" onclick="loadNurse(${item.id})">
                                    <i class="bi bi-pencil"></i>
                                </button>
                                <button class="btn btn-secondary btn-sm" data-bs-toggle="modal"
                                    data-bs-target="#transferModal" onclick="loadData(${item.id})">
                                    <i class="bi bi-box-arrow-left"></i>
                                </button>
                            </div>
                        </div>
                    </div>`;
    });

    tbody.innerHTML = content;
};


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
            "Authorization": `Bearer ${token}`,
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
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Error del servidor:", errorData);
            await Swal.fire({
                title: 'Error',
                text: errorData.message || 'Ocurrió un error al registrar el usuario. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            form.reset();
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
    await getFloorBySecretaryUsername();

    console.log(floor);
    let currentFloorId = floor.id;

    if (!currentFloorId) {
        await Swal.fire({
            title: 'Error',
            text: 'No se puede registrar la cama porque no hay un piso seleccionado.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset();
        return;
    }

    nurse = {
        identificationName: document.getElementById("regNombres").value,
        surname: document.getElementById("regApellidoPaterno").value,
        lastname: document.getElementById("regApellidoMaterno").value,
        email: document.getElementById("regEmail").value,
        phoneNumber: document.getElementById("regTelefono").value,
        username: document.getElementById("regUsuario").value,
        nurseInFloor: {
            id: currentFloorId
        },
        role:{
            id: 1
        }
    };

    await fetch(`${URL}/api/user`, {
        method: 'POST',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(nurse)

    }).then(response => response.json()).then(async response => {
        console.log(response);
        nurse = {};
        await loadCards();
        form.reset();
        await Swal.fire({
            title: 'Registro exitoso',
            text: `Acabas de registrar una enfermera en el piso ${currentIdFloor}`,
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    }).catch(console.log());
}

const updateNurse = async () => {
    let form = document.getElementById('updateForm');

    const nameField = document.getElementById("updNombres").value.trim();
    const surnameField = document.getElementById("updApellidoPaterno").value.trim();
    const emailField = document.getElementById("updEmail").value.trim();
    const phoneField = document.getElementById("updTelefono").value.trim();
    const usernameField = document.getElementById("updUsuario").value.trim();

    const validNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s]{1,}$/;

    // Validar campos vacíos
    if (!nameField || !surnameField || !emailField || !phoneField || !usernameField) {
        await Swal.fire({
            title: 'Actualización inválida',
            text: 'Todos los campos son obligatorios. Por favor, completa el formulario.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Validar formato de nombre
    if (!validNameRegex.test(nameField)) {
        await Swal.fire({
            title: 'Nombre inválido',
            text: 'El nombre contiene caracteres no permitidos. Usa solo letras, números y espacios.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    // Preparar el objeto actualizado
    const updated = {
        id: nurse.id,
        identificationName: nameField,
        surname: surnameField,
        lastname: document.getElementById("updApellidoMaterno").value.trim(),
        email: emailField,
        phoneNumber: phoneField,
        username: usernameField,
        nurseInFloor: {
            id: currentIdFloor
        }
    };

    try {
        // Realizar la solicitud de actualización
        const response = await fetch(`${URL}/api/user`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updated)
        });

        // Manejar la respuesta
        if (!response.ok) {
            const errorData = await response.json();
            await Swal.fire({
                title: 'Error al actualizar',
                text: errorData.message || 'Ocurrió un error al actualizar la enfermera. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        // Éxito en la actualización
        await Swal.fire({
            title: 'Actualización exitosa',
            text: 'La enfermera ha sido actualizada correctamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });

        nurse = {};
        await loadCards();
        form.reset();
    } catch (error) {
        console.error("Error al actualizar la enfermera:", error);
        await Swal.fire({
            title: 'Error inesperado',
            text: 'No se pudo conectar con el servidor. Por favor, inténtalo más tarde.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
};



const loadPutFloor = async () => {
    await getFloorBySecretaryUsername();
    currentIdFloor = floor.id
    const numPiso = document.getElementById("numPiso");
    const registerButton = document.getElementById("registerButton");

    if (!numPiso) {
        console.error("Elemento numPiso no encontrado en el DOM.");
        return;
    }

    const floorName = floor?.floor_name || "No tienes piso";
    numPiso.textContent = floorName; // Actualizar solo el contenido del elemento <i>

    // Si no hay un piso asignado, ocultar el botón
    if (!floor || !floor.id) {
        registerButton.style.display = "none";
    } else {
        registerButton.style.display = "inline-block"; // Asegurarse de que sea visible si hay un piso
    }
};

// Función de inicio
(async () => {
    if (role != 3) {
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }

    document.getElementById('userLogged').textContent = username;

    await loadPutFloor();
    await loadCards();
})();

const sweetAlert = async(titulo, descripcion, tipo)=>{
    await Swal.fire({title: `${titulo}`, text: `${descripcion}`, icon:`${tipo}`})
}
