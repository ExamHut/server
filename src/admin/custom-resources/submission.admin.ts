import { Submission, SubmissionTestcase, SubmissionSource } from "@vulcan/models";
import { ResourceWithOptions } from "adminjs";
import { Components } from '../components';

export const ResourceSubmission: ResourceWithOptions = {
    resource: Submission,
    options: {
        navigation: {
            name: 'Submissions',
        },
    },
};

export const ResourceSubmissionSource: ResourceWithOptions = {
    resource: SubmissionSource,
    options: {
        properties: {
            source: {
                type: 'textarea',
                components: {
                    show: Components.CodeEditor,
                    edit: Components.CodeEditor,
                },
            },
        },
        listProperties: ['id'],

        navigation: {
            name: 'Submissions',
        },
    },
};
