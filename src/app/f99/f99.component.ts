import { Component, OnInit } from '@angular/core';
import optseql, { feld, optball, optsall } from "../feld/feld.component"

const beispiele: number[][] = [
  [
    0, 0, 0, 9, 7, 0, 0, 0, 0,
    0, 4, 0, 2, 5, 0, 1, 0, 7,
    0, 0, 7, 6, 0, 0, 4, 0, 3,
    0, 1, 2, 8, 0, 0, 6, 0, 0,
    9, 7, 0, 0, 4, 0, 0, 3, 5,
    0, 0, 4, 0, 0, 2, 9, 1, 0,
    2, 0, 1, 0, 0, 7, 5, 0, 0,
    4, 0, 9, 0, 8, 1, 0, 6, 0,
    0, 0, 0, 0, 2, 9, 0, 0, 0],
  [
    0, 0, 0, 2, 6, 0, 7, 0, 1,
    6, 8, 0, 0, 7, 0, 0, 9, 0,
    1, 9, 0, 0, 0, 4, 5, 0, 0,
    8, 2, 0, 1, 0, 0, 0, 4, 0,
    0, 0, 4, 6, 0, 2, 9, 0, 0,
    0, 5, 0, 0, 0, 3, 0, 2, 8,
    0, 0, 9, 3, 0, 0, 0, 7, 4,
    0, 4, 0, 0, 5, 0, 0, 3, 6,
    7, 0, 3, 0, 1, 8, 0, 0, 0],
  [1, 0, 9, 0, 8, 0, 0, 0, 0, 0, 2, 0, 1, 0, 9, 0, 0, 0, 0, 0, 3, 0, 2, 0, 1, 9, 0, 0,
    0, 0, 4, 0, 3, 0, 2, 0, 0, 0, 0, 0, 5, 0, 4, 0,
    3, 4, 3, 0, 0, 0, 6, 0, 5, 0, 0, 5, 0, 0, 0, 0, 7, 0, 6, 7, 0, 6, 0, 0, 0, 0, 8, 0,
    0, 8, 0, 7, 6, 0, 0, 0, 9],
  [
    5, 8, 0, 6, 0, 0, 4, 0, 0,
    7, 0, 0, 0, 0, 3, 6, 0, 0,
    0, 0, 0, 0, 9, 1, 0, 8, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 5, 0, 1, 8, 0, 0, 0, 3,
    0, 0, 0, 3, 0, 6, 0, 4, 5,
    0, 4, 0, 2, 0, 0, 0, 6, 0,
    9, 0, 3, 0, 0, 0, 0, 0, 0,
    0, 2, 0, 0, 0, 0, 1, 0, 0]]



export class brett {
  rowcnt: number; // typ: 9
  colcnt: number; // typ: 9
  blkcnt: number; // typ: 9
  rows: number[][]; // typ: [0..8][0..80]
  cols: number[][]; // typ: [0..8][0..80]
  blks: number[][]; // typ: [0..8][0..80]
  felder: feld[]; // rows * cols
  conflict: boolean;
  get compsum(): number {
    return this.felder.map(x => x.opts.length).reduce((a, b) => a + b);
  };
  get const(): number[] {
    return this.felder.map(x => x.fix ? Number(x.val) : 0);
  };
  get beispiele(): number[][] {
    return beispiele
  };
  beispielidx: number;
}


@Component({
  selector: 'app-f99',
  templateUrl: './f99.component.html',
  styleUrls: ['./f99.component.css']
})
export class F99Component implements OnInit {

  optsall = optsall;
  brett: brett = new brett;


  mschangehandler(fld: feld): void {
    console.log("log mschangehandler");
    console.log(fld.opts);
    if (fld.fix) {
      fld.valin = fld.val;
      fld.opts = [fld.val];
    } else if (fld.opts.length === 0) {
      fld.val = "X"; fld.valin = fld.val;
    } else if (fld.opts.length === 1) {
      fld.val = fld.opts[0]; fld.valin = fld.val;
    } else {
      fld.val = "_"; fld.valin = fld.val;
    }
  }

  inchangehandler(fld: feld): void {
    console.log("log inchangehandler");
    if (fld.valin.length === 0 || fld.valin.length > 1) {
      fld.valin = "_"; fld.val = "_";
      fld.opts = optsall;
      this.brett.conflict = false;
    }
  }


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
  }

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

  beispielhandler(): void {
    for (let i = 0; i < this.brett.felder.length; i++) {
      let si: number = beispiele[this.brett.beispielidx][i];
      if (si === 0) {
        this.brett.felder[i].opts = optsall;
        this.brett.felder[i].val = "_";
        this.brett.felder[i].fix = false;
      } else {
        this.brett.felder[i].opts = [String(si)];
        this.brett.felder[i].val = String(si);
        this.brett.felder[i].fix = true;
      };
      this.brett.felder[i].valin = this.brett.felder[i].val;
    };
    this.brett.conflict = false;
  };


  L0handler(): void {
    for (let i = 0; i < (this.brett.felder.length); i++) {
      let nfeld = this.brett.felder[i];
      nfeld.val = "";
      nfeld.opts = optsall;
      nfeld.fix = false;
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
      nfeld.fix = (1 == (i % 7));
      if (nfeld.fix) {
        nfeld.val = String(((i * i) % 9) + 1);
        nfeld.opts = [nfeld.val];
      };
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
