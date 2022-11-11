import { body } from 'express-validator';

export const loginValidation = [
   body('email', 'Неверный формат почты').isEmail(),
   body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
   body('email', 'Неверный формат почты').isEmail(),
   body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
   body('fullName', 'Укажите имя').isLength({ min: 1 }),
   body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const TodoCreateValidation = [
   body('todoListName', 'Введите название листа').isLength({ min: 1 }).isString(),
   body('text', 'Введите текст статьи').isLength({ min: 1 }).isString(),
   body('completed', 'Ошибка типов completed').optional().isBoolean()
];