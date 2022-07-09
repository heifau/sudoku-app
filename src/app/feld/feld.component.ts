import { Component, OnInit, Input } from '@angular/core';

//optionen stringformat gleichheitstester
export function optseql(a1: Array<string>, a2: Array<string>): boolean {
  if (a1.length !== a2.length) return false;
  if (a1.length === 0) return true;
  for (let i = 0; i < a1.length; i++) {
    if (a1[i] !== a2[i]) return false;
  };
  return true;
}

//optionen binär alle
export const optball: boolean[] = [
  true, true, true, true, true, true, true, true, true
]
//optionen string alle
export const optsall: string[] = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9"
]

export class feld {
  id: number = 0; // 0 .. 80
  row: number = 0; // 0 .. 9
  col: number = 0; // 0 .. 9
  blk: number = 0; // 0 .. 9
  //optionen string array
  opts: string[] = []; // optb als string-array, z.B. [1,9] = [true, false ..., true]
  // value des felds, der angezeigt wird
  val: string = ""; // "0.. 9, X, _"
  valin: string = ""; // "_" oder "1" ..9, Zwischenspeicher für Input Feld
  // fix=true: val fest vorgegeben
  fix: boolean = false;
  //eingabe=true: mausclick setzt Werte nicht Optionen
  eingabe: boolean = true;
  //binär test, ob eine Option noch möglich ist
  optb(i: number): boolean {
    return this.opts.includes(String(i));
  }
}


@Component({
  selector: 'app-feld',
  templateUrl: './feld.component.html',
  styleUrls: ['./feld.component.css']
})

export class FeldComponent implements OnInit {
  @Input() f!: feld;
  optsall = optsall;


  //click handler auf einer der optionen
  // toggle: fügt option dazu oder nimmt es weg
  chandler(i: number, event: MouseEvent): void {
    console.log("chandler" + i + " " + event.button);
    if (this.f.eingabe) {
      if (this.f.fix) {
        this.f.fix = false;
        this.f.opts = optsall;
        this.f.val = ""
      } else {
        this.f.fix = true;
        this.f.opts = [String(i)];
        this.f.val = String(i);
      }
    } else {
      if (this.f.optb(i)) {
        this.f.opts = this.f.opts.filter(x => x !== String(i))
      } else {
        this.f.opts = this.f.opts.concat([String(i)]).sort();
      };
    };


  };

  constructor() { }

  ngOnInit(): void {
  }

}
