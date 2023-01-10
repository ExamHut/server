import {
    RecordActionResponse,
    ActionRequest,
    ActionContext,
    ResourceOptions,
    ActionResponse,
    BaseRecord,
} from 'adminjs';
import { unflatten } from 'flat';
import { CustomResource } from '../resource';
import { Components } from '../components';

//Role
const setResponseItems = async (
    context: any,
    response: any,
    reference: CustomResource,
) => {
    const { _admin, resource, record } = context;
    const toResource = reference;
    const options = { order: [toResource.titleField()] };
    const throughItems = await resource.findRelated(record, reference, options);
    const items = toResource.wrapObjects(throughItems);
    if (items.length !== 0) {
        const primaryKeyField = toResource.primaryKeyField();
        console.log(
            '🚀 ~ file: many-to-many.hook.ts:20 ~ primaryKeyField',
            primaryKeyField,
        );
    }
};

export const after = async (
    response: RecordActionResponse,
    request: ActionRequest,
    context: any,
) => {
    if (request && request.method) {
        const manyProperties = context.resource.getManyProperties();
        const manyReferences = context.resource.getManyReferences();
        const { record, _admin } = context;
        // console.log( '🚀 ~ file: many-to-many.hook.ts:34 ~ _admin',
        //   _admin.resources,
        // );
        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key: any, value: any) => {
                if (typeof value === 'object' && value !== null) {
                    if (seen.has(value)) {
                        return;
                    }
                    seen.add(value);
                }
                return value;
            };
        };

        if (context.action.name == 'edit' && request.method === 'get') {
        }

        console.log(record.errors);

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
