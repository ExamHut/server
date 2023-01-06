import { User, Class, Problem, ContestProblem, Submission, Judge, Language, ContestParticipation, RuntimeVersion, Contest } from '@vulcan/models';
import { AdminJSOptions } from 'adminjs';
import { componentLoader } from './components';
import { ResourceSubmissionSource } from './submission.admin';

export const adminjsoptions: AdminJSOptions = {
    resources: [
        User, Class,
        Problem,
        Contest, ContestProblem, ContestParticipation,
        Submission, ResourceSubmissionSource,
        Judge, Language, RuntimeVersion,
    ],
    rootPath: '/admin',
    componentLoader: componentLoader,
};
