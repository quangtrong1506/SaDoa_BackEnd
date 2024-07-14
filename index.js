import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import './loadEnvironment.js';
import router from './routes/index.js';

// init winston logger

// connect mongoose
mongoose
    .connect(process.env.ATLAS_URI, {
        autoIndex: true,
        dbName: process.env.DATABASE,
    })
    .then(() => console.log('Connected!'));

// setup express
const PORT = process.env.PORT || 5050;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Load routes
router(app);

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).json({
        error: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT} and Worker ${process.pid} started`);
});
