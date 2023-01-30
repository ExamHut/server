import { AppDataSource, Contest, ContestParticipation, ContestProblem, Submission } from "@vulcan/models";
import { BaseContestFormat } from "./base";

export class LegacyIOIContestFormat extends BaseContestFormat {
    static config_default: ContestConfig = {
        'cumtime': false,
        'last_score_altering': false,
    };

    constructor(contest: Contest, config: ContestConfig) {
        super(contest, config);
        if (!config) config = {};

        this.config = { ...LegacyIOIContestFormat.config_default, ...config };
        this.contest = contest;
    }

    get name() {
        return "IOI (pre-2016)";
    }

    validate(config: ContestConfig) {
        super.validate(config);

        const config_default = LegacyIOIContestFormat.config_default;

        for (const [key, value] of Object.entries(config)) {
            if (!config_default.hasOwnProperty(key)) {
                throw new Error(`Unknown config key ${key}`);
            }
        }
    }

    async update_participation(participation: ContestParticipation) {
        const query = AppDataSource
            .getRepository(Submission)
            .createQueryBuilder()
            .select(['contest_problem_id', 'points'])
            .addSelect('MIN(date)', 'date')
            .where('contest_participation_id = :id', { id: participation.id })
            .andWhere(qb => {
                const subquery = qb.subQuery()
                    .select('points')
                    .from(Submission, 'submission')
                    .where('contest_participation_id = :id', { id: participation.id })
                    .orderBy('points', 'DESC')
                    .limit(1);
                return `points = ${subquery.getQuery()}`;
            });

        const submissions = await query.getRawMany();

        let last_submission_time = 0;
        let total_time = 0;
        let total_points = 0;
        let format_data: FormatData = {};

        for (const { contest_problem_id, points, date } of submissions) {
            let time = 0;

            if (points) {
                time = (date.getTime() - participation.participationDate.getTime()) / 1000;

                if (this.config.last_score_altering) {
                    last_submission_time = Math.max(last_submission_time, time);
                }
                if (this.config.cumtime) {
                    total_time += time;
                }
            }

            total_points += points;

            format_data[contest_problem_id] = {
                points: points,
                time: time,
            };
        }

        participation.total_time = this.config.cumtime
            ? Math.max(total_time, 0)
            : last_submission_time,

        participation.points = total_points; // TODO: round
        participation.tiebreaker = last_submission_time;
        participation.format_data = format_data;
        participation.save();
    }

    display_user_problem(participation: ContestParticipation, contest_problem: ContestProblem, frozen: boolean) {
        if (!participation.format_data) return {};

        const problem_data = participation.format_data[contest_problem.id];
        if (!problem_data) return {};

        const is_pretested = contest_problem.isPretested && this.contest.isPretested;
        const show_time = this.config.cumtime || this.config.last_score_altering || false;

        const state = (is_pretested ? 'pretest-' : '')
            + this.best_solution_state(problem_data.points, contest_problem.points);
        const time = show_time
            ? problem_data.time.toString()
            : '';

        return {
            state: state,
            url: "", // TODO: fill this with the contest_user_submissions view
            points: problem_data.points,
            time: time,
        };
    }

    display_participation_result(participation: ContestParticipation, frozen: boolean) {
        const show_time = this.config.cumtime || this.config.last_score_altering || false;
        const total_time = show_time
            ? participation.total_time.toString()
            : '';

        return {
            url: "", // TODO: fill this with the contest_all_user_submissions view
            points: participation.points,
            total_time: total_time,
        };
    }

    *get_short_form_display(): Generator<string> {
        yield 'The maximum score submission for each problem will be used.';

        if (this.config.last_score_altering) {
            if (this.config.cumtime) {
                yield `Ties will be broken by the sum of the last score altering submission time
                       on problems with non-zero score, followed by the time
                       of the last score altering submission.`;
            }
        } else if (this.config.cumtime) {
            yield `Ties will be broken by the sum of the last score altering submission time
                   on problems with a non-zero score.`;
        } else {
            yield 'Ties by score will **not** be broken.';
        }
    }
}
