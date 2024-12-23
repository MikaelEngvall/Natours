const mongoose = require('mongoose');
const dotenv = require('dotenv');

mongoose.set('strictQuery', false);
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(con => console.log('DB connection successful!'));

const app = require('./app');

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  console.log(`App listening on port ${port}...`)
);

process.on('unhandledRejection', err => {
  console.error('UNHANDLED REJECTION 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
