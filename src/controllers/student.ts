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

async function studentRegistration({ email, password, firstname, lastname }) {
    const candidate = await Student.findOne({email})
    if (candidate) {
        throw new Error(`Пользователь c почтой ${email} уже существует`)
    }
    const hashPassword = bcrypt.hashSync(password, 7)
    return await Student.create({email, password: hashPassword, firstname, lastname})
}

async function studentLogin({ email, password }) {
    const student = await Student.findOne({email})
    if (!student || !bcrypt.compareSync(password, student.password)) {
        throw new Error(`Неправильная почта или пароль`);
      }
    return generateAccessToken(student._id, student.role)
}

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

async function studentGrades({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id);
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    return student.grades
}

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
    studentsAll,
    studentID,
    studentGrades,
    studentGradesAdd
}
