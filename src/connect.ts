import mongoose from "mongoose";


export default (db: string) => {
  const connect = () => {
    mongoose.connect(db).then(() => {
      return console.log('Succesfully connected to: ', db);
    })
      .catch(err => {
        return console.log("Error connecting to database: ", err);
      });
  };

  connect();
  mongoose.connection.on("disconnected", connect);
};

