import express from 'express';

import { sequelize } from './models';
import { HOST_CONFIG } from './configs/global.config';

const app = express();

// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

sequelize.sync({ force: false }).then(() => {
    console.log("Database synced.");
});

app.listen(HOST_CONFIG.PORT, HOST_CONFIG.HOST, () => {
    console.info(`The server is running on ${HOST_CONFIG.PORT}`);
});
