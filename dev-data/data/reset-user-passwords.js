const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const User = require('./../../models/userModel');

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose.set('strictQuery', false);
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('DB connection successful!'));

const resetPasswords = async () => {
  try {
    const users = await User.find();
    const newPassword = 'test1234'; // You can change this to any default password you want

    const resetPromises = users.map(async user => {
      // Hash the password with cost of 12
      const hashedPassword = await bcrypt.hash(newPassword, 12);

      // Update the user's password directly in the database
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        passwordConfirm: undefined // Remove passwordConfirm field
      });
      console.log(`Password reset for user: ${user.email}`);
    });

    await Promise.all(resetPromises);

    console.log('All user passwords have been reset successfully!');
  } catch (err) {
    console.error('Error resetting passwords:', err);
  } finally {
    mongoose.connection.close();
  }
};

resetPasswords();
