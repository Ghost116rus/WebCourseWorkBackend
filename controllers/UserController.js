import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


import UserModel from '../models/User.js';
import OrderModel from '../models/Order.js';

const sercterKey = "sercer123";

export const register = async (req, res) => {
    try {   
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);
    
        const doc = new UserModel({
            email: req.body.email,
            fullName: req.body.fullName,
            mobilePhone: req.body.mobilePhone,
            role: req.body.role,
            passwordHash: hash,
        });    
        const user = await doc.save();
    
        const token = jwt.sign({
            _id: user._id,
            _role: user.role,
        }, sercterKey,
        {
            expiresIn: '30d',
        }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Не удалось зарегистрироваться',
        })
    }
};

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email });

        if (!user) {
            return res.status(404).json({
                msg: 'Неверный логин или пароль'
            });
        }

        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);

        if(!isValidPass) {
            return res.status(403).json({
                msg: 'Неверный логин или пароль'
            });
        }

        const token = jwt.sign({
            _id: user._id,
            _role: user.role,
        }, sercterKey,
        {
            expiresIn: '30d',
        }
        );

        const userRole = user._doc.role;

        res.json({
            userRole,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Не удалось авторизоваться',
        })
    }
};

export const getMe = async (req, res) => {
    try {

        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                msg: "Пользователь не был найден"
            })
        }
        const result = {};
        const { passwordHash, role, ...userData } = user._doc;
        result['userData'] = userData;
        result['history'] = await OrderModel.find({reader: {_id: userData._id}}).populate("book");

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Нет доступа',
        })
    }
};