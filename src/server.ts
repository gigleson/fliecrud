
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const app = express();
const PORT = 3000;

// Student interface
interface Student {
    id: string;
    name: string;
    age: number;
    course: string;
}

// File path
const filePath = path.join(
    process.cwd(),
    'data',
    'students.txt'
);

// Create data folder and file automatically
if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), {
        recursive: true
    });
}

if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]');
}


app.use(express.json());
app.use(express.static(
    path.join(process.cwd(), 'public')
));

// Test route
app.get('/', (req, res) => {
    res.sendFile(
        path.join(process.cwd(), 'public', 'index.html')
    );
});

// Read students
function getStudents(): Student[] {
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(path.dirname(filePath), {
            recursive: true
        });
        fs.writeFileSync(filePath, '[]');
    }

    const data = fs.readFileSync(filePath, 'utf8');

    return JSON.parse(data || '[]') as Student[];
}

// Save students
function saveStudents(students: Student[]): void {
    fs.writeFileSync(
        filePath,
        JSON.stringify(students, null, 2)
    );
}

// CREATE student
app.post('/students', (req: Request, res: Response) => {
    const { name, age, course } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof course !== 'string' || !course.trim() ||
        !Number.isInteger(Number(age)) ||
        Number(age) <= 0
    ) {
        return res.status(400).json({
            message: 'Please enter valid student details'
        });
    }

    const students = getStudents();

    const student: Student = {
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
app.get('/students', (req: Request, res: Response) => {
    const students = getStudents();
    res.json(students);
});

// UPDATE student
app.put('/students/:id', (req: Request, res: Response) => {
    const students = getStudents();

    const student = students.find(
        s => s.id === req.params.id
    );

    if (!student) {
        return res.status(404).json({
            message: 'Student not found'
        });
    }

    const { name, age, course } = req.body;

    if (
        typeof name !== 'string' || !name.trim() ||
        typeof course !== 'string' || !course.trim() ||
        !Number.isInteger(Number(age)) ||
        Number(age) <= 0
    ) {
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
app.delete('/students/:id', (req: Request, res: Response) => {
    const students = getStudents();

    const updatedStudents = students.filter(
        s => s.id !== req.params.id
    );

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

