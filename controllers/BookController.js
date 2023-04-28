import BookModel from '../models/Book.js';

export const getAll = async (req, res) => {
    try {
        const books = await BookModel.find().exec();

        res.json(books)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить ккниги",
        })
    }
};

export const getBooksByName = async (req, res) => {
    try {

        const books = await BookModel.find({title: new RegExp(req.body.bookName )}).exec();

        if(books.length === 0)
        {
            return res.status(404).json({
                message: "Не удалось найти книги"
            })
        }

        res.json(books)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить ккниги",
        })
    }
};

export const getBooksByAuthor = async (req, res) => {
    try {

        const books = await BookModel.find({"authors" : { $in : [req.body.author]  } }).exec();

        if(books.length === 0)
        {
            return res.status(404).json({
                message: "Не удалось найти книги"
            })
        }

        res.json(books)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить ккниги",
        })
    }
};

export const getBooksByGenre = async (req, res) => {
    try {

        const books = await BookModel.find({"genres" : { $in : [req.body.genre]  } }).exec();

        if(books.length === 0)
        {
            return res.status(404).json({
                message: "Не удалось найти книги"
            })
        }

        res.json(books)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить ккниги",
        })
    }
};

export const getBookById = async (req, res) => {
    try {
        const bookId = req.params.id;

        const book = await BookModel.findById(bookId).exec();

        if (!book)
        {
            return res.status(404).json({
                message: 'Книга не найдена',
            });
        }

        console.log("Success");
        return res.json(book);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось получить книгу",
        })
    }
};

export const remove = (req, res) => {
    try {
        const bookId = req.params.id;

        BookModel.findOneAndDelete({
            _id: bookId,
        }).then(
            (doc) => {
                if (!doc) {
                    return res.status(404).json({
                        message: 'Книга не найдена',
                    });
                }
                res.json({
                    succes: true,
                });
            })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось удалить книгу",
        })
    }
};

export const create = async (req, res) => {

    try {
        const doc = new BookModel({
            title: req.body.title,
            isbn: req.body.isbn,
            publisher: req.body.publisher,
            year: req.body.year,
            volume: req.body.volume,
            imageUrl: req.body.imageUrl,
            authors: req.body.authors,
            genres: req.body.genres,

            description: req.body.description,
            count: req.body.count,
        });

        const book = await doc.save();

        res.json({
            succes: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось создать книгу",
        })
    }
}

export const update = async (req, res) => {
    try {
        const bookId = req.params.id;

        const doc = await BookModel.findOne({_id: bookId})

        if (!doc) {
            return res.status(404).json({
                message: 'Книга не найдена',
            });
        }

        await BookModel.updateOne(
            {
                _id: bookId,
            },
            {
                title: req.body.title,
                isbn: req.body.isbn,
                publisher: req.body.publisher,
                year: req.body.year,
                volume: req.body.volume,
                description: req.body.description,
                imageUrl: req.body.imageUrl,
                authors: req.body.authors,
                genres: req.body.genres,

                count: req.body.count,
            },
        );

        res.json({
            success: true,
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не удалось обновить книгу",
        })
    }
}