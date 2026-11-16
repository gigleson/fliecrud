"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = 3000;
// File path
const filePath = path_1.default.join(__dirname, '../../data/students.txt');
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
// Read students
function getStudents() {
    if (!fs_1.default.existsSync(filePath)) {
        fs_1.default.mkdirSync(path_1.default.dirname(filePath), {
            recursive: true
        });
        fs_1.default.writeFileSync(filePath, '[]');
    }
    const data = fs_1.default.readFileSync(filePath, 'utf8');
    return JSON.parse(data || '[]');
}
// Save students
function saveStudents(students) {
    fs_1.default.writeFileSync(filePath, JSON.stringify(students, null, 2));
}
// CREATE student
app.post('/students', (req, res) => {
    const { name, age, course } = req.body;
    if (typeof name !== 'string' || !name.trim() ||
        typeof course !== 'string' || !course.trim() ||
        !Number.isInteger(Number(age)) ||
        Number(age) <= 0) {
        return res.status(400).json({
            message: 'Please enter valid student details'
        });
    }
    const students = getStudents();
    const student = {
        id: Date.now().toString(),
        name: name.trim(),
        age: Number(age),
        course: course.trim()
    };
    students.push(student);
    saveStudents(students);
    res.status(201).json({
        message: 'Student added successfully',
        student
    });
});
// READ students
app.get('/students', (req, res) => {
    const students = getStudents();
    res.json(students);
});
// UPDATE student
app.put('/students/:id', (req, res) => {
    const students = getStudents();
    const student = students.find(s => s.id === req.params.id);
    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }
    const { name, age, course } = req.body;
    if (typeof name !== 'string' || !name.trim() ||
        typeof course !== 'string' || !course.trim() ||
        !Number.isInteger(Number(age)) ||
        Number(age) <= 0) {
        return res.status(400).json({
            message: 'Please enter valid student details'
        });
    }
    student.name = name.trim();
    student.age = Number(age);
    student.course = course.trim();
    saveStudents(students);
    res.json({
        message: 'Student updated successfully'
    });
});
// DELETE student
app.delete('/students/:id', (req, res) => {
    const students = getStudents();
    const updatedStudents = students.filter(s => s.id !== req.params.id);
    if (students.length === updatedStudents.length) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }
    saveStudents(updatedStudents);
    res.json({
        message: 'Student deleted successfully'
    });
});
// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
