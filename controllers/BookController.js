import BookModel from '../models/Book.js';
import GenreModel from '../models/Genre.js';

function LineString(array) {
    var inLineString = "";

    array.map(author =>{
        inLineString = inLineString + author + ", ";
    })

    return inLineString.slice(0, -2);
}

function GetLightDataAboutBooks (booksData) {
    const books = [];

    booksData.map(book => {
        books.push({
            _id: book._id,
            title: book.title,
            year: book.year,
            description: book.description,
            imageUrl: book.imageUrl,
            authors: LineString(book.authors),
        })
    })

    return books;
}

export const getAll = async (req, res) => {
    let {genre, limit, page} = req.query;
    page = page || 1
    limit = limit || 9
    let offset = page * limit - limit
    let books;
    let count;

    try {
        if (genre)
        {
            books = await BookModel.find({"genres" : { $in : [genre]  } })
                .limit(limit).skip(offset).exec();
            count = await BookModel.count({"genres" : { $in : [genre]  } }).exec();
        } else {
            books = await BookModel.find()
                .limit(limit).skip(offset).exec();
            count = await BookModel.count().exec();
        }

        if(count === 0)
        {
            return res.status(404).json({
                msg: "Не удалось найти книги"
            })
        }

        res.json({books: GetLightDataAboutBooks(books), count: count});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить книги",
        })
    }
};

export const searchBooks = async (req, res) => {

    let {name, type, limit, page} = req.query;
    page = page || 1
    limit = limit || 9
    let offset = page * limit - limit
    let books;
    let count;

    try {

        if (type === "0")
        {

            books = await BookModel.find({title: new RegExp(name)})
                .limit(limit).skip(offset).exec();

            count = await BookModel.count({title: new RegExp(name)}).exec();

        } else {

            books = await BookModel.find({"authors" : { $in : [name]  } })
                .limit(limit).skip(offset).exec();
            count = await BookModel.count({"authors" : { $in : [name]  } }).exec();
        }

        //console.log(books);

        if(count === 0)
        {
            return res.status(404).json({
                msg: "Не удалось найти книги"
            })
        }

        res.json({books: GetLightDataAboutBooks(books), count: count});

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить книги",
        })
    }
};

export const getBooksByAuthor = async (req, res) => {
    try {

        const books = await BookModel.find({"authors" : { $in : [req.body.author]  } }).exec();

        if(books.length === 0)
        {
            return res.status(404).json({
                msg: "Не удалось найти книги"
            })
        }

        res.json(GetLightDataAboutBooks(books));

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить книги",
        })
    }
};

export const getBooksByGenre = async (req, res) => {
    try {

        const books = await BookModel.find({"genres" : { $in : [req.body.genre]  } }).exec();

        if(books.length === 0)
        {
            return res.status(404).json({
                msg: "Не удалось найти книги"
            })
        }

        res.json(GetLightDataAboutBooks(books));

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить ккниги",
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
                msg: 'Книга не найдена',
            });
        }

        book.authors = LineString(book.authors);
        book.genres = LineString(book.genres);


        return res.json(book);

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить книгу",
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
                    success: true,
                });
            })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось удалить книгу",
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
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось создать книгу",
        })
    }
}

export const update = async (req, res) => {
    try {
        const bookId = req.params.id;

        const doc = await BookModel.findOne({_id: bookId})

        if (!doc) {
            return res.status(404).json({
                msg: 'Книга не найдена',
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
            msg: "Не удалось обновить книгу",
        })
    }
}


export const createGenre = async (req, res) => {
    try {
        //console.log(req.params.name);

        const doc = new GenreModel({
            name: req.params.name
        });

        await doc.save();

        res.json({
            success: true,
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось создать жанр",
        })
    }
};

export const getAllGenres = async (req, res) => {
    try {
        const genres = await GenreModel.find().exec();

        res.json(genres)

    } catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Не удалось получить жанры",
        })
    }
};