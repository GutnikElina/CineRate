import ListDAO from "../dao/listDAO.js";

export default class ListController {
  static async apiGetList(req, res, next) {
    try {
      const authHeader = req.header("Authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          message:
            "-!!!- Ошибка аутентификации: отсутствует или неверный заголовок Authorization -!!!-",
        });
      }

      const username = req.body.username;
      let list = await ListDAO.getList(username);

      if (!list) {
        return res.status(404).json({
          message: "-!!!- Список не найден -!!!-",
        });
      }

      res.json(list);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось получить список -!!!-",
      });
    }
  }

  static async apiAddToList(req, res, next) {
    try {
      const { username, movieInfo } = req.body;
      await ListDAO.addMovieToList(username, movieInfo);
      res.status(201).json({ message: "Фильм успешно добавлен в список" });
    } catch (err) {
      console.error("-!!!- Ошибка при добавлении фильма -!!!-", err);
      res
        .status(500)
        .json({ message: "Произошла ошибка при добавлении фильма в список" });
    }
  }

  static async apiRemoveFromList(req, res, next) {
    try {
      const { movieId } = req.body;
      await ListDAO.deleteMovieFromList(movieId);
      res.status(200).json({ message: "Фильм успешно удален из списка" });
    } catch (err) {
      console.error("-!!!- Ошибка при удалении фильма из списка -!!!-", err);
      res
        .status(500)
        .json({ message: "Произошла ошибка при удалении фильма из списка" });
    }
  }
}
