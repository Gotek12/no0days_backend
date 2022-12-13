import mongoose from 'mongoose';

const dbURI = 'mongodb://localhost:27017/no0days';

/* eslint-disable no-console */
export default (db = dbURI) => {
  const connect = () => {
    mongoose
      .connect(db)
      .then(() => {
        return console.log('Succesfully connected to: ', db);
      })
      .catch((err: any) => {
        return console.error('Error connecting to database: ', err);
      });
  };

  connect();
  mongoose.connection.on('disconnected', connect);
};
