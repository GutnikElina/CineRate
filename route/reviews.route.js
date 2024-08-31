import express from "express";
import ReviewController from "../controllers/ReviewController.js";
import UserController from "../controllers/UserController.js";
import ListController from "../controllers/ListController.js";
import {
  loginValidation,
  registerValidation,
  reviewCreateValidation,
} from "../validations/validations.js";
import checkAuth from "../utils/checkAuth.js";
import { validationResult } from "express-validator";

const router = express.Router();

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

//Авторизация
router
  .route("/auth/login")
  .post(loginValidation, handleValidationErrors, UserController.login);
//Регистрация
router
  .route("/auth/registration")
  .post(registerValidation, handleValidationErrors, UserController.register);
//Проверка пользователя
router.route("/auth/getMe").get(checkAuth, UserController.getMe);

//Получение списка избранных пользователя
router.route("/list").post(checkAuth, ListController.apiGetList);
//Добавление фильмов в список избранных пользователя
router.route("/list/add_item").post(checkAuth, ListController.apiAddToList);
//Удаление фильма из списка избранных пользователя
router
  .route("/list/remove_item")
  .post(checkAuth, ListController.apiRemoveFromList);

//Получение всех отзывов
router.route("/reviews").get(ReviewController.apiGetAllReviews);
//Получение всех отзывов на фильм
router.route("/reviews/movie/:id").get(ReviewController.apiGetReviews);
//Создание нового отзыва
router
  .route("/review/new")
  .post(checkAuth, reviewCreateValidation, ReviewController.apiPostReview);
//Изменение отзыва
router
  .route("/reviews/:id")
  .post(
    checkAuth,
    reviewCreateValidation,
    handleValidationErrors,
    ReviewController.apiUpdateReview
  );
//Удаление отзыва
router.route("/review/:id").post(checkAuth, ReviewController.apiDeleteReview);
// .get(ReviewController.apiGetReview)

// Получение списка всех пользователей
router.route("/admin/users").get(UserController.getUsers);
// Редактирование пользователя
router.route("/admin/user/:id").post(checkAuth, UserController.editUsers);
// Удаление пользователя
router.route("/admin/users/:id").post(checkAuth, UserController.deleteUsers);

export default router;
