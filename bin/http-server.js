import httpServer from '../src/http/server';
import gracefulShutdownMix from 'http-shutdown';

const httpPort = 8080;

function onListen() {
    console.log(`=========== HTTP SERVER SUCCESFULL RUN ON PORT ${httpPort} ===========`);
}

const nativeHttpServer = httpServer.listen(httpPort, onListen);
const serverWithShutdown = gracefulShutdownMix(nativeHttpServer);

process.on('SIGINT', () => {
    console.log('=========== START SHUTDOWN SERVER ===========');

    const shutdownCallback = err => {
        if(err) {
            console.log(err);
            process.exit(1);
        }

        process.exit(0);
    };

    const timer = setTimeout(() => {
        console.log('=========== FORCE SHUTDOWN HTTP SERVER BY TIMEOUT ===========');
        serverWithShutdown.forceShutdown(err => {
            shutdownCallback(err);
        })
    }, 4000);

    serverWithShutdown.shutdown(err => {
        clearTimeout(timer);
        shutdownCallback(err);
    })
})
