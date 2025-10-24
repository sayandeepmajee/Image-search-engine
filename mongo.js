const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/login")
  .then(() => console.log('Mongoose connected'))
  .catch((err) => console.log(' Connection failed:', err));

const logInSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
});
const LogInCollection = mongoose.model('loginCollection', logInSchema);
module.exports = LogInCollection;

