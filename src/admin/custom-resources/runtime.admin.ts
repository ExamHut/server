import { Judge, Language, RuntimeVersion } from "@vulcan/models";
import { ResourceWithOptions } from "adminjs";

export const ResourceJudge: ResourceWithOptions = {
    resource: Judge,
    options: {
        navigation: {
            name: 'Runtime',
        },
    },
};

export const ResourceLanguage: ResourceWithOptions = {
    resource: Language,
    options: {
        navigation: {
            name: 'Runtime',
        },
    },
};

export const ResourceRuntimeVersion: ResourceWithOptions = {
    resource: RuntimeVersion,
    options: {
        navigation: {
            name: 'Runtime',
        },
    },
};
