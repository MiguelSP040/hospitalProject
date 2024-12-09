const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const role = localStorage.getItem('rol');
const username = localStorage.getItem('username');
const pass = localStorage.getItem('password');

let user = {};
const findUser = async (username) => {
    await fetch(`${URL}/api/user/findUser/${username}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    }).then(response => response.json()).then(response => {
        console.log(response);
        user=response.data;
    }).catch(console.log);
}

const originalValues = {};

const loadUserInfo = async () => {
    await findUser(username);
    document.getElementById("editName").value = user.identificationName;
    document.getElementById("editSurname").value = user.surname;
    document.getElementById("editUsername").value = user.username;
    document.getElementById("editLastname").value = user.lastname;
    document.getElementById("editEmail").value = user.email;
    document.getElementById("editPhoneNumber").value = user.phoneNumber;
    document.getElementById("u_id").value = user.id;

    // Guardamos los valores originales para comparar
    originalValues.editName = user.identificationName;
    originalValues.editSurname = user.surname;
    originalValues.editLastname = user.lastname;
    originalValues.editEmail = user.email;
    originalValues.editPhoneNumber = user.phoneNumber;

    toggleUpdateButtonState(); // Llamamos a la función para verificar el estado del botón
};

const toggleUpdateButtonState = () => {
    const name = document.getElementById("editName").value;
    const surname = document.getElementById("editSurname").value;
    const lastname = document.getElementById("editLastname").value;
    const email = document.getElementById("editEmail").value;
    const phoneNumber = document.getElementById("editPhoneNumber").value;

    // Verificamos si hay campos vacíos o si los valores han cambiado
    const isModified =
        name !== originalValues.editName ||
        surname !== originalValues.editSurname ||
        email !== originalValues.editEmail ||
        phoneNumber !== originalValues.editPhoneNumber;

    const isAnyFieldEmpty = !name || !surname || !email || !phoneNumber;

    // Deshabilitar el botón si algún campo está vacío o si no hay cambios
    document.getElementById("saveButton").disabled = isAnyFieldEmpty || !isModified;
};

// Llamamos a la función cada vez que un campo cambie
document.addEventListener("DOMContentLoaded", function () {
    const inputs = document.querySelectorAll("#personalDataForm input");

    inputs.forEach(input => {
        input.addEventListener("input", toggleUpdateButtonState);
    });
});

const updateProfile = async () => {
    let updateUser = {
        id: document.getElementById("u_id").value,
        identificationName: document.getElementById("editName").value,
        username: document.getElementById("editUsername").value,
        surname: document.getElementById("editSurname").value,
        lastname: document.getElementById("editLastname").value,
        email: document.getElementById("editEmail").value,
        phoneNumber: document.getElementById("editPhoneNumber").value,
    };

    console.log(updateUser);

    Swal.fire({
        title: 'Modificar información',
        text: '¿Estás seguro de actualizar tu información?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, guardar cambios',
        cancelButtonText: 'Cancelar'
    }).then( async(result) => {
        if (result.isConfirmed) {

            await fetch(`${URL}/api/user/updateUser`, {
                method: 'PUT',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(updateUser)
            }).then(response => response.json()).then(async response => {
                await loadUserInfo();
                await sweetAlert('Operación exitosa', 'Información modificada correctamente', 'success');
                location.reload();
            }).catch(async ()=> {
                await sweetAlert('Error al actualizar', 'Ocurrió un error inesperado', 'error');
            });
        }
    });
};

const inputConfirmPassword = document.getElementById('confirmPassword');
const inputPasswordToChange = document.getElementById('newPassword');
const buttonChange = document.getElementById('changePasswordButton');
const currentPasswordInput = document.getElementById('currentPassword');
const allowedCharactersRegex = /^[a-zA-Z0-9.,#@!$%^&*()_\-+=]*$/;

function validatePasswords() {
    const passwordNew = inputPasswordToChange.value;
    const passwordToConfirm = inputConfirmPassword.value;
    const currentPassword = currentPasswordInput.value;

    // Verificar que ningún campo esté vacío
    if (passwordNew === '' || passwordToConfirm === '' || currentPassword === '') {
        inputPasswordToChange.classList.add('is-invalid');
        inputPasswordToChange.classList.remove('is-valid');
        inputConfirmPassword.classList.add('is-invalid');
        inputConfirmPassword.classList.remove('is-valid');
        buttonChange.disabled = true;
        return;
    }

    // Verificar que solo contengan caracteres permitidos
    if (!allowedCharactersRegex.test(passwordNew) || !allowedCharactersRegex.test(passwordToConfirm) || !allowedCharactersRegex.test(currentPassword)) {
        inputPasswordToChange.classList.add('is-invalid');
        inputPasswordToChange.classList.remove('is-valid');
        inputConfirmPassword.classList.add('is-invalid');
        inputConfirmPassword.classList.remove('is-valid');
        buttonChange.disabled = true;
        return;
    }

    // Verificar que la contraseña nueva y la confirmación coincidan
    if (passwordNew !== passwordToConfirm) {
        inputPasswordToChange.classList.add('is-invalid');
        inputPasswordToChange.classList.remove('is-valid');
        inputConfirmPassword.classList.add('is-invalid');
        inputConfirmPassword.classList.remove('is-valid');
        buttonChange.disabled = true;
        return;
    }

    // Verificar que currentPassword no sea igual a passwordToConfirm
    if (currentPassword === passwordToConfirm) {
        inputConfirmPassword.classList.add('is-invalid');
        inputConfirmPassword.classList.remove('is-valid');
        currentPasswordInput.classList.add('is-invalid');
        currentPasswordInput.classList.remove('is-valid');
        buttonChange.disabled = true;
        return;
    } else {
        // Restaurar la clase de currentPassword si no coincide con passwordToConfirm
        currentPasswordInput.classList.remove('is-invalid');
        currentPasswordInput.classList.add('is-valid');
    }

    // Si todo es válido, marcar como válido y habilitar el botón
    inputPasswordToChange.classList.remove('is-invalid');
    inputPasswordToChange.classList.add('is-valid');
    inputConfirmPassword.classList.remove('is-invalid');
    inputConfirmPassword.classList.add('is-valid');
    buttonChange.disabled = false;
}

inputPasswordToChange.addEventListener('keyup', function () {
    validatePasswords();
});

inputConfirmPassword.addEventListener('keyup', function () {
    validatePasswords();
});

currentPasswordInput.addEventListener('keyup', function () {
    validatePasswords();
});
// Toggle para la Contraseña Actual
document.getElementById('toggleCurrentPassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('currentPassword');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
});

// Toggle para la Nueva Contraseña
document.getElementById('toggleNewPassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('newPassword');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
});

// Toggle para la Confirmar Contraseña
document.getElementById('toggleConfirmPassword').addEventListener('click', function () {
    const passwordInput = document.getElementById('confirmPassword');
    const icon = this.querySelector('i');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
    }
});

(async()=>{
    if(role!=3){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    buttonChange.disabled = true;
    console.log(username);
    document.getElementById('userLogged').textContent = username;
    await loadUserInfo();

})()

const sweetAlert = async(titulo, descripcion, tipo)=>{
    await Swal.fire({title: `${titulo}`, text: `${descripcion}`, icon:`${tipo}`})
}

const changePassword = async () => {
    let updatePassword = {
        id: document.getElementById("u_id").value,
        oldPassword: document.getElementById("currentPassword").value,
        newPassword: document.getElementById("confirmPassword").value
    };

    console.log(updatePassword);

    Swal.fire({
        title: 'Modificar información',
        text: '¿Estás seguro de actualizar tu contraseña?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cambiar contraseña',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                const response = await fetch(`${URL}/api/user/changePassword`, {
                    method: 'PUT',
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(updatePassword)
                });

                if (response.ok) {
                    await sweetAlert('Operación exitosa', 'La contraseña se actualizó correctamente', 'success');
                    location.reload();
                } else if (response.status === 400) {
                    const errorData = await response.json();
                    console.error("Error 400:", errorData);
                    await sweetAlert('Error', 'La contraseña actual es incorrecta.', 'error');
                } else {
                    await sweetAlert('Error', 'Ocurrió un problema al actualizar la contraseña.', 'error');
                }

                await loadUserInfo();
            } catch (error) {
                console.error("Error al cambiar la contraseña:", error);
                await sweetAlert('Error', 'Hubo un problema inesperado al realizar la solicitud.', 'error');
            }
        }
    });
};
