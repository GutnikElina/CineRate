import app from "./server.js";
import mongodb from "mongodb";
import ReviewsDAO from "./dao/reviewsDAO.js";
import UsersDAO from "./dao/usersDAO.js";
import ListDAO from "./dao/listDAO.js";

const MongoClient = mongodb.MongoClient;
const mongo_password = "wwwwww";
const uri = `mongodb+srv://admin:${mongo_password}@cluster0.2pfobah.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0`;

const port = 4444;

MongoClient.connect(uri, {
  maxPoolSize: 50,
  wtimeoutMS: 2500,
})
  .catch((err) => {
    console.error(err.stack);
    process.exit(1);
  })
  .then(async (client) => {
    await ReviewsDAO.injectDB(client);
    await UsersDAO.injectDB(client);
    await ListDAO.injectDB(client);
    app.listen(port, () => {
      console.log(` -> Прослушка порта: ${port}`);
    });
  });
