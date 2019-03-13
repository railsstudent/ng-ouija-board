import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { concat, Observable, of, timer } from 'rxjs';
import { concatMap, map, mergeMap, share, tap } from 'rxjs/operators';
import { RxAnimationService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
    @ViewChildren('letters')
    allLetters: QueryList<any>;

    title = 'Yolo Brolo Ouija Board';
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    spelling$: Observable<string>;
    x = 0;
    y = 60;

    x$: Observable<string>;
    y$: Observable<string>;

    tweenX = 0;
    tweenY = 0;

    constructor(titleService: Title, private animateService: RxAnimationService) {
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
            tap(dist => console.log('How far does x tween?', dist)),
            map(dist => `${dist}px`),
        );

        this.y$ = spelling$.pipe(
            map(({ y }) => y),
            concatMap(y => concat(timer(300), this.animateService.tween(this.tweenY, y, 1000))),
            tap(dist => (this.tweenY = dist)),
            tap(dist => console.log('How far does y tween?', dist)),
            map(dist => `${dist}px`),
        );
    }

    findLetter(l: string) {
        const span = this.allLetters.find(a => a.nativeElement.classList.contains(`letter-${l.toUpperCase()}`)) as ElementRef;
        const rect = span.nativeElement.getBoundingClientRect();
        console.log('letter', l, rect);
        const { top, left } = rect;
        return { x: left, y: top } as { x: number; y: number };
    }
}
