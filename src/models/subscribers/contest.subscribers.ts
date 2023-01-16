import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    LessThan,
    UpdateEvent,
} from "typeorm";

import { Contest, ContestParticipation } from "../contest.models";

@EventSubscriber()
export class ContestSubscriber implements EntitySubscriberInterface<Contest> {
    listenTo(): string | Function {
        return Contest;
    }

    async beforeInsert(event: InsertEvent<Contest>) {
        const entity = event.entity;

        if (entity.endDate.getTime() < entity.startDate.getTime()) {
            throw new Error('End date cannot be before start date.');
        }

        if (entity.duration <= 0) {
            entity.duration = Math.floor((entity.endDate.getTime() - entity.startDate.getTime())) / 60 / 1000;
        }
    }

    async beforeUpdate(event: UpdateEvent<Contest>) {
        const entity = event.entity;

        if (entity.endDate.getTime() < entity.startDate.getTime()) {
            throw new Error('End date cannot be before start date.');
        }

        if (entity.duration <= 0) {
            entity.duration = Math.floor((entity.endDate.getTime() - entity.startDate.getTime())) / 60 / 1000;
        }
    }
}

@EventSubscriber()
export class ContestParticipationSubscriber implements EntitySubscriberInterface<ContestParticipation> {
    listenTo(): string | Function {
        return ContestParticipation;
    }

    async beforeInsert(event: InsertEvent<ContestParticipation>) {
        const entity = event.entity;
        const contest = await Contest.findOne({ where: { id: entity.contestId } });

        entity.part_count = (await ContestParticipation.find({ where: { user: { id: entity.userId }, contest: { id: entity.contestId } } })).length + 1;

        // Set the start date to the current date.
        entity.participationDate = new Date();

        if (contest.over) {
            entity.endDate = new Date(entity.participationDate.getTime() + contest.duration * 60 * 1000);
        } else {
            entity.endDate = contest.endDate;
        }
    }
}
