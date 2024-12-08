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
    if (!numPiso) {
        console.error("Elemento numPiso no encontrado en el DOM.");
        return;
    }

    const floorName = floor?.floor_name || "No tienes piso";
    numPiso.textContent = floorName; // Actualizar solo el contenido del elemento <i>
};


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
        const nurseName = item.nurse_name || "Sin asignar";
        content += `
        <div class="col">
            <div class="card h-100 d-flex flex-row">
                <div class="card-body flex-grow-1">
                    <h4 class="card-title">${item.bed_name || "Sin nombre"}</h4>
                    <hr>
                    <div class="text-body-secondary">
                        Enfermera: ${nurseName}
                    </div>
                </div>
                <div class="d-flex flex-column justify-content-start align-items-center p-3">
                    <button class="btn btn-primary btn-sm mb-2" 
                        onclick="loadBeds(${item.id})"
                        data-bs-target="#updateModal" 
                        data-bs-toggle="modal" >
                        <i class="bi bi-pencil"></i> 
                    </button>
                    <button class="btn btn-success btn-sm mb-2" 
                        onclick="loadNurse(${item.id})"
                        data-bs-target="#updateNurseModal" 
                        data-bs-toggle="modal">
                        <i class="bi bi-reply-fill"></i>
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

const loadNurse = async (id) => {
    await getNursesByFloorId(id);
    let nurseSelect = document.getElementById('regSecretary');
    console.log(userList)
    let content = '';
    if (userList.length === 0) {
        content += `<option selected disabled>No hay enfermeras</option>`
    } else {
        content = `<option selected disabled hidden>Selecciona una enfermera</option>`;
        userList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName}</option>`
        });
    }
    nurseSelect.innerHTML = content;
};

// Método para actualizar la cama
const updateBed = async () => {
    let form = document.getElementById('updateForm');

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
    }).catch(error => {
        console.error("Error al actualizar la cama:", error);
    });
};



//Método para registrar una nueva cama
const saveBed = async () => {
    let form = document.getElementById('registerForm');
    await getFloorBySecretaryUsername();

    console.log(floor)
    let currentFloorId = floor.id

    // Verificar que el ID del piso esté definido
    if (!currentFloorId) {
        console.error("No se encontró el ID del piso en curso.");
        alert("No se puede registrar la cama porque no hay un piso seleccionado.");
        return;
    }
    bed = {
        identificationName: document.getElementById("regNombre").value,
        floor: {
            id: currentFloorId // Usar el ID del piso en curso
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
        await loadCards();
        form.reset();
    }).catch(error => {
        console.error("Error al registrar la cama:", error);
    });
};

