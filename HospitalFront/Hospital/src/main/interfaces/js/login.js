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
            
            if(rol==1){
                window.location.replace('http://127.0.0.1:5500/html/nurse/list_owned_beds.html');
            }else if(rol==2){
                window.location.replace('http://127.0.0.1:5500/html/secretary/list_beds.html');
            }else if(rol==3){
                window.location.replace('http://127.0.0.1:5500/html/admin/list_users.html');
            }
        } else if (response.status === 404) {
            // Mostrar mensaje de error si las credenciales son incorrectas o el usuario no existe
            alert('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
        } else {
            // Manejo de otros posibles errores
            alert('Ocurrió un error inesperado. Inténtalo más tarde.');
        }
    } catch (error) {
        console.error('Error durante el login:', error);
        alert('No se pudo conectar con el servidor. Inténtalo más tarde.');
    }
};
