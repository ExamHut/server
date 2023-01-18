import { Contest, ContestParticipation, ContestProblem } from '@vulcan/models';
import { ResourceWithOptions } from 'adminjs';

export const ResourceContestProblem: ResourceWithOptions = {
    resource: ContestProblem,
    options: {
        navigation: {
            name: 'Contests',
        },
    },
};

export const ResourceContest: ResourceWithOptions = {
    resource: Contest,
    options: {
        navigation: {
            name: 'Contests',
        },
    },
};

export const ResourceContestParticipation: ResourceWithOptions = {
    resource: ContestParticipation,
    options: {
        navigation: {
            name: 'Contests',
        },
    },
};
