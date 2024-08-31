import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UsersDAO from "../dao/usersDAO.js";

export default class UsersController {
  static async register(req, res, next) {
    try {
      let email = req.body.email || {};
      let fullName = req.body.fullName || {};
      let username = req.body.username || {};
      let password = req.body.password || {};
      const salt = await bcrypt.genSalt(10);
      const passwordhash = await bcrypt.hash(password, salt);
      let userRole = "USER";

      const usersResponse = await UsersDAO.registerUser(
        username,
        userRole,
        email,
        fullName,
        passwordhash
      );

      if (usersResponse == "error") {
        res.status(500).json({
          message: "-!!!- Пользователь с таким email уже существует -!!!-",
        });
      } else {
        const token = jwt.sign(
          {
            _id: usersResponse.insertedId,
            username: username,
          },
          "secret123",
          {
            expiresIn: "30d",
          }
        );

        const { passwordHash, ...userData } = usersResponse;

        res.json({
          ...userData,
          token,
        });
      }
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось зарегистрироваться -!!!-",
      });
    }
  }

  static async login(req, res, next) {
    try {
      let email = req.body.email || {};
      let user = await UsersDAO.loginUser(email);

      if (!user) {
        return res.status(404).json({
          message: "-!!!- Пользователь не найден -!!!-",
        });
      }

      const isValidPass = await bcrypt.compare(
        req.body.password,
        user.passwordHash
      );

      if (!isValidPass) {
        return res.status(400).json({
          message: "-!!!- Неверный логин или пароль -!!!-",
        });
      }

      const token = jwt.sign(
        {
          _id: user._id,
        },
        "secret123",
        {
          expiresIn: "30d",
        }
      );

      const { passwordHash, ...userData } = user;

      res.json({
        ...userData,
        token,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось авторизоваться -!!!-",
      });
    }
  }

  static async getMe(req, res, next) {
    try {
      const userId = req.userId || {};
      let user = await UsersDAO.getUser(userId);

      if (!user) {
        return res.status(404).json({
          message: "-!!!- Пользователь не найден -!!!-",
        });
      }

      const { passwordHash, ...userData } = user;

      res.json(userData);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Нет доступа -!!!-",
      });
    }
  }

  static async getUsers(req, res, next) {
    try {
      const users = await UsersDAO.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("-!!!- Ошибка при получении списка пользователей:", error);
      res.status(500).json({ message: "-!!!- Ошибка сервера" });
    }
  }

  static async editUsers(req, res, next) {
    const userId = req.params.id || {};
    const userData = req.body;
    try {
      const updatedUser = await UsersDAO.updateUser(userId, userData);
      res.json(updatedUser);
    } catch (error) {
      console.error("-!!!- Ошибка при редактировании пользователя -!!!-");
      res.status(500).json({ message: "-!!!- Ошибка сервера" });
    }
  }

  static async deleteUsers(req, res, next) {
    const userId = req.params.id || {};
    try {
      await UsersDAO.deleteUser(userId);
      res.json({ message: "Пользователь удален успешно" });
    } catch (error) {
      console.error("-!!!- Ошибка при удалении пользователя:", error);
      res.status(500).json({ message: "Ошибка сервера" });
    }
  }
}
