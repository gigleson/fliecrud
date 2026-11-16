"use strict";
const API = '/students';
async function loadStudents() {
    const response = await fetch(API);
    const students = await response.json();
    const list = document.getElementById('studentList');
    list.innerHTML = '';
    students.forEach((student) => {
        const row = document.createElement('tr');
        const values = [
            student.id,
            student.name,
            String(student.age),
            student.course
        ];
        values.forEach(value => {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.appendChild(cell);
        });
        const actionCell = document.createElement('td');
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.className = 'edit';
        editBtn.onclick = () => editStudent(student);
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.className = 'delete';
        deleteBtn.onclick = () => deleteStudent(student.id);
        actionCell.append(editBtn, deleteBtn);
        row.appendChild(actionCell);
        list.appendChild(row);
    });
}
async function saveStudent() {
    const id = document.getElementById('studentId').value;
    const student = {
        name: document.getElementById('name').value.trim(),
        age: Number(document.getElementById('age').value),
        course: document.getElementById('course').value.trim()
    };
    if (!student.name || !student.course ||
        !Number.isInteger(student.age) || student.age <= 0) {
        alert('Please enter valid details');
        return;
    }
    const response = await fetch(id ? `${API}/${encodeURIComponent(id)}` : API, {
        method: id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student)
    });
    const result = await response.json();
    if (!response.ok) {
        alert(result.message);
        return;
    }
    alert(result.message);
    clearForm();
    loadStudents();
}
function editStudent(student) {
    document.getElementById('studentId').value = student.id;
    document.getElementById('name').value = student.name;
    document.getElementById('age').value = String(student.age);
    document.getElementById('course').value = student.course;
    document.getElementById('formTitle').textContent = 'Update Student';
    document.getElementById('saveBtn').textContent = 'Update Student';
}
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete?'))
        return;
    const response = await fetch(`${API}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    const result = await response.json();
    alert(result.message);
    if (response.ok)
        loadStudents();
}
function clearForm() {
    document.getElementById('studentId').value = '';
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('course').value = '';
    document.getElementById('formTitle').textContent = 'Add New Student';
    document.getElementById('saveBtn').textContent = 'Add Student';
}
loadStudents();
