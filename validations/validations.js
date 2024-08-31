import { body } from "express-validator";

export const loginValidation = [
  body("email", "-!!!- Неверный формат почты -!!!-").isEmail(),
  body(
    "password",
    "-!!!- Пароль должен быть не короче 5 символов -!!!-"
  ).isLength({ min: 5 }),
];

export const registerValidation = [
  body("email", "-!!!- Неверный формат почты -!!!-").isEmail(),
  body("fullName", "-!!!- Укажите свое имя -!!!-").isLength({ min: 3 }),
  body(
    "username",
    "-!!!- Логин должен быть не короче 5 символов -!!!-"
  ).isLength({ min: 5 }),
  body(
    "password",
    "-!!!- Пароль должен быть не короче 5 символов -!!!-"
  ).isLength({ min: 5 }),
];

export const reviewCreateValidation = [
  body("text", "-!!!- Введите текст отзыва -!!!-").isLength({ min: 3 }),
];
