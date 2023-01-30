import { AppDataSource, ContestParticipation, ContestProblem, Submission, SubmissionTestcase } from "@vulcan/models";
import { LegacyIOIContestFormat } from "./legacy_ioi";

export class IOIContestFormat extends LegacyIOIContestFormat {
    static config_default: ContestConfig = {
        'cumtime': false,
    };

    get name() {
        return 'IOI';
    }

    async update_participation(participation: ContestParticipation) {
        const query = await AppDataSource.query(`
            SELECT
                q.prob,
                MIN(q.date) as date,
                q.batch_points
            FROM
            (
                SELECT 
                    cp.id          as prob,
                    sub.id         as subid,
                    sub.date       as date,
                    tc.points      as points,
                    tc.batch       as batch,
                    MIN(tc.points) as batch_points
                FROM contest_problem cp
                        INNER JOIN
                    submission sub
                    ON (sub.contest_problem_id = cp.id AND sub.contest_participation_id = ? AND sub.status = 'D')
                        INNER JOIN
                    submission_testcase tc
                    ON sub.id = tc.submission_id
                GROUP BY cp.id, tc.batch, sub.id
            ) q
                INNER JOIN
            (
                SELECT
                    prob, batch, MAX(r.batch_points) as max_batch_points
                FROM (
                    SELECT  cp.id          as prob,
                            tc.batch       as batch,
                            MIN(tc.points) as batch_points
                    FROM contest_problem cp
                            INNER JOIN
                        submission sub
                        ON (sub.contest_problem_id = cp.id AND sub.contest_participation_id = ? AND sub.status = 'D')
                            INNER JOIN
                        submission_testcase tc
                        ON sub.id = tc.submission_id
                    GROUP BY cp.id, tc.batch, sub.id
                ) r
                GROUP BY prob, batch
            ) p
            ON p.prob = q.prob AND (p.batch = q.batch OR p.batch is NULL AND q.batch is NULL)
            WHERE p.max_batch_points = q.batch_points
            GROUP BY q.prob, q.batch
        `, [participation.id, participation.id]);

        let total_time = 0;
        let total_points = 0;
        let format_data: FormatData = {};

        for (const { prob, date, batch_points } of query) {
            const contest_problem_id = prob.toString();
            let time = 0;

            if (this.config.cumtime) {
                time = (date.getTime() - participation.participationDate.getTime()) / 1000;
            }

            if (!format_data[contest_problem_id]) {
                format_data[contest_problem_id] = { points: 0, time: 0 };
            }

            format_data[contest_problem_id]['points'] += batch_points;
            format_data[contest_problem_id]['time'] = Math.max(time, format_data[contest_problem_id]['time']);
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

    *get_short_form_display(): Generator<string> {
        yield 'The maximum score for each problem batch will be used.';

        if (this.config.cumtime) {
            yield `Ties will be broken by the sum of the last score altering submission time
                   on problems with a non-zero score.`;
        } else {
            yield 'Ties by score will **not** be broken.';
        }
    }
};
