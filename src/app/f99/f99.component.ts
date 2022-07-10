import { Component, OnInit } from '@angular/core';
import { optseql, feld, optball, optsall } from "../feld/feld.component"
import { worker } from "../app.component"

const beispiele: string[] = [
  '000970000040250107007600403012800600970040035004002910201007500409081060000029000',
  '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
  '109080000020109000003020190000403020000050403430006050050000706706000080080760009',
  '580600400700003600000091080000000000050180003000306045040200060903000000020000100',
  '000600327500702010000800600354000006090057040700000253000003000070408009431009000',
  '060450000400280050100000420006708000040010080000604030039000004050097003000042060',
  '214000600000049050900001000090000003000963000800000040000100004060420000003000178',
  '123456789123456789123456789123456789123456789123456789123456789123456789123456789'
]

export class brett {
  rowcnt: number = 9; // typ: 9
  colcnt: number = 9; // typ: 9
  blkcnt: number = 9; // typ: 9
  rows: number[][] = []; // typ: [0..8][0..80]
  cols: number[][] = []; // typ: [0..8][0..80]
  blks: number[][] = []; // typ: [0..8][0..80]
  felder: feld[] = []; // rows * cols
  // Zeigt an, wenn Sudoku nicht mehr lösbar
  conflict: boolean = false;
  //Eingabemodus: Mausclicks setzten Werte nicht Optionen
  eingabe: boolean = false;
  // Summe der Optionen: 81 (9*9) .. 729 (9*9*9)
  sinput: string = "";
  get compsum(): number {
    return this.felder.map(x => x.opts.length).reduce((a, b) => a + b);
  };
  // Zur Ausgabe der vorgegebenen Werte in String Format: 
  get vorgabe(): string {
    return (this.felder.map(x => x.fix ? Number(x.val) : 0)).join("");
  };
  // Zur Ausgabe der eindeutigen in String Format: 
  get iststand(): string {
    return (this.felder.map(x => ((x.opts.length === 1) ? Number(x.opts[0]) : 0)).join(""));
  };
  get beispiele(): string[] {
    return beispiele
  };
  beispielidx: number = 0;
  anzloesungen: number = 99;
}


@Component({
  selector: 'app-f99',
  templateUrl: './f99.component.html',
  styleUrls: ['./f99.component.css']
})
export class F99Component implements OnInit {

  optsall = optsall;
  brett: brett = new brett;
  // sinput: string = "";

  nur1opt(opt: string, g: number[]): void {
    let fl = g.filter(x => this.brett.felder[x].opts.some(y => y === opt));
    if (fl.length === 1) {
      this.brett.felder[fl[0]].opts = [opt];
      this.brett.felder[fl[0]].valin = opt;
      this.brett.felder[fl[0]].val = opt;
    }
  }

  L1handler(): void {
    let gs = this.brett.rows.concat(this.brett.cols, this.brett.blks);
    for (let opt of optsall) {
      for (let g of gs) {
        this.nur1opt(opt, g)
      };
    }
  };

  removeopts(opts: string[], f: feld) {
    f.opts = f.opts.filter(st => !opts.includes(st));
    if (f.opts.length === 1) {
      f.val = f.opts[0];
      f.valin = f.val;
    } else if (f.opts.length === 0) {
      f.valin = "X"; this.brett.conflict = true;
    };
  };

  L2handler(): void {
    let flds = this.brett.felder;
    let gs = this.brett.rows.concat(this.brett.cols, this.brett.blks);
    for (let g of gs) {
      for (let id of g) {
        if (flds[id].opts.length !== 1) continue;
        for (let idr of g) {
          if (id === idr) continue;
          this.removeopts(flds[id].opts, flds[idr]);
        }
      }
    }
  }


  L3handler(): void {
    let gs = this.brett.rows.concat(this.brett.cols, this.brett.blks);
    for (let g of gs) {
      for (let i = 0; i < (g.length - 1); i++) {
        if (this.brett.felder[i].opts.length !== 2) continue;
        for (let j = i + 1; j < g.length; j++) {
          if (!optseql(this.brett.felder[j].opts, this.brett.felder[i].opts)) continue;
          for (let k = 0; k < g.length; k++) {
            if (k === i || k === j) continue;
            let k1 = this.brett.felder[k].opts;
            this.removeopts(this.brett.felder[j].opts, this.brett.felder[k]);
            let k2 = this.brett.felder[k].opts;
            if (k1.length != k2.length) {
              console.log(k + "in" + g + ": " + this.brett.felder[j].opts + "  " + k1 + "  " + k2);
            }
          }
        }
      }
    }
  };

