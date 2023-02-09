import { AppDataSource, Contest, ContestParticipation, ContestProblem, Submission } from "@vulcan/models";
import { BaseContestFormat } from "./base";

export class ThemisContestFormat extends BaseContestFormat {
    static config_default: ContestConfig = {
        'cumtime': false,
    };

    constructor(contest: Contest, config: ContestConfig) {
        super(contest, config);
        if (!config) config = {};

        this.config = { ...ThemisContestFormat.config_default, ...config };
        this.contest = contest;
    }

    get name() {
        return "Themis";
    }

    async update_participation(participation: ContestParticipation) {
        const query = AppDataSource
            .getRepository(Submission)
            .createQueryBuilder()
            .select(['contest_problem_id', 'points'])
            .addSelect('MAX(date)', 'date')
            .where('contest_participation_id = :id', { id: participation.id })
            .andWhere('status = \'D\'')
            .groupBy('contest_problem_id');

        const submissions = await query.getRawMany();

        let total_time = 0;
        let total_points = 0;
        let format_data: FormatData = {};

        for (const { contest_problem_id, points, date } of submissions) {
            let time = 0;
            if (this.config.cumtime) {
                time = (date.getTime() - participation.participationDate.getTime()) / 1000;
            }

            format_data[contest_problem_id] = {
                points: points,
                time: time,
            };
        }

        for (const [_, problem_data] of Object.entries(format_data)) {
            const { points, time } = problem_data;

            total_points += points;
            if (this.config.cumtime && points) {
                total_time += time;
            }
        }

        participation.total_time = Math.max(total_time, 0);
        participation.points = total_points; // TODO: round
        participation.tiebreaker = 0;
        participation.format_data = format_data;
        participation.save();
    }

    display_user_problem(participation: ContestParticipation, contest_problem: ContestProblem, frozen: boolean) {
        if (!participation.format_data) return {};

        const problem_data = participation.format_data[contest_problem.id];
        if (!problem_data) return {};

        const is_pretested = contest_problem.isPretested && this.contest.isPretested;

        const state = (is_pretested ? 'pretest-' : '')
            + this.best_solution_state(problem_data.points, contest_problem.points);
        const time = problem_data.time.toString();

        return {
            state: state,
            url: "", // TODO: fill this with the contest_user_submissions view
            points: problem_data.points,
            time: time,
        };
    }

    display_participation_result(participation: ContestParticipation, frozen: boolean): Object {
        const total_time = this.config.cumtime
            ? participation.total_time.toString()
            : '';

        return {
            url: "", // TODO: fill this with the contest_all_user_submissions view
            points: participation.points,
            total_time: total_time,
        };
    }

    *get_short_form_display(): Generator<string> {
        yield 'The score on your **last** submission for each problem will be used.';

        if (this.config.cumtime) {
            yield 'Ties will be broken by the sum of the last submission time on **all** problems.';
        } else {
            yield 'Ties by score will **not** be broken.';
        }
    }
}
