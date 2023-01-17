import { Section } from '@adminjs/design-system';
import { ValueGroup, ButtonGroup } from '@adminjs/design-system';
import {
    ApiClient,
    EditPropertyPropsInArray,
    RecordJSON,
    SelectRecord,
    PropertyJSON,
    flat,
} from 'adminjs';
import React, { ReactNode } from 'react';
import ReferenceValue from './reference-value';

type Props = {
    property: PropertyJSON;
    record: RecordJSON;
    ItemComponent: typeof React.Component;
};

export default class ManyToManyList extends React.PureComponent<Props> {
    render(): ReactNode {
        const { property, record, ItemComponent } = this.props;
        const items = flat.get(record.params, property.path) || [];

        return (
            <>
                {(items || []).map((item: any, i: any) => {
                    return (
                        <ReferenceValue
                        key={i}
                        {...this.props}
                        record={item}
                        property={property}
                        />
                    );
                })}
            </>
        );
    }
}
