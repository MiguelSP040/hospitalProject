const URL = 'http://localhost:8080';
const token = localStorage.getItem('token');
const role = localStorage.getItem('rol');


let patientList = [];

const findAllPatientsNotDischarged = async () => {
    await fetch(`${URL}/api/patient/notDischarged`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
        
    }).then(response => response.json()).then(response => {
        console.log(response);
        patientList=null;
        patientList=response.data;
    }).catch(console.log);
}

const getBedsByNurse = async() => {
    await fetch(`${URL}/api/bed/findBedsByNurse/`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`, 
            "Content-Type": "application/json",
            "Accept": "application/json"  
        }
        
    }).then(response => response.json()).then(response => {
        console.log(response);
        projectList = response.data;
    }).catch(console.log);
}

const loadData = async () => {       
    await findAllPatientsNotDischarged(); 

    const patientSelect = document.getElementById("regPaciente");

    let patientContent = '';
    if (patientList.length === 0) {
        patientContent = `<option><small>No hay pacientes disponibles</small></option>`;
    }else{
        patientList.forEach(item => {
            patientContent += `<option value="${item.id}">${item.fullName} ${item.lastname} ${item.surname} </option>`;
        });
    }

    patientSelect.innerHTML = patientContent;
};

const loadBeds = async () =>{
    await findAllProjects();
    let tbody = document.getElementById('tbody');
    let content = '';
    
    projectList.forEach((item, index) => {
        content += `<tr>
                        <th scope="row">${index+1}</th>
                        <td>${item.name}</td>
                        <td>${item.identifier}</td>
                        <td>${item.startDate}</td>
                        <td>${item.estimatedDate}</td>
                        <td>${item.finishDate==null? "Indeterminada":item.finishDate}</td>
                        <td>
                        <span class="badge ${item.status ? 'text-bg-danger' : 'text-bg-success'}">
                        ${item.status ? "Finalizado":"En proceso"}
                        </span>
                        </td>
                        <td>${item.status ? "N/A" : item.currentPhase}</td>
                        <td class="text-center">
                            <button class="btn btn-outline-primary"  ${item.status ? "disabled":""}
                            onclick = "loadProject(${item.id_project})" data-bs-target="#updateModal" data-bs-toggle="modal" >
                            <i class="bi bi-pencil-square"></i></button>
                        </td>
                    </tr>`
    });
    tbody.innerHTML = content;
}

(async () => {
    if(role != 1){
        window.location.replace('http://127.0.0.1:5500/html/login.html');
    }
    loadBeds();
})();





