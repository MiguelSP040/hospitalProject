function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('username');
    window.location.replace('http://127.0.0.1:5500/html/login.html')
}