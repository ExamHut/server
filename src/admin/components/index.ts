import { ComponentLoader } from 'adminjs';

const componentLoader = new ComponentLoader();

const Components = {
    CodeEditor: componentLoader.add('CodeEditor', './code-editor/edit'),
    ManyToManyEdit: componentLoader.add('ManyToManyEdit', './many-to-many/edit'),
    ManyToManyShow: componentLoader.add('ManyToManyShow', './many-to-many/show'),
    ManyToManyList: componentLoader.add('ManyToManyList', './many-to-many/list'),
};

export { componentLoader, Components };
