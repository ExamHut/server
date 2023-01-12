import {
    RecordActionResponse,
    ActionRequest,
    ResourceOptions,
} from 'adminjs';
import { unflatten } from 'flat';
import { CustomResource } from '../resource';
import { Components } from '../components';

export const after = async (
    response: RecordActionResponse,
    request: ActionRequest,
    context: any,
) => {
    if (request && request.method) {
        const manyProperties = context.resource.getManyProperties();
        const manyReferences = context.resource.getManyReferences();
        const { record, _admin } = context;
        if (context.action.name == 'edit' && request.method === 'get') {
        }

        if (request.method === 'post' && record.isValid()) {
            const params = unflatten(request.payload) as any;
            console.log('🚀 ~ file: many-to-many.hook.ts:34 ~ params', params);
            await Promise.all(
                manyProperties.map(async (toResourceId: string) => {
                    const ids = params[toResourceId] || [];
                    await context.resource.saveRecords(record, toResourceId, ids);
                }),
            );
        }
    }

    return response;
};

export const manyToManyComponent = (reference: string) => ({
    isVisible: {
        list: true,
        show: true,
        filter: true,
        edit: true,
    },
    isArray: true,
    reference: reference,
    components: {
        show: Components.ManyToManyShow,
        edit: Components.ManyToManyEdit,
        list: Components.ManyToManyList,
    },
});

export const injectManyToManySupport = (
    options: ResourceOptions,
    properties: { propertyName: string; modelClassName: string }[],
): ResourceOptions => {
    properties.forEach((propForSupport) => {
        options.properties[propForSupport.propertyName] = manyToManyComponent(
            propForSupport.modelClassName,
        );
        options.actions.new.after = [after];
        options.actions.edit.after = [after];
    });

    return options;
};
