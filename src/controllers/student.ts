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

export async function studentRegistration({ email, password, firstname, lastname }) {
    const candidate = await Student.findOne({email})
    if (candidate) {
        throw new Error(`Пользователь c почтой ${email} уже существует`)
    }
    const hashPassword = bcrypt.hashSync(password, 7)
    return await Student.create({email, password: hashPassword, firstname, lastname})
}

export async function studentLogin({ email, password }) {
    const student = await Student.findOne({email})
    const validPassword = bcrypt.compareSync(password, student.password)
    if (!validPassword || !student) {
        throw new Error(`Неправельная почта или пароль`)
    }
    return generateAccessToken(student._id, student.role)
}

export async function studentsAll() {
    return Student.find()
}

export async function studentID({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    return student
}

export async function studentGrades({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id);
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    return student.grades
}

export async function studentGradesAdd({ id, grade }) {
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
    return await Student.create(student.grades.push(grade))
}
