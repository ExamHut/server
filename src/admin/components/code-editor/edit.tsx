import { allowOverride, Edit, EditPropertyProps } from 'adminjs';
import CodeMirror from '@uiw/react-codemirror';
import React from 'react';
import { langs, loadLanguage } from '@uiw/codemirror-extensions-langs';
import { FormGroup, FormMessage, Label, RichTextEditor, TextArea, Input } from '@adminjs/design-system';
import { PropertyLabel } from 'adminjs/src/frontend/components/property-type/utils/property-label';

const CodeEditor: React.FC<EditPropertyProps> = (props) => {
    const { onChange, property, record, where } = props;
    const propValue = record.params?.[property.path] ?? '';
    const [value, setValue] = React.useState(propValue);
    const error = record.errors?.[property.path];

    console.log(PropertyLabel);

    React.useEffect(() => {
        if (value !== propValue) {
            setValue(propValue);
        }
    }, [propValue]);

    console.log(props);

    return (
        <FormGroup error={Boolean(error)}>
            <PropertyLabel property={property} />
                <CodeMirror
                    id={property.path}
                    readOnly={property.isDisabled || where !== 'edit'}
                    onChange={(value: any) => setValue(value)}
                    onBlur={() => onChange(property.path, value)}
                    value={value}
                    extensions={[loadLanguage('cpp')]}
                    style={{
                        fontSize: 12,
                        backgroundColor: '#f5f5f5',
                        fontFamily:
                            'ui-monospace, SFMono-Regular, SF Mono, Consolas, Liberation Mono, Menlo, monospace',
                    }}
                    {...property.props}
                />
            <FormMessage>{error && error.message}</FormMessage>
        </FormGroup>
    );
};

export default CodeEditor;