  L4handler(): void {
    let gs = this.brett.rows.concat(this.brett.cols, this.brett.blks);
    for (let g of gs) {
      for (let i = 0; i < optsall.length - 1; i++) {
        let o1 = g.filter(x => this.brett.felder[x].opts.includes(optsall[i]));
        if (o1.length !== 2) continue;
        for (let j = i + 1; j < optsall.length; j++) {
          let o2 = g.filter(x => this.brett.felder[x].opts.includes(optsall[j]));
          if (o2.length !== 2) continue;
          if (o1[0] !== o2[0] || o1[1] !== o2[1]) continue;
          this.brett.felder[o1[0]].opts = [optsall[i], optsall[j]];
          this.brett.felder[o1[1]].opts = [optsall[i], optsall[j]];

        }
      }
    }
  }


  L5handler(): void {
    let gs = this.brett.rows.concat(this.brett.cols, this.brett.blks);
    for (let g of gs) {
      for (let i = 0; i < (g.length - 2); i++) {
        if (this.brett.felder[i].opts.length !== 3) continue;
        for (let j = i + 1; j < g.length - 1; j++) {
          if (!optseql(this.brett.felder[j].opts, this.brett.felder[i].opts)) continue;
          for (let k = j + 1; k < g.length; k++) {
            if (!optseql(this.brett.felder[k].opts, this.brett.felder[j].opts)) continue;
            for (let l = 0; l < g.length; l++) {
              if (l === i || l === j || l === k) continue;
              let l1 = this.brett.felder[l].opts;
              this.removeopts(this.brett.felder[k].opts, this.brett.felder[l]);
              let l2 = this.brett.felder[l].opts;
              if (l1.length != l2.length) {
                console.log(l + "in" + g + ": " + this.brett.felder[k].opts + "  " + l1 + "  " + l2);
              }
            }
          }
        }
      }
    }
  }

  L6handler(): void {
    let gs = this.brett.rows.concat(this.brett.cols, this.brett.blks);
    for (let g of gs) {
      for (let i = 0; i < optsall.length - 2; i++) {
        let o1 = g.filter(x => this.brett.felder[x].opts.includes(optsall[i]));
        if (o1.length !== 3) continue;
        for (let j = i + 1; j < optsall.length - 1; j++) {
          let o2 = g.filter(x => this.brett.felder[x].opts.includes(optsall[j]));
          if (o2.length !== 3) continue;
          for (let k = j + 1; k < optsall.length; k++) {
            let o3 = g.filter(x => this.brett.felder[x].opts.includes(optsall[k]));
            if (o3.length !== 3) continue;
            if (!(o1[0] == o2[0] && o1[0] == o3[0] &&
              o1[1] == o2[1] && o1[1] == o3[1] &&
              o1[2] == o2[2] && o1[2] == o3[2]))
              continue;
            this.brett.felder[o1[0]].opts = [optsall[i], optsall[j], optsall[k]];
            this.brett.felder[o1[1]].opts = this.brett.felder[o1[0]].opts;
            this.brett.felder[o1[2]].opts = this.brett.felder[o1[0]].opts;
          }
        }
      }
    }
  };


  L99handler(): void {
    worker.postMessage(this.brett.iststand);
    worker.onmessage = ({ data }) => {
      this.brett.anzloesungen = data;
      // console.log(`page got message: ${data}`);
    };
  };

  prop2handler(): void {
    let flds = this.brett.felder;
    for (let i = 0; i < flds.length; i++) {
      if (flds[i].opts.length !== 2) continue;
      for (let j = 0; j < flds.length; j++) {
        if (i === j) continue;
        if (flds[j].opts !== flds[j].opts) continue;
        if (flds[i].row === flds[j].row) {
        };

        if (flds[i].col === flds[j].col) {

        };
        if (flds[i].blk === flds[j].blk) {
          flds[j].opts = flds[j].opts.filter(st => st !== flds[i].opts[0]);
          if (flds[j].opts.length === 1) {
            flds[j].val = flds[j].opts[0];
            flds[j].valin = flds[j].val;
          }
        }
      }
    }
  }

