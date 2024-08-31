import mongodb from "mongodb";

let lists;

export default class ListDAO {
  static async injectDB(conn) {
    if (lists) {
      return;
    }
    try {
      lists = await (conn ? conn.db("blog").collection("lists") : undefined);
    } catch (err) {
      console.error(
        `-!!!- Проблемы с покдлючением коллекции lists: ${err} -!!!-`
      );
    }
  }

  static async getList(username) {
    try {
      return await lists.find({ username: username }).toArray();
    } catch (err) {
      console.error(`-!!!- Ошибка при получении фильма: ${err} -!!!-`);
      return { error: err };
    }
  }

  static async addMovieToList(username, movieInfo) {
    try {
      const listDoc = {
        username,
        movieInfo,
      };
      console.log(" -> Добавление в избранное фильма");
      if (!lists) {
        throw new Error("Сначала установите подключение к базе данных");
      }
      return await lists.insertOne(listDoc);
    } catch (err) {
      console.error(`-!!!- Ошибка при добавлении фильма. ${err} -!!!-`);
      return { error: err };
    }
  }

  static async deleteMovieFromList(movieId) {
    try {
      const filter = { _id: new mongodb.ObjectId(movieId) };
      await lists.deleteOne(filter);
    } catch (err) {
      console.error(`-!!!- Ошибка при удалении фильма: ${err} -!!!-`);
      return { error: err };
    }
  }
}
