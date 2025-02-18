const mongoose = require('mongoose');

mongoose
  .connect('mongodb+srv://abhikhya:ashi3666@cluster0.dyvke.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.log('Error connecting to MongoDb', err);
  });

