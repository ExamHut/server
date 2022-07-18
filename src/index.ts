import express from 'express';

import { sequelize } from './models';
import { HOST_CONFIG } from './configs/global.config';
import { router } from './routes';

const app = express();

// Parse requests of content-type - application/json
app.use(express.json());
// Parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// Mount router
app.use(router);

sequelize.sync({ force: true }).then(() => {
    console.log("Database synced.");
});

app.listen(HOST_CONFIG.PORT, HOST_CONFIG.HOST, () => {
    console.info(`The server is running on ${HOST_CONFIG.PORT}`);
});
