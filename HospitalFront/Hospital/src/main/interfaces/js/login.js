let form = document.getElementById('loginForm');
let formButton = document.getElementById('formButton');
let user={};
let rol;

formButton.addEventListener('click', async (event) => {
    if (!form.checkValidity()) {
        event.preventDefault();
    } else {
        await login();
    }
    form.classList.add('was-validated');
});


const login = async () => {
    let dto = {
        password: document.getElementById('password').value,
        user: document.getElementById('username').value,
    };

    try {
        // Realiza la petición al servidor
        const response = await fetch('http://localhost:8080/auth', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dto),
        });

        // Verifica si el usuario existe o las credenciales son válidas
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.data);
            localStorage.setItem('username', dto.user);


            const findUserRole = async() => {
                await fetch(`http://localhost:8080/api/role/${dto.user}`, {
                    method: 'GET',
                    headers: {
                        "Authorization": `Bearer ${data.data}`, 
                        "Content-Type": "application/json",
                        "Accept": "application/json"  
                    }
                    
                }).then(response => response.json()).then(response => {
                    rol = response.data;
                    console.log(rol);
                }).catch(console.log);
            }

            await findUserRole();
            localStorage.setItem('rol', rol);
            await Swal.fire({
                title: 'Inicio de sesión correcto',
                text: 'Redirigiendo...',
                icon: 'success',
                confirmButtonText: 'Entendido'
            });
            if(rol==1){
                window.location.replace('http://127.0.0.1:5500/html/nurse/list_owned_beds.html');
            }else if(rol==2){
                window.location.replace('http://127.0.0.1:5500/html/admin/list_users.html');
            }else if(rol==3){
                window.location.replace('http://127.0.0.1:5500/html/secretary/list_beds.html');
            }

        } else if (response.status === 404) {
            // Mostrar mensaje de error si las credenciales son incorrectas o el usuario no existe
            await Swal.fire({
                title: 'Alerta o usuario incorrectos',
                text: 'Inténtalo de nuevo',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            form.reset();
        } else {
            // Manejo de otros posibles errores
            await Swal.fire({
                title: 'Operacion fallida',
                text: 'Inténtalo de nuevo',
                icon: 'error',
                confirmButtonText: 'Entendido'
            });
            form.reset();
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        await Swal.fire({
            title: 'Operacion fallida',
            text: 'Inténtalo de nuevo',
            icon: 'error',
            confirmButtonText: 'Entendido'
        });
        form.reset();
    }
};
