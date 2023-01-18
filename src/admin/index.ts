import { AdminJSOptions } from 'adminjs';
import { componentLoader } from './components';
import { ResourceUser, ResourceClass } from './custom-resources/user.admin';
import { ResourceSubmission, ResourceSubmissionSource } from './custom-resources/submission.admin';
import { ResourceProblem } from './custom-resources/problem.admin';
import { ResourceContest, ResourceContestProblem, ResourceContestParticipation } from './custom-resources/contest.admin';
import { ResourceJudge, ResourceLanguage, ResourceRuntimeVersion } from './custom-resources/runtime.admin';

export const adminjsoptions: AdminJSOptions = {
    resources: [
        ResourceUser, ResourceClass,
        ResourceProblem,
        ResourceContest, ResourceContestProblem, ResourceContestParticipation,
        ResourceSubmission, ResourceSubmissionSource,
        ResourceJudge, ResourceLanguage, ResourceRuntimeVersion,
    ],
    rootPath: '/admin',
    componentLoader: componentLoader,
};
