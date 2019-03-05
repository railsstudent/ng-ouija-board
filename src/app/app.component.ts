import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { EMPTY, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

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

    constructor(titleService: Title) {
        titleService.setTitle('Ng Ouija Board');
    }

    ngOnInit() {
        const toSpell$ = of('ponies');
        const spelling$ = toSpell$.pipe(
            mergeMap(word => {
                console.log('word', word);
                return EMPTY;
            }),
        );
    }

    findLetter(l: string) {
        const span = this.allLetters.find(a => a.nativeElement.classList.contains(`letter-${l.toUpperCase()}`)) as HTMLSpanElement;
        const rect = span.getBoundingClientRect();
        const { top, left } = rect;
        return { x: left, y: top };
    }
}
