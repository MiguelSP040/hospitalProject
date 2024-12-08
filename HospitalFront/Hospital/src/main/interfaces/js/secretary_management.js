/*
Revisar retraso en actualización y registro
*/
const URL = 'http://localhost:8080';
let userList = [];
let user = {};
let floorList = [];
let floor = {};

//Método para obtener la lista de usuarios
const findAllSecretaries = async () => {
    await fetch(`${URL}/api/user/rol/3`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        userList = response.data;
    }).catch(error => console.error(error));
}

//Método para insertar la tabla de usuarios en el cuerpo HTML
const loadTable = async () => {
    await findAllSecretaries();
    let tbody = document.getElementById("tbody");
    let content = '';

    for (const item of userList) {
        const floorName = await fetchFloorName(item.id)
        content += `<tr>
                        <th scope="row">${userList.indexOf(item) + 1}</th>
                        <td>${`${item.identificationName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</td>
                        <td>${item.email}</td>
                        <td>${item.phoneNumber}</td>
                        <td>${item.username}</td>
                        <td>${floorName ? floorName : "Sin piso asignado"}</td>
                        <td class="text-center">
                            <button class="btn btn-outline-danger btn-sm me-3" onclick="deleteUser(${item.id})">Eliminar</button>
                            <button class="btn btn-primary btn-sm ms-3" onclick="loadUser(${item.id})" data-bs-target="#updateModal"
                                data-bs-toggle="modal">Editar</button>
                        </td>
                    </tr>`;
    }
    tbody.innerHTML = content;
}

//Función anónima para cargar la información de la tabla
(async () => {
    await loadTable();
})();

//Método para cargar la lista de pisos
const findAllFloors = async () => {
    await fetch(`${URL}/api/floor`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        floorList = response.data;
    }).catch(error => console.error(error));
}

//Método para cargar las opciones de pisos en el registro de enfermeras
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

//Método para obtener los usuarios por id
const findUserById = async idUser => {
    await fetch(`${URL}/api/user/${idUser}`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        console.log(response);
        user = response.data;
    }).catch(error => console.error(error));
}

//Método para obtener la información del usuario a editar
const loadUser = async id => {
    await findUserById(id);
    await findAllFloors();
    document.getElementById("updNombres").value = user.identificationName;
    document.getElementById("updApellidoPaterno").value = user.surname;
    document.getElementById("updApellidoMaterno").value = user.lastname;
    document.getElementById("updEmail").value = user.email;
    document.getElementById("updTelefono").value = user.phoneNumber;
    document.getElementById("updUsuario").value = user.username;
    let select = document.getElementById("updFloor");
    let content = '';

    const floorId = user.nurseInFloor?.id ?? null; 
    const floorName = user.nurseInFloor?.identificationName ?? 'Escoge un piso';

    content = `<option value="${floorId}" selected disabled hidden>${floorName}</option>`;

    if (floorList.length === 0) {
        content += `<option disabled>No hay pisos para escoger</option>`;
    } else {
        floorList.forEach(item => {
            content += `<option value="${item.id}">${item.identificationName}</option>`;
        });
    }

    select.innerHTML = content;

    if (floorId !== null) {
        select.value = floorId;
    }
}

//Método para registrar un nuevo usuario
const saveUser = async () => {
    let form = document.getElementById('registerForm');
    user = {
        identificationName: document.getElementById("regNombres").value,
        surname: document.getElementById("regApellidoPaterno").value,
        lastname: document.getElementById("regApellidoMaterno").value,
        email: document.getElementById("regEmail").value,
        phoneNumber: document.getElementById("regTelefono").value,
        username: document.getElementById("regUsuario").value,
        nurseInFloor: {
            id: document.getElementById('regFloor').value
        },
        role: {
            id: 1
        }
    };

    await fetch(`${URL}/api/user`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(user)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        user = {};
        await loadTable();
    }).catch(console.log());
}

//Método para editar un usuario
const updateUser = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id: user.id,
        identificationName: document.getElementById("updNombres").value,
        surname: document.getElementById("updApellidoPaterno").value,
        lastname: document.getElementById("updApellidoMaterno").value,
        email: document.getElementById("updEmail").value,
        phoneNumber: document.getElementById("updTelefono").value,
        username: document.getElementById("updUsuario").value,
        nurseInFloor: {
            id: document.getElementById('regFloor').value
        },
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
        user = {};
        await loadTable();
    }).catch(console.log());
}

//Método para eliminar un usuario
const deleteUser = async idUser => {
    await fetch(`${URL}/api/user/delete/${idUser}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },

    }).then(response => response.json()).then(async response => {
        user = {};
        await loadTable();
    }).catch(error => console.error(error));
}

const fetchFloorName = async (idUser) => {
    try {
        const response = await fetch(`${URL}/api/user/findFloorName/${idUser}`);
        const result = await response.json(); // Parse the response as JSON
        return result.data; // Return only the floor name
    } catch (error) {
        console.error(error.message);
        return "Sin piso asignada"; // Default value if fetching fails
    }
}