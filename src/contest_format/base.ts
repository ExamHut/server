import { Contest, ContestParticipation, ContestProblem } from "@vulcan/models";

export abstract class BaseContestFormat {
    contest: Contest;
    config: ContestConfig;

    constructor(contest: Contest, config: ContestConfig) {
    }

    abstract get name(): string;

    validate(config: ContestConfig): void {
        if (!config) {
            return;
        }
    }

    abstract update_participation(participation: ContestParticipation): void;

    abstract display_user_problem(participation: ContestParticipation, contest_problem: ContestProblem, frozen: boolean): Object;

    abstract display_participation_result(participation: ContestParticipation, frozen: boolean): Object;

    abstract get_short_form_display(): Generator<string>;

    get_problem_breakdown(participation: ContestParticipation, contest_problems: ContestProblem[]) {
        return Array.from(contest_problems, function (contest_problem) {
            const format_data = participation.format_data;
            if (!format_data) return undefined;

            return format_data.get(contest_problem.id);
        });
    }

    get_label_for_problem(index: number) {
        return (index + 1).toString();
    }


    best_solution_state(points: number, total: number) {
        if (!points) {
            return "failed-score";
        }
        if (points == total) {
            return "full-score";
        }
        return "partial-score";
    }
}
