const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const queryRoutes = require('./routes/queryRoutes');
const errorHandler = require('./middlewares/errorHandler');
const logger = require('./middlewares/logger');

app.use(cors());
app.use(express.json());
app.use(logger);

app.use('/api', queryRoutes);

app.use(errorHandler);

const PORT = process.env.PORT ;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
