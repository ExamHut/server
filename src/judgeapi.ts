import net from 'net';
import * as zlib from 'zlib';

import { SocketClientTCP } from 'netlinkwrapper';
import { pack, unpack } from 'python-struct';
import { Submission, ContestSubmission, SubmissionTestcase } from '@vulcan/models';


export function judge_request(packet: object, reply: boolean = true) {
    const sock = new SocketClientTCP(Number(process.env.BRIDGE_PORT), process.env.BRIDGE_HOST);

    const output = JSON.stringify(packet);
    const deflatedOuput = zlib.deflateSync(output);
    const tag = pack('!I', deflatedOuput.length);
    sock.send(tag);
    sock.send(deflatedOuput);

    if (reply) {
        const buffer = sock.receive();
        const tag = Number(unpack('!I', buffer.subarray(0, 4))[0]);
        const deflatedInput = buffer.subarray(4, 4 + tag);
        const input = zlib.inflateSync(deflatedInput);
        const data = JSON.parse(input.toString());
        sock.disconnect();
        return data;
    } else {
        sock.disconnect();
        return;
    }
}


export function judge_submission(
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
}
