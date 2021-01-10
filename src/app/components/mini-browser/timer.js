import { tweened } from 'svelte/motion';


export default function timer(startAt = 0) {
    const { set, subscribe } = tweened(startAt, { duration: 1000 });
    let elapsedTimer;
    let ms = 0;
    return {
        subscribe,
        restart() {
            if (elapsedTimer) {
                ms = 1000;
                set(0, { duration: 0 });
                set(ms);
                clearInterval(elapsedTimer);
            }
            elapsedTimer = setInterval(() => {
                ms += 1000;
                set(ms);
            }, 1000);
        },
        stop() {
            clearInterval(elapsedTimer);
        }
    }
}