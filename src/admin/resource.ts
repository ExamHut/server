import { Database, Resource as TypeOrmResource } from '@adminjs/typeorm';
import { BaseRecord, RecordJSON } from 'adminjs';

export class CustomResource extends TypeOrmResource {
    titleField() {
        return this.decorate().titleProperty().name();
    }

    wrapObjects(objects: any[]) {
        return objects.map(
            (typeormObject) => new BaseRecord(typeormObject.toJSON(), this),
        );
    }

    async findRelated(record: BaseRecord, resource: CustomResource, options = {}) {
    }

    async saveRecords(record: RecordJSON, resourceId: string, ids: { id: string | number }[]) {
        await this.update(record.params.id, {
            [resourceId]: ids.map((value) => ({ id: value.id })),
        });
    }

    primaryKeyField() {
        return this.id;
    }

    getManyReferences() {
        return this.decorate()
        .getProperties({ where: 'edit' })
        .filter((p: any) => {
            return p.type() === 'reference';
        })
        .map((p) => p.reference());
    }

    // async findRelated(record, resource: CustomResource, options = {}) {
    // }

    getManyProperties() {
        return this.decorate()
        .getProperties({ where: 'edit' })
        .filter((p: any) => {
            return p.type() === 'reference';
        })
        .map((p) => p.name());
    }
}
