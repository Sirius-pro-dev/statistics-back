import Student from "../models/student"
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import {log} from "node:util";

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

async function studentLogin({email, password}) {
    const student = await Student.findOne({email})
    if (!student || !bcrypt.compareSync(password, student.password)) {
        throw new Error(`Неправильная почта или пароль`);
    }
    return generateAccessToken(student._id, student.role)
}

// =====================================================================================================================
async function studentsCourse(query) {
    const {courseNumber} = query;
    return Student.find({courseNumber: parseInt(courseNumber)});
}

async function studentsSpecialty(query) {
    const {specialtyName} = query;
    return Student.find({specialty: specialtyName});
}

async function attendanceСhart() {
    // const {courseNumber} = query;

    // async function dailyAttendance(courseNumber, date) {
    //     const totalStudents = await Student.find({
    //         courseNumber: parseInt(courseNumber)
    //     })
    //
    //     const studentsAbsent = await Student.find({
    //             courseNumber: parseInt(courseNumber),
    //             passList: {
    //                 $elemMatch: {
    //                     date: date
    //                 }
    //             }
    //         }
    //     );
    //
    //     return ((totalStudents.length - studentsAbsent.length) / totalStudents.length) * 100;
    // }
    //
    // function printCurrentDateAndDay() {
    //     const currentDate = new Date();
    //     const dayOfWeek = (currentDate.getDay() + 6) % 7 + 1;
    //     const daysOfWeek = ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
    //     const pastDays = [];
    //
    //     for (let i = dayOfWeek - 1; i > 0; i--) {
    //         let previousDay = new Date();
    //         previousDay.setDate(currentDate.getDate() - i);
    //         let formattedPreviousDate = previousDay.toLocaleDateString('ru-RU', {
    //             day: 'numeric',
    //             month: 'numeric',
    //             year: 'numeric'
    //         });
    //         let previousDayOfWeek = (previousDay.getDay() + 6) % 7 + 1;
    //         let previousDayName = daysOfWeek[previousDayOfWeek];
    //         pastDays.push({date: formattedPreviousDate, daysOfWeek: previousDayName});
    //     }
    //
    //     return pastDays
    // }
    //
    // const pastDays = printCurrentDateAndDay();
    // const promises = pastDays.map(day => dailyAttendance(courseNumber, day.date));
    //
    // const statistics = await Promise.all(promises);
    // const statisticsDays = pastDays.map((day, index) => statistics[index]);
    //
    // console.log(statisticsDays);

    return {
        course1: [30, 40, 20, 50, 40, 80, 90],
        course2: [20, 50, 15, 50, 30, 70, 95],
        course3: [10, 90, 55, 30, 30, 80, 40]
    }
    // return statisticsDays;
}











async function quantityStudentCourse() {
    return [50, 60, 100]
}


















async function attendancePerWeek() {
    const test = [4000, 3000, 2000, 2780, 1890, 2390]
    console.log(test)
    return test
}

async function dailyAttendance() {
    const test = '70'
    console.log(test)
    return test
}

async function studentsPassList({id}) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    return student.passList
}

async function studentsPassListAdd({id}, {lack}) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }

    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    const currentDate = new Date();
    const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

    student.passList.push({
        lack: lack,
        date: formattedDate
    })

    await student.save()
    return student
}

async function studentsScholarship({id}) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    return student.scholarship
}

async function studentsFormOfTraining({id}) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    return student.formOfTraining
}

async function studentGrades({id}) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }

    return student.grades

    // const sum = student.grades.reduce((acc, num) => acc + num, 0);
    // const average = sum / student.grades.length;
    // return average.toFixed(2);
}

async function studentGradesAdd({id}, {grade}) {
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

    function processNumber(number) {
        if (number < 1 || number > 5) {
            throw new Error("Пожалуйста, введите корректную оценку")
        }

        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}.${(currentDate.getMonth() + 1).toString().padStart(2, '0')}.${currentDate.getFullYear()}`;

        return {
            number: number,
            date: formattedDate
        }
    }

    student.grades.push(processNumber(grade));
    await student.save();

    return student;
}

// =====================================================================================================================
async function studentsAll() {
    return Student.find()
}

async function studentID({id}) {
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`Некорректный формат идентификатора`)
    }
    const student = await Student.findById(id)
    if (!student) {
        throw new Error(`Нет такого студента`)
    }
    return student
}

export default {
    studentRegistration,
    studentLogin,
    studentsCourse,
    studentsSpecialty,
    attendanceСhart,
    quantityStudentCourse,
    attendancePerWeek,
    dailyAttendance,
    studentsPassList,
    studentsPassListAdd,
    studentsScholarship,
    studentsFormOfTraining,
    studentGrades,
    studentsAll,
    studentID,
    studentGradesAdd
}
