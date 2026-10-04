import SWR = require('senangwebs-roll');
const roll = new SWR('#roll', { items: [{ type: 'video', src: 'video.mp4', controls: false }] });
const config: SWR.ResolvedConfig = roll.getConfig();
const instance: SWR | null = SWR.getInstance('#roll');
const unsubscribe: () => void = roll.on('initialized', data => console.log(data));
SWR.initAll(document);
void config; void instance; unsubscribe();
