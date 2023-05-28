import UserModel from '../models/User.js';
import GenreModel from "../models/Genre.js";


export const getAllLibrarians = async (req, res) => {
    try {
        const librarians = await UserModel.find({role: 2}).exec();

        res.json(librarians)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить жанры",
        })
    }
};

export const removeGenre = (req, res) => {
    try {
        const genreId = req.params.id;
        console.log(genreId);

        GenreModel.findOneAndDelete({
            _id: genreId,
        }).then(
            (doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Жанр не найден',
                    });
                }
                res.json({
                    success: true,
                });
            })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось удалить жанр",
        })
    }
};
