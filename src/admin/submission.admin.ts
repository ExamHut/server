import { SubmissionSource } from "@vulcan/models";
import { ResourceWithOptions } from "adminjs";
import { Components } from './components';

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
    },
};
