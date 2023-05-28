import OrderModel from '../models/Order.js';
import BookModel from '../models/Book.js';
import UserModel from '../models/User.js';
import RequestToReturn from "../models/RequestToReturn.js";
import Order from "../models/Order.js";


export const getActiveOrders = async (req, res) => {
    try {
        const orders = await OrderModel.find({isGiven: false}).populate("book").populate('reader');

        res.json(orders)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить активные заявки",
        })
    }
};

export const getActiveRequestToReturn = async (req, res) => {
    try {
        const requests = await RequestToReturn.find().populate("order");
        let orders = [];
        for (let i = 0; i <requests.length; i++)
        {
            let order = await OrderModel.findById({_id:  requests[i].order._id}).populate('book').populate('reader').exec();
            orders.push(order);
        }

        res.json(orders)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить заявки на возврат книги",
        })
    }
};

export const create = async (req, res) => {
    console.log("Wortk");
    try {
        console.log(Date.now() + 30)

        const user = await UserModel.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                msg: "Пользователь не был найден"
            })
        }
        if (user._doc.loyaltyPoints < 10) {
            return res.status(402).json({
                msg: "У вас недостаточно очков лояльности"
            })
        }

        const book = await BookModel.findById(req.body.bookId);

        if (!book) {
            return res.status(404).json({
                msg: "Книга не была найдена"
            })
        }
        if (book._doc.count < 1) {
            return res.status(402).json({
                msg: "Нет свободоного экземпляра книги"
            })
        }

        await UserModel.findByIdAndUpdate(req.userId, {loyaltyPoints: user._doc.loyaltyPoints - 10});
        await BookModel.findByIdAndUpdate(req.body.bookId, {count: book._doc.count - 1});

        const doc = new OrderModel({
            returnDate: Date.now() + (30 * 24 * 60 * 60 * 1000),
            reader: req.userId,
            book: req.body.bookId,
        });

        const order = await doc.save();

        res.json(order);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось оформить заявку",
        })
    }
}

/*
export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        const doc = await PostModel.findOne({_id: postId})

        if (!doc) {
            return res.status(404).json({
              message: 'Статья не найдена',
            });
          }   

        await PostModel.updateOne(
            {
                _id: postId,
            }, 
            {
                title: req.body.title,
                text: req.body.text,
                imageUrl: req.body.imageUrl,
                tags: req.body.tags,
            },
        );

        res.json({
            succes: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить статью",
        })
    }
}*/