import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';


import UserModel from '../models/User.js';
import OrderModel from '../models/Order.js';
import BookModel from "../models/Book.js";
import RequestToReturn from "../models/RequestToReturn.js";

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

        const userRole = user._doc.role;

        res.json({
            userRole,
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
        result['notGiven'] = await OrderModel.find({reader: {_id: userData._id}, isGiven: false}).populate("book");
        result['active'] = await OrderModel.find({reader: {_id: userData._id}, isGiven: true, isReturned: false}).populate("book");
        result['history'] = await OrderModel.find({reader: {_id: userData._id}}).populate("book");

        res.json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Нет доступа',
        })
    }
};


export const notRecieveBook = async (req, res) => {
    try {
        console.log(req.body)
        const order = await OrderModel.findById(req.body.id).populate("book");
        console.log(order)
        if (!order) {
            return res.status(404).json({
                msg: "Заявка не была найдена"
            })
        }

        await OrderModel.updateOne(
            {
                _id: order._id,
            },
            {
                returnDate: Date.now(),
                isGiven: true,
                isReturned: true,
            },
        );

        await UserModel.findByIdAndUpdate(req.userId, {$inc: { loyaltyPoints: 10 }});
        await BookModel.findByIdAndUpdate(order.book._id, {$inc: { count: 1 }});

        res.json({
            success: true,
        })


    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "ошибка"
        })
    }
}

export const reqToReturn = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.body.id).populate("book");

        const request = await RequestToReturn.find({order: {_id:  order._id}}).exec();

        if (request.length === 0)
        {
            const doc = new RequestToReturn({
                order: order._id,
            });

            await doc.save();
            res.json({msg: "Заявка на возврат успешно оформлена"});
        } else {
            console.log(request)
            res.json({msg: "Заявка на возврат уже была оформлена! Подойдите к библиотекарю"});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось оформить заявку на возврат",
        })
    }
}
