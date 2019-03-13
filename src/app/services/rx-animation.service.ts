import { Injectable } from '@angular/core';
import { animationFrameScheduler, defer, timer } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class RxAnimationService {
    frames(scheduler = animationFrameScheduler) {
        return defer(() => {
            const start = scheduler.now();
            return timer(0, 0, animationFrameScheduler).pipe(map(() => scheduler.now() - start));
        });
    }

    duration(ms: number, scheduler = animationFrameScheduler) {
        return this.frames(scheduler).pipe(
            map(elapsed => elapsed / ms),
            takeWhile(d => d <= 1),
        );
    }

    tween(start: number, end: number, ms: number, scheduler = animationFrameScheduler) {
        const diff = end - start;
        return this.duration(ms, scheduler).pipe(map(d => start + d * diff));
    }
}
