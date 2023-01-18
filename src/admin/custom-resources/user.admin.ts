import { User, Class } from "@vulcan/models";
import { ResourceWithOptions } from "adminjs";
import { injectManyToManySupport } from "../hooks/many-to-many.hook";

export const ResourceUser: ResourceWithOptions = {
    resource: User,

    options: injectManyToManySupport(
        {
            properties: {},
            actions: {
                edit: {},
                new: {},
            },
            listProperties: ['id', 'username', 'email', 'classes'],
            showProperties: ['id', 'username', 'email', 'classes'],
            navigation: {
                name: 'Users',
            },
        },
        [
            { propertyName: 'classes', modelClassName: 'Class' },
        ]
    ),
};

export const ResourceClass: ResourceWithOptions = {
    resource: Class,

    options: {
        navigation: {
            name: 'Classes',
        },
    },
};
