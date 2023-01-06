import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
    CodeEditor: componentLoader.add('CodeEditor', './code-editor/edit'),
};

export { componentLoader, Components };
