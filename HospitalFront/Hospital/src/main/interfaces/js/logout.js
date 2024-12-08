function logout() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: 'Se cerrará tu sesión y volverás a la pantalla de inicio de sesión.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, cerrar sesión',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            // El usuario confirmó cerrar sesión
            localStorage.removeItem('token');
            localStorage.removeItem('rol');
            localStorage.removeItem('username');
            Swal.fire({
                title: 'Sesión cerrada',
                text: 'Has cerrado tu sesión exitosamente.',
                icon: 'success',
                confirmButtonText: 'Entendido'
            }).then(() => {
                window.location.replace('http://127.0.0.1:5500/html/login.html');
            });
        }
    });
}
