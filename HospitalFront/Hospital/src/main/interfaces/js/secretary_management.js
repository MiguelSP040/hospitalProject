
const role = localStorage.getItem('rol');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username');

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
    await findAllSecretaries();
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

// Método para registrar un nuevo usuario
const saveUser = async () => {
    let form = document.getElementById('registerForm');
    const identificationName = document.getElementById("regNombres").value.trim();
    const surname = document.getElementById("regApellidoPaterno").value.trim();
    const lastname = document.getElementById("regApellidoMaterno").value.trim();
    const email = document.getElementById("regEmail").value.trim();
    const phoneNumber = document.getElementById("regTelefono").value.trim();
    const username = document.getElementById("regUsuario").value.trim();
    const floorId = document.getElementById('regFloor')?.value;

    // Validar campos requeridos
    if (!identificationName || !surname || !email || !phoneNumber || !username) {
        await Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios. Por favor, completa el formulario.',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        return;
    }

    let user = {
        identificationName,
        surname,
        lastname,
        email,
        phoneNumber,
        username,
        nurseInFloor: floorId ? { id: floorId } : null,
        role: { id: 3 } // Rol para secretaria
    };

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

        const data = await response.json();
        console.log(data);

        await Swal.fire({
            title: 'Registro exitoso',
            text: 'La secretaria ha sido registrada correctamente.',
            icon: 'success',
            confirmButtonText: 'Entendido'
        });

        user = {};
        await loadTable();
        form.reset();
    } catch (error) {
        console.error(`Error en saveUser: ${error.message}`);
        await Swal.fire({
            title: 'Error',
            text: 'No se pudo conectar con el servidor. Inténtalo más tarde.',
            icon: 'error',
            confirmButtonText: 'Cerrar'
        });
    }
};

//Método para editar un usuario
const updateUser = async () => {
    let form = document.getElementById('updateForm');

    const nameField = document.getElementById("updNombres").value.trim();
    const surnameField = document.getElementById("updApellidoPaterno").value.trim();
    const lastnameField = document.getElementById("updApellidoMaterno").value.trim();
    const emailField = document.getElementById("updEmail").value.trim();
    const telefonoField = document.getElementById("updTelefono").value.trim();
    const usuarioField = document.getElementById("updUsuario").value.trim();
    const validNameRegex = /^[a-zA-Z0-9][a-zA-Z0-9\s]{1,}$/;

    if (!nameField || !surnameField || !lastnameField || !emailField || !telefonoField || !usuarioField) {
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
        id: user.id,
        identificationName: document.getElementById("updNombres").value,
        surname: document.getElementById("updApellidoPaterno").value,
        lastname: document.getElementById("updApellidoMaterno").value,
        email: document.getElementById("updEmail").value,
        phoneNumber: document.getElementById("updTelefono").value,
        username: document.getElementById("updUsuario").value
    };

    await fetch(`${URL}/api/user`, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        user = {};
        await loadTable();
        form.reset();
        await sweetAlert('Actualización exitosa', '', 'success');
    }).catch(console.log());
}

// Método para eliminar un usuario
const deleteUser = async (idUser) => {
    Swal.fire({
        title: 'Eliminar secretaria',
        text: '¿Estás seguro de realizar esta acción?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            await fetch(`${URL}/api/user/delete/${idUser}`, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(updateUser)
            })
                .then(response => response.json())
                .then(async (response) => {
                    await loadTable();
                    await sweetAlert('Operación exitosa', 'Secretaria eliminada', 'success');
                    location.reload();
                })
                .catch(async () => {
                    await sweetAlert('Error al eliminar usuario', 'Ocurrió un error inesperado, prueba más tarde', 'error');
                });
        }
    });
};


const sweetAlert = async(titulo, descripcion, tipo)=>{
    await Swal.fire({title: `${titulo}`, text: `${descripcion}`, icon:`${tipo}`})
}