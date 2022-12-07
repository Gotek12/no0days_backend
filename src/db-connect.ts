import mongoose from "mongoose";

const dbURI = "mongodb://localhost:27017/no0days";

export default (db = dbURI) => {
  const connect = () => {
    mongoose.connect(db).then(() => {
      return console.log('Succesfully connected to: ', db);
    })
      .catch((err: any) => {
        return console.log("Error connecting to database: ", err);
      });
  };

  connect();
  mongoose.connection.on("disconnected", connect);
};