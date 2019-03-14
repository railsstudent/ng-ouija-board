import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { concat, Observable, of, timer } from 'rxjs';
import { concatMap, map, mergeMap, share, tap } from 'rxjs/operators';
import { RxAnimationService } from './services';

interface Coordinates {
    x: number;
    y: number;
}

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    title = 'Yolo Brolo Ouija Board';
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    tweenX = 0;
    tweenY = 0;

    x$: Observable<number>;
    y$: Observable<number>;

    constructor(titleService: Title, private animateService: RxAnimationService, @Inject(DOCUMENT) private document: Document) {
        titleService.setTitle('Ng Ouija Board');
    }

    ngOnInit() {
        const toSpell$ = of('yolobrolo');

        const spelling$ = toSpell$.pipe(
            mergeMap(word => word.split('')),
            concatMap(letter => timer(200).pipe(map(() => letter))),
            map(letter => this.findLetter(letter)),
            share(),
        );

        this.x$ = spelling$.pipe(
            map(({ x }) => x),
            concatMap(x => concat(timer(300), this.animateService.tween(this.tweenX, x, 1000))),
            tap(dist => (this.tweenX = dist)),
        );

        this.y$ = spelling$.pipe(
            map(({ y }) => y),
            concatMap(y => concat(timer(300), this.animateService.tween(this.tweenY, y, 1000))),
            tap(dist => (this.tweenY = dist)),
        );
    }

    findLetter(l: string): Coordinates {
        const $el = this.document.querySelector(`.letter-${l.toUpperCase()}`);
        const rect = $el.getBoundingClientRect();
        // console.log('letter', l, rect);
        const { top, left } = rect;
        return { x: left, y: top };
    }
}
