/*
Revisar método save y update, retraso para mostrar información actualizada
*/
const URL = 'http://localhost:8080';
let userList = [];
let user = {};
let floorList = [];
let floor = {};
const role = localStorage.getItem('rol');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

//Método para obtener la lista de usuarios
const findAllNurses = async () => {
    await fetch(`${URL}/api/user/rol/1`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        userList = response.data;
    }).catch(error => console.error(error));
}

//Método para insertar la tabla de usuarios en el cuerpo HTML
const loadTable = async () => {
    await findAllNurses();
    let tbody = document.getElementById("tbody");
    let content = '';
    userList.forEach((item, index) => {
        content += `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${`${item.identificationName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</td>
                        <td>${item.email}</td>
                        <td>${item.phoneNumber}</td>
                        <td>${item.username}</td>
                        <td>${item.nurseInFloor ? item.nurseInFloor.identificationName : 'Sin piso asignado'}</td>
                        <td class="text-center">
                            <button class="btn btn-outline-danger btn-sm me-3" onclick="deleteUser(${item.id})">Eliminar</button>
                            <button class="btn btn-primary btn-sm ms-3" onclick="loadUser(${item.id})" data-bs-target="#updateModal"
                                data-bs-toggle="modal">Editar</button>
                        </td>
                    </tr>`;
    });
    tbody.innerHTML = content;
}

//Función anónima para cargar la información de la tabla
(async () => {
    console.log(role);
    if(role != 2){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    document.getElementById('userLogged').textContent = username;
    await loadTable();
})();

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
            "Authorization": `Bearer ${token}`,
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

const saveUser = async () => {
    let form = document.getElementById('registerForm');
    user = {
        identificationName: document.getElementById("regNombres").value.trim(),
        surname: document.getElementById("regApellidoPaterno").value.trim(),
        lastname: document.getElementById("regApellidoMaterno").value.trim(),
        email: document.getElementById("regEmail").value.trim(),
        phoneNumber: document.getElementById("regTelefono").value.trim(),
        username: document.getElementById("regUsuario").value.trim(),
        nurseInFloor: {
            id: document.getElementById('regFloor').value
        },
        role: {
            id: 1
        }
    };

    if (!user.identificationName || !user.surname || !user.email || !user.phoneNumber || !user.username) {
        await Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios. Por favor, completa el formulario.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    try {
        const response = await fetch(`${URL}/api/user`, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(user)
        });

        if (!response.ok) {
            await Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al registrar el usuario. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }
        const data = await response.json();
        console.log(data);
        await Swal.fire({
            title: 'Registro exitoso',
            text: 'La enfermera ha sido registrada correctamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });
        user = {};
        await loadTable();
        form.reset();
    } catch (error) {
        console.error("Error en saveUser:", error);
        await Swal.fire({
            title: 'Error',
            text: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
};


// Método para editar un usuario
const updateUser = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id: user.id,
        identificationName: document.getElementById("updNombres").value.trim(),
        surname: document.getElementById("updApellidoPaterno").value.trim(),
        lastname: document.getElementById("updApellidoMaterno").value.trim(),
        email: document.getElementById("updEmail").value.trim(),
        phoneNumber: document.getElementById("updTelefono").value.trim(),
        username: document.getElementById("updUsuario").value.trim(),
        nurseInFloor: {
            id: document.getElementById('updFloor').value
        }
    };

    // Validar los campos obligatorios del objeto `updated`
    if (
        !updated.identificationName ||
        !updated.surname ||
        !updated.email ||
        !updated.phoneNumber ||
        !updated.username
    ) {
        await Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios. Por favor, completa el formulario.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    try {
        const response = await fetch(`${URL}/api/user`, {
            method: 'PUT',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(updated)
        });

        // Validar respuesta del servidor
        if (!response.ok) {
            const errorData = await response.json(); // Si el backend envía un mensaje de error
            console.error("Error del servidor:", errorData);
            await Swal.fire({
                title: 'Error',
                text: errorData.message || 'Ocurrió un error al actualizar el usuario. Inténtalo de nuevo.',
                icon: 'error',
                confirmButtonText: 'Cerrar'
            });
            return;
        }

        const data = await response.json();
        console.log(data);

        // Mostrar mensaje de éxito
        await Swal.fire({
            title: 'Actualización exitosa',
            text: 'El usuario ha sido actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });

        user = {}; // Limpiar el objeto usuario
        await loadTable(); // Recargar la tabla
        form.reset(); // Limpiar el formulario
    } catch (error) {
        console.error("Error en updateUser:", error);
        await Swal.fire({
            title: 'Error',
            text: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
};



//Método para eliminar un usuario
const deleteUser = async idUser => {
    await fetch(`${URL}/api/user/delete/${idUser}`, {
        method: 'DELETE',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },

    }).then(response => response.json()).then(async response => {
        user = {};
        await loadTable();
    }).catch(error => console.error(error));
}