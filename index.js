import express from 'express';
import multer from 'multer';

import mongoose from 'mongoose';

import {registerValidation, loginValidation, bookCreateValidation} from './validations.js';

import {checkAdminRole, checkAuth, handleValidationErrors} from './utils/index.js';
import { UserController, BookController } from './controllers/index.js';



mongoose
    .connect('mongodb://127.0.0.1/CourseWork')
    .then(() => {   console.log('DB ok')})
    .catch((err) => {console.log('DB error', err)});

const app = express();
app.use(express.json());


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

app.use('/media', express.static('media'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/media', checkAuth, checkAdminRole, upload.single('image'), (req, res) => {
    res.json({
        url: `/media/${req.file.originalname}`
    })
});


app.get('/books', BookController.getAll);
app.get('/books/:id', BookController.getOne);

app.post('/books', checkAuth, checkAdminRole, bookCreateValidation, handleValidationErrors, BookController.create);
app.delete('/books/:id', checkAuth, BookController.remove);
app.patch(
    '/books/:id',
     checkAuth,
     bookCreateValidation,
     handleValidationErrors,
     BookController.update
);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});