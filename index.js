import express from 'express';
import multer from 'multer';

import mongoose from 'mongoose';

import {registerValidation, loginValidation, bookCreateValidation} from './validations.js';

import {checkAdminRole, CheckPersonalRole, checkAuth, handleValidationErrors, CheckUserRole} from './utils/index.js';
import { UserController, BookController, OrderController } from './controllers/index.js';
import cors from "cors";




mongoose
    .connect('mongodb://127.0.0.1/CourseWork')
    .then(() => {   console.log('DB ok')})
    .catch((err) => {console.log('DB error', err)});

const app = express();

const storage = multer.diskStorage({
    destination: (_, file, cb) => {
        cb(null, 'media');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

// позволит читать json файлы, приходящие из запроса
app.use(express.json());
app.use(cors())

app.use('/media', express.static('media'));

// методы регистрации и авторизации
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);

// методы читателя
app.get('/auth/me', checkAuth, UserController.getMe);
app.post('/user/notRecieve', checkAuth, UserController.notRecieveBook);
app.post('/user/requestToReturn', checkAuth, UserController.reqToReturn);

app.get('/books', BookController.getAll);
app.get('/books/SearchBooks', BookController.searchBooks);
app.get('/books/ByGenre', BookController.getBooksByGenre);
app.get('/books/:id', BookController.getBookById);
app.get('/genres', BookController.getAllGenres);

app.post('/orders', checkAuth, CheckUserRole, OrderController.create)

//методы администратора
app.post('/media', checkAuth, checkAdminRole, upload.single('image'), (req, res) => {
    res.json({
        url: `/media/${req.file.originalname}`
    })
});
app.post('/genres/createGenre', checkAuth, checkAdminRole, BookController.createGenre);
app.post('/books', checkAuth, checkAdminRole, bookCreateValidation, handleValidationErrors, BookController.create);
app.delete('/books/:id', checkAuth, checkAdminRole, BookController.remove);
app.patch('/books/:id', checkAuth, checkAdminRole, bookCreateValidation, handleValidationErrors, BookController.update);

// методы библиотекаря
app.get('/orders/activeOrders', checkAuth, CheckPersonalRole, OrderController.getActiveOrders)



app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});