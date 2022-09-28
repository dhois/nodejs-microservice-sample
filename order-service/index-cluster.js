import cluster from 'cluster';
import * as os from 'os';

cluster.schedulingPolicy = cluster.SCHED_RR;
console.log(`master pid=${process.pid}`);
cluster.setupPrimary({
    exec: 'index.js'
});

for (let i = 0; i < os.cpus().length; i++) {
    cluster.fork();
}

cluster
    .on('disconnect', (worker) => console.log('disconnect', worker.id))
    .on('exit', (worker, code, signal) => console.log('exit', worker.id, code, signal))
    .on('listening', (worker, {address, port}) => console.log('listening', worker.id, `${address}:${port}`));