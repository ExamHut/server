import AdminJS from 'adminjs';
import AdminJSExpress from '@adminjs/express';
import AdminJSSequelize from '@adminjs/sequelize';

import { sequelize } from '@vulcan/models';

AdminJS.registerAdapter(AdminJSSequelize);

export const adminjs = new AdminJS({
    databases: [sequelize],
    rootPath: '/admin',
    branding: {
        companyName: 'ExamHut',
    },
});
