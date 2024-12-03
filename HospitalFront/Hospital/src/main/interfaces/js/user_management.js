const URL = 'http://localhost:8080';
let userList = [];
let user = {};
let roleList = [];
let role = {};

//Método para obtener la lista de usuarios
const findAllUsers = async () =>{
    await fetch (`${URL}/api/user`,{
        method : 'GET',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        }
    }).then(response =>response.json()).then(response =>{
        //ToDo
        userList = response.data;
    }).catch(error => console.error(error));
}

//Método para insertar la tabla de usuarios en el cuerpo HTML
const loadTable = async () => {
    await findAllUsers();

    let tbody = document.getElementById("tbody");
    let content = '';
    userList.forEach((item, index)=>{
        content += `<tr>
                        <th scope="row">${index + 1}</th>
                        <td>${`${item.identificationName} ${item.surname} ${item.lastname}`}</td>
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
(async () =>{
    await loadTable();
})();

//Método para cargar la lista de roles
const findAllRoles = async () => {
    await fetch(`${URL}/api/role`, {
        method: 'GET',
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        }
    }).then(response =>response.json()).then(response =>{
        //ToDo
        roleList = response.data;
    }).catch(error => console.error(error));
}

//Método para cargar las opciones de roles en el select
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
            "Content-type" : "application/json",
            "Accept" : "application/json"
        }
    }).then(response =>response.json()).then(response =>{
        //ToDo
        user = response.data;
    }).catch(error => console.error(error));
}

//Método para obtener la información del usuario a editar
const loadUser = async id => {
    await findUserById(id);
    document.getElementById("updNombres").value = user.identificationName;
    document.getElementById("updApellidoPaterno").value = user.surname;
    document.getElementById("updApellidoMaterno").value = user.lastname;
    document.getElementById("updEmail").value = user.email;
    document.getElementById("updTelefono").value = user.phoneNumber;
    document.getElementById("updUsuario").value = user.username;
    document.getElementById("updPassword").value = user.password;
    let select = document.getElementById("updRol").value;
    content = '';
    roleList.forEach(item => {
        content += `<option value="${item.id}">${item.name}</option>`
    });
    console.log(user);
    select.innerHTML = content;
    select.value = user.role.id;
}

//Método para registrar un nuevo usuario
const saveUser = async () => {
    let form = document.getElementById('saveForm');
    user = {
        identificationName : getElementById("regNombres").value,
        surname : getElementById("regApellidoPaterno").value, 
        lastname : getElementById("regApellidoMaterno").value,
        email : getElementById("regEmail").value,
        phoneNumber : getElementById("regTelefono").value,
        username : getElementById("regUsuario").value,
        role : {
            id: document.getElementById('regRol').value
        }
    };

    await fetch(`${URL}/api/user`, {
        method : 'POST',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify(user)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        user = {};
        await loadTable();
        form.reset();
    }).catch(console.log);
}

//Método para editar un usuario
const updateUser = async () => {
    let form = document.getElementById('updateForm');
    let updated = {
        id : user.id,
        identificationName : getElementById("regNombres").value,
        surname : getElementById("regApellidoPaterno").value, 
        lastname : getElementById("regApellidoMaterno").value,
        email : getElementById("regEmail").value,
        phoneNumber : getElementById("regTelefono").value,
        username : getElementById("regUsuario").value,
        role : {
            id: document.getElementById('regRol').value
        }
    };

    await fetch(`${URL}/api/user`, {
        method : 'PUT',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify(updated)
    }).then(response => response.json()).then(async response => {
        console.log(response);
        pet = {};
        await loadTable();
    }).catch(console.log);
}

//Método para eliminar un usuario
const deleteUser = async idUser => {
    await fetch(`${URL}/api/user/delete/${idUser}`, {
        method : 'DELETE',
        headers : {
            "Content-type" : "application/json",
            "Accept" : "application/json"
        },

    }).then(response => response.json()).then(async response => {
        user = {};
        await loadTable();
    }).catch(error => console.error(error));
}
