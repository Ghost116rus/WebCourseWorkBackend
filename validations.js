import { body } from 'express-validator';

export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5})
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({min: 5}),
    body('fullName', 'Укажите имя').isLength({min: 3}),

    body('avatarUrl', 'Неверная ссылка на автарку').optional().isURL(),
];

export const bookCreateValidation = [
    body("title", 'Введите заголовок книги').isLength({ min: 3 }).isString(),
    body('description', 'Введите аннотацию книги').isLength({min: 5}).isString(),
    body('authors', 'Неверный формат авторов (укажите массив)').optional().isArray(),
    body('genres', 'Неверный формат жанров (укажите массив)').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];