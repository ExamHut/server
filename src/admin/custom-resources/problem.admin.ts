import { Problem } from "@vulcan/models";
import { ResourceWithOptions } from "adminjs";

export const ResourceProblem: ResourceWithOptions = {
    resource: Problem,
    options: {
        navigation: {
            name: 'Problems',
        },
    },
};
