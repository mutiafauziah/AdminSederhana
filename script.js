
const defaultData = [{
        id: 1,
        nama: "Budi Santoso",
        alamat: "Yogyakarta",
        gender: "Laki-laki",
        tanggal: "2026-06-01",
        jamMasuk: "08:00",
        jamKeluar: "17:00"
    },
    {
        id: 2,
        nama: "Siti Aminah",
        alamat: "Sleman",
        gender: "Perempuan",
        tanggal: "2026-06-02",
        jamMasuk: "07:55",
        jamKeluar: "17:05"
    },
    {
        id: 3,
        nama: "Andi Wijaya",
        alamat: "Bantul",
        gender: "Laki-laki",
        tanggal: "2026-06-02",
        jamMasuk: "08:15",
        jamKeluar: "17:00"
    },
    {
        id: 4,
        nama: "Rina Olivia",
        alamat: "Kulon Progo",
        gender: "Perempuan",
        tanggal: "2026-06-03",
        jamMasuk: "08:00",
        jamKeluar: "17:00"
    }
];


let employees = JSON.parse(localStorage.getItem('employees')) || defaultData;
if (!localStorage.getItem('employees')) {
    localStorage.setItem('employees', JSON.stringify(employees));
}


let currentPage = 1;
const rowsPerPage = 3;


function saveAttendance(event) {
    event.preventDefault();

    const nama = document.getElementById('nama').value;
    const alamat = document.getElementById('alamat').value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    const tanggal = document.getElementById('tanggal').value;
    const jamMasuk = document.getElementById('jamMasuk').value;
    const jamKeluar = document.getElementById('jamKeluar').value;

    const newRecord = {
        id: Date.now(), 
        nama,
        alamat,
        gender,
        tanggal,
        jamMasuk,
        jamKeluar
    };

    employees.push(newRecord);
    localStorage.setItem('employees', JSON.stringify(employees));

    alert('Data absensi berhasil disimpan!');
    window.location.href = 'index.html';
}


function renderTable() {
    const tableBody = document.getElementById('employeeTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

   
    let start = (currentPage - 1) * rowsPerPage;
    let end = start + rowsPerPage;
    let paginatedItems = employees.slice(start, end);

    if (paginatedItems.length === 0 && currentPage > 1) {
        currentPage--;
        renderTable();
        return;
    }

    paginatedItems.forEach(emp => {
        const row = `
            <tr>
                <td class="fw-bold">${emp.nama}</td>
                <td>${emp.alamat}</td>
                <td><span class="badge ${emp.gender === 'Laki-laki' ? 'bg-info' : 'bg-warning'} text-dark">${emp.gender}</span></td>
                <td>${emp.tanggal}</td>
                <td><i class="fa-regular fa-clock text-success"></i> ${emp.jamMasuk}</td>
                <td><i class="fa-regular fa-clock text-danger"></i> ${emp.jamKeluar}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-warning me-1" onclick="openEditModal(${emp.id})">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteEmployee(${emp.id})">
                        <i class="fa-solid fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });

    renderPagination();
}


function sortData() {
    const sortBy = document.getElementById('sortBy').value;

    if (sortBy === 'nama-asc') {
        employees.sort((a, b) => a.nama.localeCompare(b.nama));
    } else if (sortBy === 'nama-desc') {
        employees.sort((a, b) => b.nama.localeCompare(a.nama));
    } else if (sortBy === 'tanggal-desc') {
        employees.sort((a, b) => new Date(b.tanggal) - new Date(a.tanggal));
    } else if (sortBy === 'tanggal-asc') {
        employees.sort((a, b) => new Date(a.tanggal) - new Date(b.tanggal));
    }

    currentPage = 1; 
    renderTable();
}


let bootstrapModal;

function openEditModal(id) {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;

    document.getElementById('editId').value = emp.id;
    document.getElementById('editNama').value = emp.nama;
    document.getElementById('editAlamat').value = emp.alamat;
    document.getElementById('editGender').value = emp.gender;
    document.getElementById('editTanggal').value = emp.tanggal;
    document.getElementById('editJamMasuk').value = emp.jamMasuk;
    document.getElementById('editJamKeluar').value = emp.jamKeluar;

    bootstrapModal = new bootstrap.Modal(document.getElementById('editModal'));
    bootstrapModal.show();
}


const editForm = document.getElementById('editForm');
if (editForm) {
    editForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const id = parseInt(document.getElementById('editId').value);

        const empIndex = employees.findIndex(e => e.id === id);
        if (empIndex !== -1) {
            employees[empIndex] = {
                id: id,
                nama: document.getElementById('editNama').value,
                alamat: document.getElementById('editAlamat').value,
                gender: document.getElementById('editGender').value,
                tanggal: document.getElementById('editTanggal').value,
                jamMasuk: document.getElementById('editJamMasuk').value,
                jamKeluar: document.getElementById('editJamKeluar').value,
            };

            localStorage.setItem('employees', JSON.stringify(employees));
            bootstrapModal.hide();
            alert('Data berhasil di-update!');
            renderTable();
        }
    });
}


function deleteEmployee(id) {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
        employees = employees.filter(emp => emp.id !== id);
        localStorage.setItem('employees', JSON.stringify(employees));
        renderTable();
    }
}


function renderPagination() {
    const container = document.getElementById('paginationContainer');
    if (!container) return;

    container.innerHTML = '';
    const pageCount = Math.ceil(employees.length / rowsPerPage);

    for (let i = 1; i <= pageCount; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<button class="page-link" onclick="goToPage(${i})">${i}</button>`;
        container.appendChild(li);
    }
}

function goToPage(page) {
    currentPage = page;
    renderTable();
}
