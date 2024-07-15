const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcrypt');

const userController = {
    register: async (req, res) => {
        const {email, name, password} = req.body;
        
        // Проверяем все ли данные пришли 

        if(!email || !name || !password){
            return res.status(400).json({
                message: 'Все данные должны быть заолнены'
            })
        }

        try {
            // Проверяем зарегистрирован ли Email
            const existingUser = await prisma.user.findUnique({
                where: {email}
            })

            if(existingUser){
                return res.status(400).json({
                    message: 'Пользователь с таким email уже существует'
                })
            }

            const hashedPassword =  await bcrypt.hash(password, 10);
            
            const user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: hashedPassword
                }
            })

            res.status(200).json(user)

        } catch (error) {
            res.status(500).json({
                message: error,
            })
        }
    },
    login: async (req , res) => {
        const  {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: 'Пользователь с таким email уже существует'
            })
        }
        try {
            const user = await prisma.user.findUnique({
                where: {
                    email,
                }
            })

            if(!user){
                return res.status(400).json({
                    message: 'Невеврный логин или пароль'
                })
            }

            const valid = await bcrypt.compare(password, user.password)

            if(!valid){
                return res.status(400).json({
                    message: 'Неверный логин или пароль'
                })
            }

            res.status(200).json(user)

        } catch (error) {
            res.status(500).json({
                message: 'Internal server error' + error
            })
        }
    }   
}

module.exports = userController;