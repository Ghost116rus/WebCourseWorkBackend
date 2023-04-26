import OrderModel from '../models/Order.js';

export const getAll = async (req, res) => {
    try {
        const orders = await OrderModel.find().exec();

        res.json(orders)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить историю",
        })
    }
};

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags,
            user: req.userId,
        });

        const post = await doc.save();

        res.json(post);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать статью",
        })
    }
}

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
}