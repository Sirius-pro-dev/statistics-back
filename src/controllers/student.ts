import Student from "../models/student"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "24h"})
}

async function studentRegistration({
        firstname,
        lastname,
        courseNumber,
        specialty,
        scholarship,
        formOfTraining,
        email,
        password
    }) {
    const candidate = await Student.findOne({email})
    if (candidate) {
        throw new Error(`Пользователь c почтой ${email} уже существует`)
    }
    const hashPassword = bcrypt.hashSync(password, 7)
    return await Student.create({
        firstname,
        lastname,
        courseNumber,
        specialty,
        scholarship,
        formOfTraining,
        email,
        password: hashPassword
    })
}

async function studentLogin({ email, password }) {
    const student = await Student.findOne({email})
    if (!student || !bcrypt.compareSync(password, student.password)) {
        throw new Error(`Неправильная почта или пароль`);
    }
    return generateAccessToken(student._id, student.role)
}

// =====================================================================================================================
async function studentsCourse({ courseNumber }) {
    return Student.find({ courseNumber });
}

async function studentsSpecialty({ specialty }) {
    return Student.find({ specialty });
}

async function studentsPassList({ id }, { maxAttendance }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    return ((student.passList.length / maxAttendance) * 100).toFixed(2) + "%";
}

async function studentsPassListAdd({ id }, { lack }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    student.passList.push(lack)
    await student.save();

    return student
}

async function studentsScholarship({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    return student.scholarship
}

async function studentsFormOfTraining({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    return student.formOfTraining
}

async function studentGrades({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    function calculateAverage(numbers) {
        if (!Array.isArray(numbers) || numbers.length === 0) {
            return "Оценок нет";
        }

        const sum = numbers.reduce((acc, num) => acc + num, 0);
        const average = sum / numbers.length;
        return average.toFixed(2);
    }

    return calculateAverage(student.grades)
}
// =====================================================================================================================
async function studentsAll() {
    return Student.find()
}

async function studentID({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    return student
}

// async function studentGrades({ id }) {
//     if (!/^[0-9a-fA-F]{24}$/.test(id)) {
//         throw new Error(`Некорректный формат идентификатора`)
//     }
//     const student = await Student.findById(id);
//     if (!student) {
//         throw new Error(`Нет такого студента`)
//     }
//     return student.grades
// }

async function studentGradesAdd({ id }, { grade }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id);
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    if (!grade) {
        throw new Error(`Некорректный формат тела запроса`)
    }

    student.grades.push(grade);
    await student.save();

    return student;
}

export default {
    studentRegistration,
    studentLogin,
    studentsCourse,
    studentsSpecialty,
    studentsPassList,
    studentsPassListAdd,
    studentsScholarship,
    studentsFormOfTraining,
    studentGrades,
    studentsAll,
    studentID,
    studentGradesAdd
}
