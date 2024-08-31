import mongodb from "mongodb";

let reviews;

export default class ReviewsDAO {
  static async injectDB(conn) {
    if (reviews) {
      return;
    }
    try {
      reviews = await conn.db("blog").collection("reviews");
    } catch (err) {
      console.error(
        `-!!!- Проблемы с покдлючением коллекции reviews: ${err} -!!!-`
      );
    }
  }

  static async addReview(user, username, movieId, filmName, text) {
    try {
      const reviewDocument = {
        user: new mongodb.ObjectId(user),
        username,
        movieId,
        filmName,
        text,
      };
      console.log(" -> Добавление отзыва на movieId: ", movieId);
      return await reviews.insertOne(reviewDocument);
    } catch (err) {
      console.error(`-!!!- Ошибка при добавлении отзыва: ${err} -!!!-`);
      return { error: err };
    }
  }

  static async getReview(reviewId) {
    try {
      return await reviews.findOne({ _id: new mongodb.ObjectId(reviewId) });
    } catch (err) {
      console.error(`-!!!- Ошибка при получении отзыва: ${err} -!!!-`);
      return { error: err };
    }
  }

  static async updateReview(reviewId, text) {
    try {
      const filter = { _id: new mongodb.ObjectId(reviewId) };
      const updateDoc = { $set: { text: text } };
      return await reviews.findOneAndUpdate(filter, updateDoc, {
        returnDocument: "after",
      });
    } catch (err) {
      console.error(`-!!!- Ошибка при обновлении отзыва: ${err} -!!!-`);
      return { error: err };
    }
  }

  static async deleteReview(reviewId) {
    try {
      const filter = { _id: new mongodb.ObjectId(reviewId) };
      await reviews.deleteOne(filter);
    } catch (err) {
      console.error(`-!!!- Ошибка при удалении отзыва: ${err} -!!!-`);
      return { error: err };
    }
  }

  static async getReviewsByMovieId(movieId) {
    try {
      const cursor = await reviews.find({ movieId: parseInt(movieId) });
      return cursor.toArray();
    } catch (err) {
      console.error(
        `-!!!- Ошибка при получении отзывов на фильм: ${err} -!!!-`
      );
      return { error: err };
    }
  }

  static async getReviews() {
    try {
      return await reviews.find().toArray();
    } catch (err) {
      console.error(
        `-!!!- Ошибка при получении отзывов на фильм: ${err} -!!!-`
      );
      return { error: err };
    }
  }
}
