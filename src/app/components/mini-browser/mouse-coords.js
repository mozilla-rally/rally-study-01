import { tweened } from 'svelte/motion';
import { cubicInOut } from 'svelte/easing';

const DEFAULTS = { easing: cubicInOut, duration: 800 };

function delay(ms = 0) {
    return new Promise((go) => { setTimeout(go, ms) })
}

export default function mouseCoords(x, y, p = {}) {
    const systemParams = Object.assign({}, DEFAULTS, p);
    const coords = tweened({x, y}, systemParams);
    coords.goTo = (x, y, p = { easing: cubicInOut }) => {
        const params = Object.assign({}, systemParams, p);
        coords.set({x, y}, params);
        return delay(params.duration);
    }
    coords.goToElement = (element, p = {}) => {
        const params = Object.assign({}, systemParams, p);
        const rect = element.getBoundingClientRect();
        return coords.goTo( (rect.left + rect.right) / 2, (rect.bottom + rect.top) / 2, params);
    }
    return coords;
}