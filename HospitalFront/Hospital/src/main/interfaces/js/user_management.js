/*
Revisar método save y update, restraso para mostrar información actualizada
*/
const URL = 'http://localhost:8080';
let userList = [];
let user = {};
let roleList = [];
let role = {};
const rol = localStorage.getItem('rol');
const token = localStorage.getItem('token');
const username = localStorage.getItem('username')

//Método para obtener la lista de usuarios
const findAllUsers = async () => {
    await fetch(`${URL}/api/user`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        console.log(response)
        userList = response.data;
    }).catch(error => console.error(error));
}

//Método para insertar la tabla de usuarios en el cuerpo HTML
const loadTable = async () => {
    await findAllUsers();

    let tbody = document.getElementById("tbody");
    let content = '';
    userList.forEach((item, index) => {
        content += `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${`${item.identificationName} ${item.surname} ${item.lastname ? item.lastname : ''}`}</td>
                        <td>${item.email}</td>
                        <td>${item.phoneNumber}</td>
                        <td>${item.username}</td>
                        <td>${item.role.name}</td>
                        <td class="text-center">
                            <button class="btn btn-outline-danger btn-sm me-3" onclick="deleteUser(${item.id})">Eliminar</button>
                            <button class="btn btn-primary btn-sm ms-3" onclick="loadUser(${item.id})" data-bs-target="#updateModal" data-bs-toggle="modal">Editar</button>
                        </td>
                    </tr>`;
    });
    tbody.innerHTML = content;
}

//Función anónima para cargar la información de la tabla
(async () => {
    if(rol != 2){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    document.getElementById('userLogged').textContent = username;
    await loadTable();
})();

//Método para cargar la lista de roles
const findAllRoles = async () => {
    await fetch(`${URL}/api/role`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        roleList = response.data;
    }).catch(error => console.error(error));
}

//Método para cargar las opciones de roles en el registro de usuario
const loadData = async () => {
    await findAllRoles();
    let roleSelect = document.getElementById('regRol');
    let content = '';
    if (roleList.length === 0) {
        content += `<option selected disabled>No hay roles para escoger</option>`
    } else {
        content = `<option selected disabled hidden>Selecciona un rol</option>`;
        roleList.forEach(item => {
            content += `<option value="${item.id}">${item.name}</option>`
        });
    }
    roleSelect.innerHTML = content;
}

//Método para obtener los usuarios por id
const findUserById = async idUser => {
    await fetch (`${URL}/api/user/${idUser}`,{
        method : 'GET',
        headers : {
            "Authorization": `Bearer ${token}`,
            "Content-type" : "application/json",
            "Accept" : "application/json"
        }
    }).then(response => response.json()).then(response => {
        //ToDo
        user = response.data;
    }).catch(error => console.error(error));
}

//Método para obtener la información del usuario a editar
const loadUser = async id => {
    await findUserById(id);
    await findAllRoles();
    document.getElementById("updNombres").value = user.identificationName;
    document.getElementById("updApellidoPaterno").value = user.surname;
    document.getElementById("updApellidoMaterno").value = user.lastname;
    document.getElementById("updEmail").value = user.email;
    document.getElementById("updTelefono").value = user.phoneNumber;
    document.getElementById("updUsuario").value = user.username;
    let select = document.getElementById("updRol");
    content = '';
    content = `<option value="${user.role.id}" selected disabled hidden>${user.role.name}</option>`;
    if (roleList.length === 0) {
        content += `<option disabled>No hay secretarias para escoger</option>`;
    } else {
        roleList.forEach(item => {
            content += `<option value="${item.id}">${item.name}</option>`
        });
    }
    select.innerHTML = content;
    select.value = user.role.id;
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
        role: {
            id: document.getElementById('regRol').value
        }
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
            throw new Error("Failed to save user");
        }
        const result = await response.json();
        console.log("User saved:", result);
        await loadTable();
    } catch (error) {
        console.error(error);
    }
}

//Método para editar un usuario
const updateUser = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id : user.id,
        identificationName : document.getElementById("updNombres").value,
        surname : document.getElementById("updApellidoPaterno").value, 
        lastname : document.getElementById("updApellidoMaterno").value,
        email : document.getElementById("updEmail").value,
        phoneNumber : document.getElementById("updTelefono").value,
        username : document.getElementById("updUsuario").value,
        role : {
            id: document.getElementById('updRol').value
        }
    };

    await fetch(`${URL}/api/user`, {
        method : 'PUT',
        headers : {
            "Authorization": `Bearer ${token}`,
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        user = {};
        await loadTable();
    }).catch(error => console.error(error));
}

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