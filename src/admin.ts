import AdminJS from 'adminjs';
import { Database, Resource } from '@adminjs/typeorm';

import { AppDataSource } from '@vulcan/models';

AdminJS.registerAdapter({ Database, Resource });

export const adminjs = new AdminJS({
    databases: [AppDataSource],
    rootPath: '/admin',
    branding: {
        companyName: 'ExamHut',
    },
});
