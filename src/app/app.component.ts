import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable, of, timer } from 'rxjs';
import { concatMap, map, mergeMap } from 'rxjs/operators';

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

    constructor(titleService: Title) {
        titleService.setTitle('Ng Ouija Board');
    }

    ngOnInit() {
        const toSpell$ = of('ponies');
        toSpell$
            .pipe(
                mergeMap(word => word.split('')),
                concatMap(letter => timer(200).pipe(map(() => letter))),
            )
            .subscribe(letter => {
                const { x, y } = this.findLetter(letter);
                this.x = x;
                this.y = y;
            });
    }

    findLetter(l: string) {
        const span = this.allLetters.find(a => a.nativeElement.classList.contains(`letter-${l.toUpperCase()}`)) as ElementRef;
        const rect = span.nativeElement.getBoundingClientRect();
        const { top, left } = rect;
        return { x: left, y: top };
    }
}
