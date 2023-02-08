import net from 'net';
import * as zlib from 'zlib';

import { pack, unpack } from 'python-struct';
import { Submission, SubmissionTestcase } from '@vulcan/models';
import { In, Not } from 'typeorm';


export function judge_request(packet: object, reply: boolean = true, callback: Function = () => {}) {
    const sock = net.createConnection({
        host: process.env.BRIDGE_HOST,
        port: Number(process.env.BRIDGE_PORT),
    });

    const output = JSON.stringify(packet);
    const deflatedOuput = zlib.deflateSync(output);
    const tag = pack('!I', deflatedOuput.length);
    sock.connect(Number(process.env.BRIDGE_PORT), process.env.BRIDGE_HOST, () => {
            sock.write(tag);
            sock.write(deflatedOuput);
        }
    );

    if (reply) {
        sock.on('data', (buffer) => {
            const tag = Number(unpack('!I', buffer.subarray(0, 4))[0]);
            const deflatedInput = buffer.subarray(4, 4 + tag);
            const input = zlib.inflateSync(deflatedInput);
            const data = JSON.parse(input.toString());
            sock.destroy();
            callback(data);
        });
    }
}


export async function judge_submission(
    submission: Submission, rejudge: Boolean = false, batch_rejudge: Boolean = false, judge_id: Number | null = null
) {
    const updates: object = {
        'time': null,
        'memory': null,
        'points': null,
        'result': null,
        'case_points': 0,
        'case_total': 0,
        'error': null,
        'rejudged_date': (rejudge || batch_rejudge) ? new Date() : null,
        'status': 'QU',
    };

    if (!((await Submission.update({ id: submission.id, status: Not(In(['P', 'G'])) }, updates)).affected)) {
        return false;
    }

    await SubmissionTestcase.remove(await SubmissionTestcase.find({  where: {submission: { id: Number(submission.id) } } }));

    try {
        const response = judge_request({
            'name': 'submission-request',
            'submission-id': submission.id,
            'problem-id': (await submission.problem).code,
            'language': (await submission.language).code,
            'source': (await submission.source).source,
            'judge-id': judge_id,
            'banned-judges': [],  // TODO: Implement banned judges
            'priority': Number(batch_rejudge ? process.env.BATCH_REJUDGE_PRIORITY : (rejudge ? process.env.REJUDGE_PRIORITY : process.env.CONTEST_SUBMISSION_PRIORITY)),
        }, true, (response: any) => {
            if (response['name'] !== 'submission-received' || response['submission-id'] !== submission.id) {
                submission.status = 'IE';
                submission.result = 'IE';
                submission.save();
            }
        });
        return true;
    } catch (e) {
        console.log(e);
        submission.status = 'IE';
        submission.result = 'IE';
        await submission.save();
        return false;
    }
}
