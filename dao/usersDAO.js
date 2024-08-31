import mongodb from "mongodb";

let users;

export default class UsersDAO {
  static async injectDB(conn) {
    if (users) {
      return;
    }
    try {
      users = await conn.db("blog").collection("users");
    } catch (err) {
      console.error(
        `-!!!- Проблемы с покдлючением коллекции users: ${err} -!!!-`
      );
    }
  }

  static async registerUser(username, userRole, email, fullName, passwordhash) {
    try {
      const existingUser = await users.findOne({ email: email });
      if (existingUser) {
        return "error";
      }

      const userDocument = {
        username,
        userRole,
        email,
        fullName,
        passwordHash: passwordhash,
      };
      console.log(" -> Добавление пользователя...");
      return await users.insertOne(userDocument);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Ошибка регистрации -!!!-",
      });
    }
  }

  static async loginUser(email) {
    try {
      return await users.findOne({ email: email });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Ошибка авторизации -!!!-",
      });
    }
  }

  static async getUser(userId) {
    try {
      return await users.findOne({ _id: new mongodb.ObjectId(userId) });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Ошибка поиска пользователя -!!!-",
      });
    }
  }

  static async getAllUsers() {
    try {
      return await users.find().toArray();
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Ошибка при получении пользователей -!!!-",
      });
    }
  }

  static async updateUser(userId, userData) {
    try {
      const filter = { _id: new mongodb.ObjectId(userId) };
      const updateDoc = { $set: userData };
      return await users.findOneAndUpdate(filter, updateDoc, {
        returnDocument: "after",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Ошибка при обновлении данных о пользователе -!!!-",
      });
    }
  }

  static async deleteUser(userId) {
    try {
      const filter = { _id: new mongodb.ObjectId(userId) };
      await users.deleteOne(filter);
    } catch (err) {
      console.log(err);
      res.status(500).json({
        message: "-!!!- Ошибка при удалении пользователя -!!!-",
      });
    }
  }
}
