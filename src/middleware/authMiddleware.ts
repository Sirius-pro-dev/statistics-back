const jwt = require('jsonwebtoken')

export const authMiddleware = (req, res, next) => {
    if (req.method === "OPTIONS") {
        next();
    }
    try {
        const token = req.headers.authorization.split(' ')[1]
        if (!token) {
            return res.status(403).send({message: "Пользователь не авторизован", success: false});
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userRole = decoded.role;
        if (userRole != "Преподаватель"){
            return res.status(403).send({message: "Нет доступа", success: false});
        }
        next();
    } catch (e) {
        console.log(e)
        return res.status(403).send({message: "Пользователь не авторизован", success: false})
    }
};
