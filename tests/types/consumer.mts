import SWR, { SWR as NamedSWR } from 'senangwebs-roll';
import 'senangwebs-roll/dist/swr.css';
const config: SWR.Config = { loop: true, items: [{ type: 'html', content: '<p>Trusted HTML</p>' }] };
const roll: SWR = new NamedSWR(document.createElement('div'), config);
const instances: SWR[] = SWR.initAll(document);
roll.on('mediaPlaybackError', ({ index, error }) => { console.log(index, error); });
void instances;
