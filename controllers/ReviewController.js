import ReviewsDAO from "../dao/reviewsDAO.js";
import UsersDAO from "../dao/usersDAO.js";

export default class ReviewsController {
  static async apiPostReview(req, res, next) {
    try {
      const movieId = parseInt(req.body.movieId);
      const text = req.body.text;
      const filmName = req.body.filmName;
      const userId = req.userId;
      const user = await UsersDAO.getUser(userId);
      const username = user.username;
      const reviewResponse = await ReviewsDAO.addReview(
        userId,
        username,
        movieId,
        filmName,
        text
      );
      res.json(reviewResponse);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: "-!!!- Не удалось написать отзыв -!!!-",
        error: err.message,
      });
    }
  }

  static async apiGetReview(req, res, next) {
    try {
      let id = req.params.id || {};
      let review = await ReviewsDAO.getReview(id);

      if (!review) {
        return res.status(404).json({
          message: "-!!!- Отзыв не найден -!!!-",
        });
      }

      res.json(review);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось получить отзыв -!!!-",
      });
    }
  }

  static async apiUpdateReview(req, res, next) {
    const reviewId = req.params.id || {};
    const text = req.body.text;
    try {
      const reviewResponse = await ReviewsDAO.updateReview(reviewId, text);
      if (reviewResponse.modifiedCount === 0) {
        throw new Error("-!!!- Не удалось обновить отзыв -!!!-");
      }
      res.json({ status: "Успешное редактирование отзыва" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось обновить отзыв -!!!-",
      });
    }
  }

  static async apiDeleteReview(req, res, next) {
    try {
      const reviewId = req.params.id;

      if (!reviewId) {
        return res.status(404).json({
          message: "-!!!- Отзыв не найден -!!!-",
        });
      }
      await ReviewsDAO.deleteReview(reviewId);
      res.json({ message: "Успешное удаление отзыва" });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось удалить отзыв -!!!-",
      });
    }
  }

  static async apiGetReviews(req, res, next) {
    try {
      let id = req.params.id || {};
      let reviews = await ReviewsDAO.getReviewsByMovieId(id);

      if (!reviews) {
        return res.status(404).json({
          message: "-!!!- Отзывы не найдены -!!!-",
        });
      }
      res.json(reviews);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось получить отзывы о фильме -!!!-",
      });
    }
  }

  static async apiGetAllReviews(req, res, next) {
    try {
      let reviews = await ReviewsDAO.getReviews();

      if (!reviews) {
        return res.status(404).json({
          message: "-!!!- Отзывы не найдены -!!!-",
        });
      }
      res.json(reviews);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Не удалось получить отзывы -!!!-",
      });
    }
  }
}
