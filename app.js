require('dotenv').config()
const express = require('express');
const app = express();
const models = require('./models');
const routes = require('./routes');
const cors = require('cors');
app.use(cors());

app.use(express.json());
app.use("/uploads", express.static('uploads'))
app.use('/api', routes);

models.sequelize
    .sync({ force: false })
    .then(() => {
        console.log('Database & tables created!');
    })
    .catch(err => console.error('Error in syncing database:', err));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});