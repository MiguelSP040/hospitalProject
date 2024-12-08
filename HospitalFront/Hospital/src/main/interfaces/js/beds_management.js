const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const role = localStorage.getItem('rol');
const username = localStorage.getItem('username')

let userList = [];
let bedList = []
let bed = {};
let floorList = [];
let floor = {};


//Método para obtener la lista de beds
const getBedsAndFloorBySecretaryUsername = async () => {
    await fetch(`${URL}/api/floor/beds-and-floor/${username}`, {
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

//Método para obtener el piso de username
const getFloorBySecretaryUsername = async () => {
    await fetch(`${URL}/api/floor/floor/${username}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        floor = response.data;
    }).catch(error => console.error(error));
}

const loadPutFloor = async () => {
    await getFloorBySecretaryUsername();

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

(async () => {
    if (role != 3) {
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    await loadPutFloor();
})();


(async () => {
    if(role != 3){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    await loadPutFloor();
})();

// Método para insertar las cards de camas en el cuerpo HTML
const loadCards = async () => {
    await getBedsAndFloorBySecretaryUsername(); // Asegúrate de que bedList se llena correctamente aquí.
    const bedCards = document.getElementById("bedCards");
    let content = '';
    bedList.forEach((item) => {
        const nurseName = item.nurse_name|| "Sin asignar";
        const nurseSurname = item.nurse_surname || ''
        const nurseLastname = item.nurse_lastname || ''
        const isDisabled = item.nurse_name ? 'disabled' : ''; // Si tiene enfermera, se desactiva el botón
        const showChangeNurseButton = item.has_nurse ? '' : 'd-none';
        content += `
    <div class="col">
        <div class="card h-100 d-flex flex-row">
            <div class="card-body flex-grow-1">
                <h4 class="card-title">${item.bed_name || "Sin nombre"}</h4>
                <hr>
                <div class="text-body-secondary">
                    Enfermera: ${nurseName} ${nurseSurname} ${nurseLastname}
                </div>
            </div>
            <div class="d-flex flex-column justify-content-start align-items-center p-3">
                <button class="btn btn-primary btn-sm mb-2" 
                    onclick="loadBeds(${item.id})"
                    data-bs-target="#updateModal" 
                    data-bs-toggle="modal">
                    <i class="bi bi-pencil"></i> 
                </button>
                <button class="btn btn-success btn-sm mb-2" 
                    onclick="loadNurse(${item.id})"
                    data-bs-target="#updateNurseModal" 
                    data-bs-toggle="modal"
                    ${isDisabled}>
                    <i class="bi bi-person-fill-up"></i>
                </button>
               <button class="btn btn-outline-warning btn-sm mb-2 ${showChangeNurseButton}" 
                    onclick="loadChangeNurse(${item.id})"
                    data-bs-target="#changeNurseModal" 
                    data-bs-toggle="modal">
                   <i class="bi bi-people-fill"></i>
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

//Método para obtener enfermera por id floor
const getNursesByFloorId = async idFloor => {
    await fetch(`${URL}/api/floor/nurses/${idFloor}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        console.log(response);
        userList = response.data;
    }).catch(error => console.error(error));
}

//Método para obtener la información de la bed a editar
const loadBeds = async (id) => {
    await findBedById(id);
    console.log(bed)
    document.getElementById("updNombre").value = bed.identificationName;
    document.getElementById("id").value = bed.id;

};

const loadNurse = async (idBed) => {
    // Cargar datos de la cama seleccionada
    await findBedById(idBed);

    const floorId = bed.floor.id;

    await getNursesByFloorId(floorId);

    // Configurar las opciones de selección de enfermeras
    let nurseSelect = document.getElementById('regNurse');
    let content = '';
    if (userList.length === 0) {
        content += `<option selected disabled>No hay enfermeras</option>`;
    } else {
        content = `<option selected disabled hidden>Selecciona una enfermera</option>`;
        userList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName} ${item.surname} ${item.lastname}</option>`;
        });
    }
    nurseSelect.innerHTML = content;

    document.getElementById('idBed').value = idBed;
};

// Método para actualizar las camas asignadas a una enfermera
const updateInsertBed = async () => {
    let form = document.getElementById('updateNurseForm');

    const nurseId = document.getElementById('regNurse').value;
    const bedId = document.getElementById('idBed').value = bed.id;

    console.log(nurseId)
    console.log(bedId)
    if (!nurseId || !bedId) {
        console.log("Faltan datos para realizar la operación.");
        await Swal.fire({
            title: 'Selección inválida',
            text: 'No se logró asignar cama a enfermera',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset();
        return;
    }

    const updated = {
        id: nurseId,
        beds: [
            {
                id: bedId
            }
        ]
    };

    try {
        // Enviar la solicitud para actualizar las camas asignadas
        const response = await fetch(`${URL}/api/user/beds`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updated)
        });

        const data = await response.json();
        console.log("Camas asignadas a la enfermera:", data);
        bed = {}
        await loadCards();
        form.reset();
        await Swal.fire({
            title: 'Asignación exitosa',
            text: 'Haz asignado una enfermera a la cama',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    } catch (error) {
        console.error("Error al asignar camas a la enfermera:", error);
        await Swal.fire({
            title: 'Selección inválida',
            text: 'No se logró asignar enfermera a la cama',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        form.reset();
    }
};

const loadChangeNurse = async (idBedNurse) => {
    // Cargar datos de la cama seleccionada
    await findBedById(idBedNurse);

    const floorId = bed.floor.id;

    await getNursesByFloorId(floorId);

    // Configurar las opciones de selección de enfermeras
    let nurseSelect = document.getElementById('chNurse');
    let content = '';
    if (userList.length === 0) {
        content += `<option selected disabled>No hay enfermeras</option>`;
    } else {
        content = `<option selected disabled hidden>Selecciona una enfermera</option>`;
        userList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName} ${item.surname} ${item.lastname}</option>`;
        });
    }
    nurseSelect.innerHTML = content;

    document.getElementById('idBedNurse').value = idBed;
};

// Método para actualizar las camas asignadas a una enfermera
const changeInsertBed = async () => {
    let form = document.getElementById('changeNurseForm');

    const nurseId = document.getElementById('chNurse').value;
    const bedId = document.getElementById('idBedNurse').value = bed.id;

    console.log(nurseId)
    console.log(bedId)
    if (!nurseId || !bedId) {
        console.log("Faltan datos para realizar la operación.");
        await Swal.fire({
            title: 'Selección inválida',
            text: 'No se logró asignar cama a enfermera',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset();
        return;
    }

    const updated = {
        id: nurseId,
        beds: [
            {
                id: bedId
            }
        ]
    };

    try {
        // Enviar la solicitud para actualizar las camas asignadas
        const response = await fetch(`${URL}/api/user/bedsChange`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updated)
        });

        const data = await response.json();
        console.log("Cambio de enfermera exitoso:", data);
        bed = {}
        await loadCards();
        form.reset();
        await Swal.fire({
            title: 'Cambio de asignación exitoso',
            text: 'Hiciste un cambio de enfermera a la cama',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    } catch (error) {
        console.error("Error al hacer cambio de enfermera:", error);
        await Swal.fire({
            title: 'Selección inválida',
            text: 'No se logró re asignar enfermera a la cama',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        form.reset();
    }
};


// Método para actualizar la cama
const updateBed = async () => {
    let form = document.getElementById('updateForm');

    const nameField = document.getElementById("updNombre").value.trim();
    const validNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s]{1,}$/;

    if (!nameField) {
        await Swal.fire({
            title: 'Nombre inválido',
            text: 'El campo de nombre está vacío. Por favor, ingresa un nombre válido.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset(); // Limpiar el formulario al detectar un error
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
        id: bed.id,
        identificationName: document.getElementById("updNombre").value,
        floor: {
            id: bed.floor.id// Mantener el ID del piso actual
        }
    };

    // Enviar la solicitud para actualizar la cama
    await fetch(`${URL}/api/bed`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log("Cama actualizada:", response);
        bed = {}; // Limpiar el objeto bed
        await loadCards(); // Recargar las tarjetas de camas
        form.reset(); // Limpiar el formulario
        await sweetAlert('Actualización exitosa', '', 'success');
    }).catch(error => {
        console.error("Error al actualizar la cama:", error);
    });
};

// Método para registrar una nueva cama
const saveBed = async () => {
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

    const nameField = document.getElementById("regNombre").value.trim();
    const validNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s]{1,}$/;

    if (!nameField) {
        await Swal.fire({
            title: 'Nombre inválido',
            text: 'El campo de nombre está vacío. Por favor, ingresa un nombre válido.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset(); // Limpiar el formulario al detectar un error
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
    bed = {
        identificationName: nameField,
        floor: {
            id: currentFloorId // Usar el ID del piso en curso
        }
    };
    try {
        const response = await fetch(`${URL}/api/bed`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(bed)
        });
        const data = await response.json();
        console.log(data);
        bed = {};
        await loadCards();
        form.reset();
        await Swal.fire({
            title: 'Registro exitoso',
            text: 'Acabas de registrar una cama.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
    } catch (error) {
        console.error("Error al registrar la cama:", error);
        await Swal.fire({
            title: 'Error',
            text: 'Ocurrió un error al registrar la cama. Inténtalo de nuevo.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
        form.reset(); // Limpiar el formulario si hay un error en el fetch
    }
};

const sweetAlert = async(titulo, descripcion, tipo)=>{
    await Swal.fire({title: `${titulo}`, text: `${descripcion}`, icon:`${tipo}`})
}