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


// export function judge_request(packet: object, reply: boolean = true) {
//     const sock = net.createConnection(
//         { port: Number(process.env.BRIDGE_PORT), host: process.env.BRIDGE_HOST }
//     );

//     sock.on('connect', () => {
//         const output = JSON.stringify(packet);
//         const deflatedOuput = zlib.deflateSync(output);
//         const tag = pack('!I', deflatedOuput.length);
//         sock.write(tag);
//         sock.write(deflatedOuput);
//     });


//     if (reply) {
//         sock.on('data', (data) => {
//             const tag = Number(unpack('!I', data.subarray(0, 4))[0]);
//             const deflatedInput = data.subarray(4, 4 + tag);
//             const input = zlib.inflateSync(deflatedInput).toString('utf-8');
//             process_data(JSON.parse(input));
//             sock.destroy();
//         });
//     } else {
//         sock.destroy();
//     }
// }


// function process_data(data: {[name: string]: string}) {
//     console.log(data['name']);
// }


// export function submission_request(
//     submission: Number, rejudge: Boolean = false, batch_rejudge: Boolean = false, judge_id: Number | null = null
// ) {
// }
