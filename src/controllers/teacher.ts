import Teacher from "../models/teacher";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateAccessToken = (id, role) => {
    const payload = {
        id,
        role
    }
    return jwt.sign(payload, process.env.SECRET_KEY, {expiresIn: "24h"})
}

async function teacherRegistration({ email, password, firstname, lastname }) {
    const candidate = await Teacher.findOne({email})
    if (candidate) {
        throw new Error(`Пользователь c почтой ${email} уже существует`)
    }
    const hashPassword = bcrypt.hashSync(password, 7)
    return await Teacher.create({email, password: hashPassword, firstname, lastname})
}

async function teacherLogin({ email, password }) {
    const teacher = await Teacher.findOne({email})
    const validPassword = bcrypt.compareSync(password, teacher.password)
    if (!validPassword || !teacher) {
        throw new Error(`Неправельная почта или пароль`)
    }
    return generateAccessToken(teacher._id, teacher.role)
}

async function teachersAll() {
    return Teacher.find()
}

async function teacherID({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const teacher = await Teacher.findById(id)
    if (!teacher) {
        throw new Error(`Нет такого студента`)
    }
    return teacher
}

async function teacherSubject({ id }) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const teacher = await Teacher.findById(id)
    if (!teacher) {
        throw new Error(`Нет такого студента`)
    }
    return teacher.subject
}

export default {
    teacherRegistration,
    teacherLogin,
    teachersAll,
    teacherID,
    teacherSubject
}