  sinputngModelChange(event: any): void {
    let si: string = this.brett.sinput;
    const regex = /\d/g; // ziffern global, per spread ... to array
    let numstr: string = ([...si.matchAll(regex)].join("")).padEnd(81, '0');
    for (let i = 0; i < this.brett.felder.length; i++) {

      let si: string = numstr[i];
      if (si === '0') {
        this.brett.felder[i].opts = optsall;
        this.brett.felder[i].val = "_";
        this.brett.felder[i].fix = false;
      } else {
        this.brett.felder[i].opts = [si];
        this.brett.felder[i].val = si;
        this.brett.felder[i].fix = true;
      };
      this.brett.felder[i].valin = this.brett.felder[i].val;
    };
    this.brett.conflict = false;
  }


  beispielhandler(): void {
    for (let i = 0; i < this.brett.felder.length; i++) {
      let si: string = beispiele[this.brett.beispielidx][i];
      if (si === '0') {
        this.brett.felder[i].opts = optsall;
        this.brett.felder[i].val = "_";
        this.brett.felder[i].fix = false;
      } else {
        this.brett.felder[i].opts = [si];
        this.brett.felder[i].val = si;
        this.brett.felder[i].fix = true;
      };
      this.brett.felder[i].valin = this.brett.felder[i].val;
    };
    this.brett.conflict = false;
  };

  // setze alle Werte auf "0"
  resethandler(): void {
    for (let i = 0; i < (this.brett.felder.length); i++) {
      let nfeld = this.brett.felder[i];
      nfeld.val = "";
      nfeld.opts = optsall;
      nfeld.fix = false;
      nfeld.eingabe = true;
      nfeld.valin = nfeld.val;
      this.brett.felder[i] = nfeld;
    };
    this.brett.conflict = false;
  };

  fixithandler(): void {
    for (let i = 0; i < (this.brett.felder.length); i++) {
      let nfeld = this.brett.felder[i];
      if ((nfeld.valin.length !== 1) || (nfeld.valin === "0") || (nfeld.valin === "_")) {
        nfeld.valin = "";
        nfeld.opts = optsall;
        nfeld.fix = false;
        nfeld.val = nfeld.valin;
        continue;
      };
      if (nfeld.valin > "0" && nfeld.valin <= "9")
        nfeld.opts = [nfeld.valin];
      nfeld.fix = true;
      nfeld.val = nfeld.valin;
    }
  };
  constructor() {
    //    console.log("F99C constructor");
    //    console.log(fvals[3]);
    this.brett.rowcnt = 9;
    this.brett.colcnt = 9;
    this.brett.blkcnt = 9;
    this.brett.conflict = false;
    let nfeld: feld;
    this.brett.felder = new Array<feld>(this.brett.colcnt * this.brett.rowcnt);
    for (let i = 0; i < (this.brett.rowcnt * this.brett.colcnt); i++) {
      nfeld = new feld;
      nfeld.id = i;
      nfeld.row = Math.floor(i / this.brett.colcnt);
      nfeld.col = i % this.brett.colcnt;
      nfeld.blk = 3 * Math.floor(nfeld.row / 3) + Math.floor(nfeld.col / 3);
      nfeld.opts = optsall;
      nfeld.val = "_";
      nfeld.fix = false;
      nfeld.valin = nfeld.val;
      this.brett.felder[i] = nfeld;
    };
    this.brett.rows = [];
    for (let i = 0; i < this.brett.rowcnt; i++) {
      this.brett.rows[i] = this.brett.felder.filter(f => f.row === i).map(f => f.id);
    };
    this.brett.cols = [];
    for (let i = 0; i < this.brett.colcnt; i++) {
      this.brett.cols[i] = this.brett.felder.filter(f => f.col === i).map(f => f.id);
    };
    this.brett.blks = [];
    for (let i = 0; i < this.brett.blkcnt; i++) {
      this.brett.blks[i] = this.brett.felder.filter(f => f.blk === i).map(f => f.id);
    };
    console.log(this.brett.blks);
  };
  ngOnInit(): void {
  }

}
