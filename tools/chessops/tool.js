(() => {
  class ChessOpsTool extends LiChessTools.Tools.ToolBase {

    dependencies = ['EmitRedraw'];

    preferences = [{
      name: 'chessOps',
      category: 'study',
      type: 'single',
      possibleValues: [false, true],
      defaultValue: true,
      advanced: true,
      hidden: true
    }
    ];

    intl = {
      'en-US': {
        'options.study': 'Study',
        'options.chessOps': 'Chessops support'
      },
      'ro-RO': {
        'options.study': 'Studiu',
        'options.chessOps': 'Suport pentru chessops'
      }
    }

    async start() {
      const lt = this.lichessTools;
      const value = lt.currentOptions.getValue('chessOps');
      if (!value) {
        lt.chessops = null;
        return;
      }
      lt.chessops = (function () {
        const chessops = {};
        (function () {
          class r {
            unwrap(r, t) {
              const e = this._chain((t => s.ok(r ? r(t) : t)), (r => t ? s.ok(t(r)) : s.err(r)));
              if (e.isErr)
                throw e.error;
              return e.value
            }
            map(r, t) {
              return this._chain((t => s.ok(r(t))), (r => s.err(t ? t(r) : r)))
            }
            chain(r, t) {
              return this._chain(r, t || (r => s.err(r)))
            }
          }
          class t extends r {
            constructor(r) {
              super(),
                this.value = void 0,
                this.isOk = !0,
                this.isErr = !1,
                this.value = r
            }
            _chain(r, t) {
              return r(this.value)
            }
          }
          class e extends r {
            constructor(r) {
              super(),
                this.error = void 0,
                this.isOk = !1,
                this.isErr = !0,
                this.error = r
            }
            _chain(r, t) {
              return t(this.error)
            }
          }
          var s;
          !function (r) {
            r.ok = function (r) {
              return new t(r)
            },
              r.err = function (r) {
                return new e(r || new Error)
              },
              r.all = function (t) {
                if (Array.isArray(t)) {
                  const e = [];
                  for (let r = 0; r < t.length; r++) {
                    const s = t[r];
                    if (s.isErr)
                      return s;
                    e.push(s.value)
                  }
                  return r.ok(e)
                }
                const e = {},
                  s = Object.keys(t);
                for (let r = 0; r < s.length; r++) {
                  const n = t[s[r]];
                  if (n.isErr)
                    return n;
                  e[s[r]] = n.value
                }
                return r.ok(e)
              }
          }
            (s || (s = {}));
          chessops.Result = s;
        })();
        (function () {
          const t = chessops.Result;
          const e = ["a", "b", "c", "d", "e", "f", "g", "h"],
            s = ["1", "2", "3", "4", "5", "6", "7", "8"],
            r = ["white", "black"],
            i = ["pawn", "knight", "bishop", "rook", "queen", "king"],
            n = ["a", "h"],
            o = t => "role" in t,
            a = t => "from" in t,
            h = ["chess", "antichess", "kingofthehill", "3check", "atomic", "horde", "racingkings", "crazyhouse"],
            c = t => void 0 !== t,
            u = t => "white" === t ? "black" : "white",
            l = t => t >> 3,
            d = t => 7 & t,
            p = t => {
              switch (t) {
                case "pawn":
                  return "p";
                case "knight":
                  return "n";
                case "bishop":
                  return "b";
                case "rook":
                  return "r";
                case "queen":
                  return "q";
                case "king":
                  return "k"
              }
            };
          function f(t) {
            switch (t.toLowerCase()) {
              case "p":
                return "pawn";
              case "n":
                return "knight";
              case "b":
                return "bishop";
              case "r":
                return "rook";
              case "q":
                return "queen";
              case "k":
                return "king";
              default:
                return
            }
          }
          function m(t) {
            if (2 !== t.length)
              return;
            const e = t.charCodeAt(0) - "a".charCodeAt(0),
              s = t.charCodeAt(1) - "1".charCodeAt(0);
            return e < 0 || e >= 8 || s < 0 || s >= 8 ? void 0 : e + 8 * s
          }
          const k = t => e[d(t)] + s[l(t)],
            w = t => {
              if ("@" === t[1] && 4 === t.length) {
                const e = f(t[0]),
                  s = m(t.slice(2));
                if (e && c(s))
                  return {
                    role: e,
                    to: s
                  }
              } else if (4 === t.length || 5 === t.length) {
                const e = m(t.slice(0, 2)),
                  s = m(t.slice(2, 4));
                let r;
                if (5 === t.length && (r = f(t[4]), !r))
                  return;
                if (c(e) && c(s))
                  return {
                    from: e,
                    to: s,
                    promotion: r
                  }
              }
            },
            b = t => o(t) ? `${p(t.role).toUpperCase()}@${k(t.to)}` : k(t.from) + k(t.to) + (t.promotion ? p(t.promotion) : ""),
            g = (t, e) => "white" === t ? "a" === e ? 2 : 6 : "a" === e ? 58 : 62,
            v = (t, e) => "white" === t ? "a" === e ? 3 : 5 : "a" === e ? 59 : 61,
            y = t => (t = (858993459 & (t -= t >>> 1 & 1431655765)) + (t >>> 2 & 858993459), Math.imul(t + (t >>> 4) & 252645135, 16843009) >> 24),
            E = t => (t = t >>> 8 & 16711935 | (16711935 & t) << 8) >>> 16 & 65535 | (65535 & t) << 16,
            C = t => E(t = (t = (t = t >>> 1 & 1431655765 | (1431655765 & t) << 1) >>> 2 & 858993459 | (858993459 & t) << 2) >>> 4 & 252645135 | (252645135 & t) << 4);
          class S {
            constructor(t, e) {
              this.lo = 0 | t,
                this.hi = 0 | e
            }
            static fromSquare(t) {
              return t >= 32 ? new S(0, 1 << t - 32) : new S(1 << t, 0)
            }
            static fromRank(t) {
              return new S(255, 0).shl64(8 * t)
            }
            static fromFile(t) {
              return new S(16843009 << t, 16843009 << t)
            }
            static empty() {
              return new S(0, 0)
            }
            static full() {
              return new S(4294967295, 4294967295)
            }
            static corners() {
              return new S(129, 2164260864)
            }
            static center() {
              return new S(402653184, 24)
            }
            static backranks() {
              return new S(255, 4278190080)
            }
            static backrank(t) {
              return "white" === t ? new S(255, 0) : new S(0, 4278190080)
            }
            static lightSquares() {
              return new S(1437226410, 1437226410)
            }
            static darkSquares() {
              return new S(2857740885, 2857740885)
            }
            complement() {
              return new S(~this.lo, ~this.hi)
            }
            xor(t) {
              return new S(this.lo ^ t.lo, this.hi ^ t.hi)
            }
            union(t) {
              return new S(this.lo | t.lo, this.hi | t.hi)
            }
            intersect(t) {
              return new S(this.lo & t.lo, this.hi & t.hi)
            }
            diff(t) {
              return new S(this.lo & ~t.lo, this.hi & ~t.hi)
            }
            intersects(t) {
              return this.intersect(t).nonEmpty()
            }
            isDisjoint(t) {
              return this.intersect(t).isEmpty()
            }
            supersetOf(t) {
              return t.diff(this).isEmpty()
            }
            subsetOf(t) {
              return this.diff(t).isEmpty()
            }
            shr64(t) {
              return t >= 64 ? S.empty() : t >= 32 ? new S(this.hi >>> t - 32, 0) : t > 0 ? new S(this.lo >>> t ^ this.hi << 32 - t, this.hi >>> t) : this
            }
            shl64(t) {
              return t >= 64 ? S.empty() : t >= 32 ? new S(0, this.lo << t - 32) : t > 0 ? new S(this.lo << t, this.hi << t ^ this.lo >>> 32 - t) : this
            }
            bswap64() {
              return new S(E(this.hi), E(this.lo))
            }
            rbit64() {
              return new S(C(this.hi), C(this.lo))
            }
            minus64(t) {
              const e = this.lo - t.lo,
                s = (e & t.lo & 1) + (t.lo >>> 1) + (e >>> 1) >>> 31;
              return new S(e, this.hi - (t.hi + s))
            }
            equals(t) {
              return this.lo === t.lo && this.hi === t.hi
            }
            size() {
              return y(this.lo) + y(this.hi)
            }
            isEmpty() {
              return 0 === this.lo && 0 === this.hi
            }
            nonEmpty() {
              return 0 !== this.lo || 0 !== this.hi
            }
            has(t) {
              return 0 != (t >= 32 ? this.hi & 1 << t - 32 : this.lo & 1 << t)
            }
            set(t, e) {
              return e ? this.with(t) : this.without(t)
            }
            with(t) {
              return t >= 32 ? new S(this.lo, this.hi | 1 << t - 32) : new S(this.lo | 1 << t, this.hi)
            }
            without(t) {
              return t >= 32 ? new S(this.lo, this.hi & ~(1 << t - 32)) : new S(this.lo & ~(1 << t), this.hi)
            }
            toggle(t) {
              return t >= 32 ? new S(this.lo, this.hi ^ 1 << t - 32) : new S(this.lo ^ 1 << t, this.hi)
            }
            last() {
              return 0 !== this.hi ? 63 - Math.clz32(this.hi) : 0 !== this.lo ? 31 - Math.clz32(this.lo) : void 0
            }
            first() {
              return 0 !== this.lo ? 31 - Math.clz32(this.lo & -this.lo) : 0 !== this.hi ? 63 - Math.clz32(this.hi & -this.hi) : void 0
            }
            withoutFirst() {
              return 0 !== this.lo ? new S(this.lo & this.lo - 1, this.hi) : new S(0, this.hi & this.hi - 1)
            }
            moreThanOne() {
              return 0 !== this.hi && 0 !== this.lo || 0 != (this.lo & this.lo - 1) || 0 != (this.hi & this.hi - 1)
            }
            singleSquare() {
              return this.moreThanOne() ? void 0 : this.last()
            }
            *[Symbol.iterator]() {
              let t = this.lo,
                e = this.hi;
              for (; 0 !== t;) {
                const e = 31 - Math.clz32(t & -t);
                t ^= 1 << e,
                  yield e
              }
              for (; 0 !== e;) {
                const t = 31 - Math.clz32(e & -e);
                e ^= 1 << t,
                  yield 32 + t
              }
            }
            * reversed() {
              let t = this.lo,
                e = this.hi;
              for (; 0 !== e;) {
                const t = 31 - Math.clz32(e);
                e ^= 1 << t,
                  yield 32 + t
              }
              for (; 0 !== t;) {
                const e = 31 - Math.clz32(t);
                t ^= 1 << e,
                  yield e
              }
            }
          }
          const q = (t, e) => {
            let s = S.empty();
            for (const r of e) {
              const e = t + r;
              0 <= e && e < 64 && Math.abs(d(t) - d(e)) <= 2 && (s = s.with(e))
            }
            return s
          },
            R = t => {
              const e = [];
              for (let s = 0; s < 64; s++)
                e[s] = t(s);
              return e
            },
            O = R((t => q(t, [-9, -8, -7, -1, 1, 7, 8, 9]))),
            x = R((t => q(t, [-17, -15, -10, -6, 6, 10, 15, 17]))),
            z = {
              white: R((t => q(t, [7, 9]))),
              black: R((t => q(t, [-7, -9])))
            },
            A = t => O[t],
            M = t => x[t],
            P = (t, e) => z[t][e],
            _ = R((t => S.fromFile(d(t)).without(t))),
            B = R((t => S.fromRank(l(t)).without(t))),
            I = R((t => {
              const e = new S(134480385, 2151686160),
                s = 8 * (l(t) - d(t));
              return (s >= 0 ? e.shl64(s) : e.shr64(-s)).without(t)
            })),
            N = R((t => {
              const e = new S(270549120, 16909320),
                s = 8 * (l(t) + d(t) - 7);
              return (s >= 0 ? e.shl64(s) : e.shr64(-s)).without(t)
            })),
            F = (t, e, s) => {
              let r = s.intersect(e),
                i = r.bswap64();
              return r = r.minus64(t),
                i = i.minus64(t.bswap64()),
                r.xor(i.bswap64()).intersect(e)
            },
            V = (t, e) => {
              const s = S.fromSquare(t);
              return F(s, I[t], e).xor(F(s, N[t], e))
            },
            K = (t, e) => ((t, e) => F(S.fromSquare(t), _[t], e))(t, e).xor(((t, e) => {
              const s = B[t];
              let r = e.intersect(s),
                i = r.rbit64();
              return r = r.minus64(S.fromSquare(t)),
                i = i.minus64(S.fromSquare(63 - t)),
                r.xor(i.rbit64()).intersect(s)
            })(t, e)),
            U = (t, e) => V(t, e).xor(K(t, e)),
            D = (t, e, s) => {
              switch (t.role) {
                case "pawn":
                  return P(t.color, e);
                case "knight":
                  return M(e);
                case "bishop":
                  return V(e, s);
                case "rook":
                  return K(e, s);
                case "queen":
                  return U(e, s);
                case "king":
                  return A(e)
              }
            },
            $ = (t, e) => {
              const s = S.fromSquare(e);
              return B[t].intersects(s) ? B[t].with(t) : N[t].intersects(s) ? N[t].with(t) : I[t].intersects(s) ? I[t].with(t) : _[t].intersects(s) ? _[t].with(t) : S.empty()
            },
            j = (t, e) => $(t, e).intersect(S.full().shl64(t).xor(S.full().shl64(e))).withoutFirst();
          class T {
            constructor() { }
            static default() {
              const t = new T;
              return t.reset(),
                t
            }
            reset() {
              this.occupied = new S(65535, 4294901760),
                this.promoted = S.empty(),
                this.white = new S(65535, 0),
                this.black = new S(0, 4294901760),
                this.pawn = new S(65280, 16711680),
                this.knight = new S(66, 1107296256),
                this.bishop = new S(36, 603979776),
                this.rook = new S(129, 2164260864),
                this.queen = new S(8, 134217728),
                this.king = new S(16, 268435456)
            }
            static empty() {
              const t = new T;
              return t.clear(),
                t
            }
            clear() {
              this.occupied = S.empty(),
                this.promoted = S.empty();
              for (const t of r)
                this[t] = S.empty();
              for (const t of i)
                this[t] = S.empty()
            }
            clone() {
              const t = new T;
              t.occupied = this.occupied,
                t.promoted = this.promoted;
              for (const e of r)
                t[e] = this[e];
              for (const e of i)
                t[e] = this[e];
              return t
            }
            getColor(t) {
              return this.white.has(t) ? "white" : this.black.has(t) ? "black" : void 0
            }
            getRole(t) {
              for (const e of i)
                if (this[e].has(t))
                  return e
            }
            get(t) {
              const e = this.getColor(t);
              if (!e)
                return;
              return {
                color: e,
                role: this.getRole(t),
                promoted: this.promoted.has(t)
              }
            }
            take(t) {
              const e = this.get(t);
              return e && (this.occupied = this.occupied.without(t), this[e.color] = this[e.color].without(t), this[e.role] = this[e.role].without(t), e.promoted && (this.promoted = this.promoted.without(t))),
                e
            }
            set(t, e) {
              const s = this.take(t);
              return this.occupied = this.occupied.with(t),
                this[e.color] = this[e.color].with(t),
                this[e.role] = this[e.role].with(t),
                e.promoted && (this.promoted = this.promoted.with(t)),
                s
            }
            has(t) {
              return this.occupied.has(t)
            }
            *[Symbol.iterator]() {
              for (const t of this.occupied)
                yield [t, this.get(t)]
            }
            pieces(t, e) {
              return this[t].intersect(this[e])
            }
            rooksAndQueens() {
              return this.rook.union(this.queen)
            }
            bishopsAndQueens() {
              return this.bishop.union(this.queen)
            }
            kingOf(t) {
              return this.pieces(t, "king").singleSquare()
            }
          }
          class L {
            constructor() { }
            static empty() {
              const t = new L;
              for (const e of i)
                t[e] = 0;
              return t
            }
            static fromBoard(t, e) {
              const s = new L;
              for (const r of i)
                s[r] = t.pieces(e, r).size();
              return s
            }
            clone() {
              const t = new L;
              for (const e of i)
                t[e] = this[e];
              return t
            }
            equals(t) {
              return i.every((e => this[e] === t[e]))
            }
            add(t) {
              const e = new L;
              for (const s of i)
                e[s] = this[s] + t[s];
              return e
            }
            nonEmpty() {
              return i.some((t => this[t] > 0))
            }
            isEmpty() {
              return !this.nonEmpty()
            }
            hasPawns() {
              return this.pawn > 0
            }
            hasNonPawns() {
              return this.knight > 0 || this.bishop > 0 || this.rook > 0 || this.queen > 0 || this.king > 0
            }
            size() {
              return this.pawn + this.knight + this.bishop + this.rook + this.queen + this.king
            }
          }
          class Q {
            constructor(t, e) {
              this.white = t,
                this.black = e
            }
            static empty() {
              return new Q(L.empty(), L.empty())
            }
            static fromBoard(t) {
              return new Q(L.fromBoard(t, "white"), L.fromBoard(t, "black"))
            }
            clone() {
              return new Q(this.white.clone(), this.black.clone())
            }
            equals(t) {
              return this.white.equals(t.white) && this.black.equals(t.black)
            }
            add(t) {
              return new Q(this.white.add(t.white), this.black.add(t.black))
            }
            count(t) {
              return this.white[t] + this.black[t]
            }
            size() {
              return this.white.size() + this.black.size()
            }
            isEmpty() {
              return this.white.isEmpty() && this.black.isEmpty()
            }
            nonEmpty() {
              return !this.isEmpty()
            }
            hasPawns() {
              return this.white.hasPawns() || this.black.hasPawns()
            }
            hasNonPawns() {
              return this.white.hasNonPawns() || this.black.hasNonPawns()
            }
          }
          class H {
            constructor(t, e) {
              this.white = t,
                this.black = e
            }
            static default() {
              return new H(3, 3)
            }
            clone() {
              return new H(this.white, this.black)
            }
            equals(t) {
              return this.white === t.white && this.black === t.black
            }
          }
          const G = () => ({
            board: T.default(),
            pockets: void 0,
            turn: "white",
            unmovedRooks: S.corners(),
            epSquare: void 0,
            remainingChecks: void 0,
            halfmoves: 0,
            fullmoves: 1
          });
          var Y;
          !function (t) {
            t.Empty = "ERR_EMPTY",
              t.OppositeCheck = "ERR_OPPOSITE_CHECK",
              t.ImpossibleCheck = "ERR_IMPOSSIBLE_CHECK",
              t.PawnsOnBackrank = "ERR_PAWNS_ON_BACKRANK",
              t.Kings = "ERR_KINGS",
              t.Variant = "ERR_VARIANT"
          }
            (Y || (Y = {}));
          class W extends Error { }
          class Z {
            constructor() { }
            static default() {
              const t = new Z;
              return t.unmovedRooks = S.corners(),
                t.rook = {
                  white: {
                    a: 0,
                    h: 7
                  },
                  black: {
                    a: 56,
                    h: 63
                  }
                },
                t.path = {
                  white: {
                    a: new S(14, 0),
                    h: new S(96, 0)
                  },
                  black: {
                    a: new S(0, 234881024),
                    h: new S(0, 1610612736)
                  }
                },
                t
            }
            static empty() {
              const t = new Z;
              return t.unmovedRooks = S.empty(),
                t.rook = {
                  white: {
                    a: void 0,
                    h: void 0
                  },
                  black: {
                    a: void 0,
                    h: void 0
                  }
                },
                t.path = {
                  white: {
                    a: S.empty(),
                    h: S.empty()
                  },
                  black: {
                    a: S.empty(),
                    h: S.empty()
                  }
                },
                t
            }
            clone() {
              const t = new Z;
              return t.unmovedRooks = this.unmovedRooks,
                t.rook = {
                  white: {
                    a: this.rook.white.a,
                    h: this.rook.white.h
                  },
                  black: {
                    a: this.rook.black.a,
                    h: this.rook.black.h
                  }
                },
                t.path = {
                  white: {
                    a: this.path.white.a,
                    h: this.path.white.h
                  },
                  black: {
                    a: this.path.black.a,
                    h: this.path.black.h
                  }
                },
                t
            }
            add(t, e, s, r) {
              const i = g(t, e),
                n = v(t, e);
              this.unmovedRooks = this.unmovedRooks.with(r),
                this.rook[t][e] = r,
                this.path[t][e] = j(r, n).with(n).union(j(s, i).with(i)).without(s).without(r)
            }
            static fromSetup(t) {
              const e = Z.empty(),
                s = t.unmovedRooks.intersect(t.board.rook);
              for (const i of r) {
                const r = S.backrank(i),
                  n = t.board.kingOf(i);
                if (!c(n) || !r.has(n))
                  continue;
                const o = s.intersect(t.board[i]).intersect(r),
                  a = o.first();
                c(a) && a < n && e.add(i, "a", n, a);
                const h = o.last();
                c(h) && n < h && e.add(i, "h", n, h)
              }
              return e
            }
            discardRook(t) {
              if (this.unmovedRooks.has(t)) {
                this.unmovedRooks = this.unmovedRooks.without(t);
                for (const e of r)
                  for (const s of n)
                    this.rook[e][s] === t && (this.rook[e][s] = void 0)
              }
            }
            discardColor(t) {
              this.unmovedRooks = this.unmovedRooks.diff(S.backrank(t)),
                this.rook[t].a = void 0,
                this.rook[t].h = void 0
            }
          }
          class J {
            constructor(t) {
              this.rules = t
            }
            reset() {
              this.board = T.default(),
                this.pockets = void 0,
                this.turn = "white",
                this.castles = Z.default(),
                this.epSquare = void 0,
                this.remainingChecks = void 0,
                this.halfmoves = 0,
                this.fullmoves = 1
            }
            setupUnchecked(t) {
              this.board = t.board.clone(),
                this.board.promoted = S.empty(),
                this.pockets = void 0,
                this.turn = t.turn,
                this.castles = Z.fromSetup(t),
                this.epSquare = tt(this, t.epSquare),
                this.remainingChecks = void 0,
                this.halfmoves = t.halfmoves,
                this.fullmoves = t.fullmoves
            }
            kingAttackers(t, e, s) {
              return ((t, e, s, r) => s[e].intersect(K(t, r).intersect(s.rooksAndQueens()).union(V(t, r).intersect(s.bishopsAndQueens())).union(M(t).intersect(s.knight)).union(A(t).intersect(s.king)).union(P(u(e), t).intersect(s.pawn))))(t, e, this.board, s)
            }
            playCaptureAt(t, e) {
              this.halfmoves = 0,
                "rook" === e.role && this.castles.discardRook(t),
                this.pockets && this.pockets[u(e.color)][e.promoted ? "pawn" : e.role]++
            }
            ctx() {
              const t = this.isVariantEnd(),
                e = this.board.kingOf(this.turn);
              if (!c(e))
                return {
                  king: e,
                  blockers: S.empty(),
                  checkers: S.empty(),
                  variantEnd: t,
                  mustCapture: !1
                };
              const s = K(e, S.empty()).intersect(this.board.rooksAndQueens()).union(V(e, S.empty()).intersect(this.board.bishopsAndQueens())).intersect(this.board[u(this.turn)]);
              let r = S.empty();
              for (const t of s) {
                const s = j(e, t).intersect(this.board.occupied);
                s.moreThanOne() || (r = r.union(s))
              }
              return {
                king: e,
                blockers: r,
                checkers: this.kingAttackers(e, u(this.turn), this.board.occupied),
                variantEnd: t,
                mustCapture: !1
              }
            }
            clone() {
              var t,
                e;
              const s = new this.constructor;
              return s.board = this.board.clone(),
                s.pockets = null === (t = this.pockets) || void 0 === t ? void 0 : t.clone(),
                s.turn = this.turn,
                s.castles = this.castles.clone(),
                s.epSquare = this.epSquare,
                s.remainingChecks = null === (e = this.remainingChecks) || void 0 === e ? void 0 : e.clone(),
                s.halfmoves = this.halfmoves,
                s.fullmoves = this.fullmoves,
                s
            }
            validate(e) {
              if (this.board.occupied.isEmpty())
                return t.err(new W(Y.Empty));
              if (2 !== this.board.king.size())
                return t.err(new W(Y.Kings));
              if (!c(this.board.kingOf(this.turn)))
                return t.err(new W(Y.Kings));
              const s = this.board.kingOf(u(this.turn));
              return c(s) ? this.kingAttackers(s, this.turn, this.board.occupied).nonEmpty() ? t.err(new W(Y.OppositeCheck)) : S.backranks().intersects(this.board.pawn) ? t.err(new W(Y.PawnsOnBackrank)) : (null == e ? void 0 : e.ignoreImpossibleCheck) ? t.ok(void 0) : this.validateCheckers() : t.err(new W(Y.Kings))
            }
            validateCheckers() {
              const e = this.board.kingOf(this.turn);
              if (c(e)) {
                const s = this.kingAttackers(e, u(this.turn), this.board.occupied);
                if (s.nonEmpty())
                  if (c(this.epSquare)) {
                    const r = 8 ^ this.epSquare,
                      i = 24 ^ this.epSquare;
                    if (s.moreThanOne() || s.first() !== r && this.kingAttackers(e, u(this.turn), this.board.occupied.without(r).with(i)).nonEmpty())
                      return t.err(new W(Y.ImpossibleCheck))
                  } else if (s.size() > 2 || 2 === s.size() && $(s.first(), s.last()).has(e))
                    return t.err(new W(Y.ImpossibleCheck))
              }
              return t.ok(void 0)
            }
            dropDests(t) {
              return S.empty()
            }
            dests(t, e) {
              if ((e = e || this.ctx()).variantEnd)
                return S.empty();
              const s = this.board.get(t);
              if (!s || s.color !== this.turn)
                return S.empty();
              let r,
                i;
              if ("pawn" === s.role) {
                r = P(this.turn, t).intersect(this.board[u(this.turn)]);
                const s = "white" === this.turn ? 8 : -8,
                  n = t + s;
                if (0 <= n && n < 64 && !this.board.occupied.has(n)) {
                  r = r.with(n);
                  const e = n + s;
                  ("white" === this.turn ? t < 16 : t >= 48) && !this.board.occupied.has(e) && (r = r.with(e))
                }
                if (c(this.epSquare) && st(this, t, e)) {
                  const t = this.epSquare - s;
                  (e.checkers.isEmpty() || e.checkers.singleSquare() === t) && (i = S.fromSquare(this.epSquare))
                }
              } else
                r = "bishop" === s.role ? V(t, this.board.occupied) : "knight" === s.role ? M(t) : "rook" === s.role ? K(t, this.board.occupied) : "queen" === s.role ? U(t, this.board.occupied) : A(t);
              if (r = r.diff(this.board[this.turn]), c(e.king)) {
                if ("king" === s.role) {
                  const s = this.board.occupied.without(t);
                  for (const t of r)
                    this.kingAttackers(t, u(this.turn), s).nonEmpty() && (r = r.without(t));
                  return r.union(rt(this, "a", e)).union(rt(this, "h", e))
                }
                if (e.checkers.nonEmpty()) {
                  const t = e.checkers.singleSquare();
                  if (!c(t))
                    return S.empty();
                  r = r.intersect(j(t, e.king).with(t))
                }
                e.blockers.has(t) && (r = r.intersect($(t, e.king)))
              }
              return i && (r = r.union(i)),
                r
            }
            isVariantEnd() {
              return !1
            }
            variantOutcome(t) { }
            hasInsufficientMaterial(t) {
              if (this.board[t].intersect(this.board.pawn.union(this.board.rooksAndQueens())).nonEmpty())
                return !1;
              if (this.board[t].intersects(this.board.knight))
                return this.board[t].size() <= 2 && this.board[u(t)].diff(this.board.king).diff(this.board.queen).isEmpty();
              if (this.board[t].intersects(this.board.bishop)) {
                return (!this.board.bishop.intersects(S.darkSquares()) || !this.board.bishop.intersects(S.lightSquares())) && this.board.pawn.isEmpty() && this.board.knight.isEmpty()
              }
              return !0
            }
            toSetup() {
              var t,
                e;
              return {
                board: this.board.clone(),
                pockets: null === (t = this.pockets) || void 0 === t ? void 0 : t.clone(),
                turn: this.turn,
                unmovedRooks: this.castles.unmovedRooks,
                epSquare: et(this),
                remainingChecks: null === (e = this.remainingChecks) || void 0 === e ? void 0 : e.clone(),
                halfmoves: Math.min(this.halfmoves, 150),
                fullmoves: Math.min(Math.max(this.fullmoves, 1), 9999)
              }
            }
            isInsufficientMaterial() {
              return r.every((t => this.hasInsufficientMaterial(t)))
            }
            hasDests(t) {
              t = t || this.ctx();
              for (const e of this.board[this.turn])
                if (this.dests(e, t).nonEmpty())
                  return !0;
              return this.dropDests(t).nonEmpty()
            }
            isLegal(t, e) {
              if (o(t))
                return !(!this.pockets || this.pockets[this.turn][t.role] <= 0) && (("pawn" !== t.role || !S.backranks().has(t.to)) && this.dropDests(e).has(t.to)); {
                if ("pawn" === t.promotion)
                  return !1;
                if ("king" === t.promotion && "antichess" !== this.rules)
                  return !1;
                if (!!t.promotion !== (this.board.pawn.has(t.from) && S.backranks().has(t.to)))
                  return !1;
                const s = this.dests(t.from, e);
                return s.has(t.to) || s.has(ot(this, t).to)
              }
            }
            isCheck() {
              const t = this.board.kingOf(this.turn);
              return c(t) && this.kingAttackers(t, u(this.turn), this.board.occupied).nonEmpty()
            }
            isEnd(t) {
              return !!(t ? t.variantEnd : this.isVariantEnd()) || (this.isInsufficientMaterial() || !this.hasDests(t))
            }
            isCheckmate(t) {
              return !(t = t || this.ctx()).variantEnd && t.checkers.nonEmpty() && !this.hasDests(t)
            }
            isStalemate(t) {
              return !(t = t || this.ctx()).variantEnd && t.checkers.isEmpty() && !this.hasDests(t)
            }
            outcome(t) {
              const e = this.variantOutcome(t);
              return e || (t = t || this.ctx(), this.isCheckmate(t) ? {
                winner: u(this.turn)
              }
                : this.isInsufficientMaterial() || this.isStalemate(t) ? {
                  winner: void 0
                }
                  : void 0)
            }
            allDests(t) {
              t = t || this.ctx();
              const e = new Map;
              if (t.variantEnd)
                return e;
              for (const s of this.board[this.turn])
                e.set(s, this.dests(s, t));
              return e
            }
            play(t) {
              const e = this.turn,
                s = this.epSquare,
                r = nt(this, t);
              if (this.epSquare = void 0, this.halfmoves += 1, "black" === e && (this.fullmoves += 1), this.turn = u(e), o(t))
                this.board.set(t.to, {
                  role: t.role,
                  color: e
                }), this.pockets && this.pockets[e][t.role]--, "pawn" === t.role && (this.halfmoves = 0);
              else {
                const i = this.board.take(t.from);
                if (!i)
                  return;
                let n;
                if ("pawn" === i.role) {
                  this.halfmoves = 0,
                    t.to === s && (n = this.board.take(t.to + ("white" === e ? -8 : 8)));
                  const r = t.from - t.to;
                  16 === Math.abs(r) && 8 <= t.from && t.from <= 55 && (this.epSquare = t.from + t.to >> 1),
                    t.promotion && (i.role = t.promotion, i.promoted = !!this.pockets)
                } else if ("rook" === i.role)
                  this.castles.discardRook(t.from);
                else if ("king" === i.role) {
                  if (r) {
                    const t = this.castles.rook[e][r];
                    if (c(t)) {
                      const s = this.board.take(t);
                      this.board.set(g(e, r), i),
                        s && this.board.set(v(e, r), s)
                    }
                  }
                  this.castles.discardColor(e)
                }
                if (!r) {
                  const e = this.board.set(t.to, i) || n;
                  e && this.playCaptureAt(t.to, e)
                }
              }
              this.remainingChecks && this.isCheck() && (this.remainingChecks[e] = Math.max(this.remainingChecks[e] - 1, 0))
            }
          }
          class X extends J {
            constructor() {
              super("chess")
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
          }
          const tt = (t, e) => {
            if (!c(e))
              return;
            const s = "white" === t.turn ? 5 : 2,
              r = "white" === t.turn ? 8 : -8;
            if (l(e) !== s)
              return;
            if (t.board.occupied.has(e + r))
              return;
            const i = e - r;
            return t.board.pawn.has(i) && t.board[u(t.turn)].has(i) ? e : void 0
          },
            et = t => {
              if (!c(t.epSquare))
                return;
              const e = t.ctx(),
                s = t.board.pieces(t.turn, "pawn").intersect(P(u(t.turn), t.epSquare));
              for (const r of s)
                if (t.dests(r, e).has(t.epSquare))
                  return t.epSquare
            },
            st = (t, e, s) => {
              if (!c(t.epSquare))
                return !1;
              if (!P(t.turn, e).has(t.epSquare))
                return !1;
              if (!c(s.king))
                return !0;
              const r = t.epSquare + ("white" === t.turn ? -8 : 8),
                i = t.board.occupied.toggle(e).toggle(t.epSquare).toggle(r);
              return !t.kingAttackers(s.king, u(t.turn), i).intersects(i)
            },
            rt = (t, e, s) => {
              if (!c(s.king) || s.checkers.nonEmpty())
                return S.empty();
              const r = t.castles.rook[t.turn][e];
              if (!c(r))
                return S.empty();
              if (t.castles.path[t.turn][e].intersects(t.board.occupied))
                return S.empty();
              const i = g(t.turn, e),
                n = j(s.king, i),
                o = t.board.occupied.without(s.king);
              for (const e of n)
                if (t.kingAttackers(e, u(t.turn), o).nonEmpty())
                  return S.empty();
              const a = v(t.turn, e),
                h = t.board.occupied.toggle(s.king).toggle(r).toggle(a);
              return t.kingAttackers(i, u(t.turn), h).nonEmpty() ? S.empty() : S.fromSquare(r)
            },
            it = (t, e, s) => {
              if (s.variantEnd)
                return S.empty();
              const r = t.board.get(e);
              if (!r || r.color !== t.turn)
                return S.empty();
              let i = D(r, e, t.board.occupied);
              if ("pawn" === r.role) {
                let s = t.board[u(t.turn)];
                c(t.epSquare) && (s = s.with(t.epSquare)),
                  i = i.intersect(s);
                const r = "white" === t.turn ? 8 : -8,
                  n = e + r;
                if (0 <= n && n < 64 && !t.board.occupied.has(n)) {
                  i = i.with(n);
                  const s = n + r;
                  ("white" === t.turn ? e < 16 : e >= 48) && !t.board.occupied.has(s) && (i = i.with(s))
                }
                return i
              }
              return i = i.diff(t.board[t.turn]),
                e === s.king ? i.union(rt(t, "a", s)).union(rt(t, "h", s)) : i
            },
            nt = (t, e) => {
              if (o(e))
                return;
              const s = e.to - e.from;
              return (2 === Math.abs(s) || t.board[t.turn].has(e.to)) && t.board.king.has(e.from) ? s > 0 ? "h" : "a" : void 0
            },
            ot = (t, e) => {
              const s = nt(t, e);
              if (!s)
                return e;
              const r = t.castles.rook[t.turn][s];
              return {
                from: e.from,
                to: c(r) ? r : e.to
              }
            },
            at = (t, e) => {
              const s = Math.max(t.pieces(e, "queen").size() - 1, 0) + Math.max(t.pieces(e, "rook").size() - 2, 0) + Math.max(t.pieces(e, "knight").size() - 2, 0) + Math.max(t.pieces(e, "bishop").intersect(S.lightSquares()).size() - 1, 0) + Math.max(t.pieces(e, "bishop").intersect(S.darkSquares()).size() - 1, 0);
              return t.pieces(e, "pawn").size() + s <= 8
            };
          var ht = Object.freeze({
            __proto__: null,
            chessgroundDests: (t, e) => {
              const s = new Map,
                r = t.ctx();
              for (const [i, n] of t.allDests(r))
                if (n.nonEmpty()) {
                  const t = Array.from(n, k);
                  (null == e ? void 0 : e.chess960) || i !== r.king || 4 !== d(i) || (n.has(0) ? t.push("c1") : n.has(56) && t.push("c8"), n.has(7) ? t.push("g1") : n.has(63) && t.push("g8")),
                    s.set(k(i), t)
                }
              return s
            },
            chessgroundMove: t => o(t) ? [k(t.to)] : [k(t.from), k(t.to)],
            scalachessCharPair: t => o(t) ? String.fromCharCode(35 + t.to, 139 + ["queen", "rook", "bishop", "knight", "pawn"].indexOf(t.role)) : String.fromCharCode(35 + t.from, t.promotion ? 99 + 8 * ["queen", "rook", "bishop", "knight", "king"].indexOf(t.promotion) + d(t.to) : 35 + t.to),
            lichessRules: t => {
              switch (t) {
                case "standard":
                case "chess960":
                case "fromPosition":
                  return "chess";
                case "threeCheck":
                  return "3check";
                case "kingOfTheHill":
                  return "kingofthehill";
                case "racingKings":
                  return "racingkings";
                default:
                  return t
              }
            },
            lichessVariant: t => {
              switch (t) {
                case "chess":
                  return "standard";
                case "3check":
                  return "threeCheck";
                case "kingofthehill":
                  return "kingOfTheHill";
                case "racingkings":
                  return "racingKings";
                default:
                  return t
              }
            }
          });
          const ct = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR",
            ut = ct + " w KQkq -",
            lt = ut + " 0 1",
            dt = "8/8/8/8/8/8/8/8",
            pt = dt + " w - -",
            ft = pt + " 0 1";
          var mt;
          !function (t) {
            t.Fen = "ERR_FEN",
              t.Board = "ERR_BOARD",
              t.Pockets = "ERR_POCKETS",
              t.Turn = "ERR_TURN",
              t.Castling = "ERR_CASTLING",
              t.EpSquare = "ERR_EP_SQUARE",
              t.RemainingChecks = "ERR_REMAINING_CHECKS",
              t.Halfmoves = "ERR_HALFMOVES",
              t.Fullmoves = "ERR_FULLMOVES"
          }
            (mt || (mt = {}));
          class kt extends Error { }
          const wt = t => /^\d{1,4}$/.test(t) ? parseInt(t, 10) : void 0,
            bt = t => {
              const e = f(t);
              return e && {
                role: e,
                color: t.toLowerCase() === t ? "black" : "white"
              }
            },
            gt = e => {
              const s = T.empty();
              let r = 7,
                i = 0;
              for (let n = 0; n < e.length; n++) {
                const o = e[n];
                if ("/" === o && 8 === i)
                  i = 0, r--;
                else {
                  const a = parseInt(o, 10);
                  if (a > 0)
                    i += a;
                  else {
                    if (i >= 8 || r < 0)
                      return t.err(new kt(mt.Board));
                    const a = i + 8 * r,
                      h = bt(o);
                    if (!h)
                      return t.err(new kt(mt.Board));
                    "~" === e[n + 1] && (h.promoted = !0, n++),
                      s.set(a, h),
                      i++
                  }
                }
              }
              return 0 !== r || 8 !== i ? t.err(new kt(mt.Board)) : t.ok(s)
            },
            vt = e => {
              if (e.length > 64)
                return t.err(new kt(mt.Pockets));
              const s = Q.empty();
              for (const r of e) {
                const e = bt(r);
                if (!e)
                  return t.err(new kt(mt.Pockets));
                s[e.color][e.role]++
              }
              return t.ok(s)
            },
            yt = (e, s) => {
              let i = S.empty();
              if ("-" === s)
                return t.ok(i);
              for (const r of s) {
                const s = r.toLowerCase(),
                  n = r === s ? "black" : "white",
                  o = S.backrank(n).intersect(e[n]);
                let a;
                if ("q" === s)
                  a = o;
                else if ("k" === s)
                  a = o.reversed();
                else {
                  if (!("a" <= s && s <= "h"))
                    return t.err(new kt(mt.Castling));
                  a = S.fromFile(s.charCodeAt(0) - "a".charCodeAt(0)).intersect(o)
                }
                for (const t of a) {
                  if (e.king.has(t))
                    break;
                  if (e.rook.has(t)) {
                    i = i.with(t);
                    break
                  }
                }
              }
              return r.some((t => S.backrank(t).intersect(i).size() > 2)) ? t.err(new kt(mt.Castling)) : t.ok(i)
            },
            Et = e => {
              const s = e.split("+");
              if (3 === s.length && "" === s[0]) {
                const e = wt(s[1]),
                  r = wt(s[2]);
                return !c(e) || e > 3 || !c(r) || r > 3 ? t.err(new kt(mt.RemainingChecks)) : t.ok(new H(3 - e, 3 - r))
              }
              if (2 === s.length) {
                const e = wt(s[0]),
                  r = wt(s[1]);
                return !c(e) || e > 3 || !c(r) || r > 3 ? t.err(new kt(mt.RemainingChecks)) : t.ok(new H(e, r))
              }
              return t.err(new kt(mt.RemainingChecks))
            },
            Ct = e => {
              const s = e.split(/[\s_]+/),
                r = s.shift();
              let i,
                n,
                o = t.ok(void 0);
              if (r.endsWith("]")) {
                const e = r.indexOf("[");
                if (-1 === e)
                  return t.err(new kt(mt.Fen));
                i = gt(r.slice(0, e)),
                  o = vt(r.slice(e + 1, -1))
              } else {
                const t = ((t, e, s) => {
                  let r = t.indexOf(e);
                  for (; s-- > 0 && -1 !== r;)
                    r = t.indexOf(e, r + e.length);
                  return r
                })(r, "/", 7);
                -1 === t ? i = gt(r) : (i = gt(r.slice(0, t)), o = vt(r.slice(t + 1)))
              }
              const a = s.shift();
              if (c(a) && "w" !== a) {
                if ("b" !== a)
                  return t.err(new kt(mt.Turn));
                n = "black"
              } else
                n = "white";
              return i.chain((e => {
                const r = s.shift(),
                  i = c(r) ? yt(e, r) : t.ok(S.empty()),
                  a = s.shift();
                let h;
                if (c(a) && "-" !== a && (h = m(a), !c(h)))
                  return t.err(new kt(mt.EpSquare));
                let u,
                  l = s.shift();
                c(l) && l.includes("+") && (u = Et(l), l = s.shift());
                const d = c(l) ? wt(l) : 0;
                if (!c(d))
                  return t.err(new kt(mt.Halfmoves));
                const p = s.shift(),
                  f = c(p) ? wt(p) : 1;
                if (!c(f))
                  return t.err(new kt(mt.Fullmoves));
                const k = s.shift();
                let w = t.ok(void 0);
                if (c(k)) {
                  if (c(u))
                    return t.err(new kt(mt.RemainingChecks));
                  w = Et(k)
                } else
                  c(u) && (w = u);
                return s.length > 0 ? t.err(new kt(mt.Fen)) : o.chain((t => i.chain((s => w.map((r => ({
                  board: e,
                  pockets: t,
                  turn: n,
                  unmovedRooks: s,
                  remainingChecks: r,
                  epSquare: h,
                  halfmoves: d,
                  fullmoves: Math.max(1, f)
                })))))))
              }))
            },
            St = t => {
              let e = p(t.role);
              return "white" === t.color && (e = e.toUpperCase()),
                t.promoted && (e += "~"),
                e
            },
            qt = t => {
              let e = "",
                s = 0;
              for (let r = 7; r >= 0; r--)
                for (let i = 0; i < 8; i++) {
                  const n = i + 8 * r,
                    o = t.get(n);
                  o ? (s > 0 && (e += s, s = 0), e += St(o)) : s++,
                    7 === i && (s > 0 && (e += s, s = 0), 0 !== r && (e += "/"))
                }
              return e
            },
            Rt = t => i.map((e => p(e).repeat(t[e]))).join(""),
            Ot = t => Rt(t.white).toUpperCase() + Rt(t.black),
            xt = (t, s) => {
              let i = "";
              for (const n of r) {
                const r = S.backrank(n);
                let o = t.kingOf(n);
                c(o) && !r.has(o) && (o = void 0);
                const a = t.pieces(n, "rook").intersect(r);
                for (const t of s.intersect(a).reversed())
                  if (t === a.first() && c(o) && t < o)
                    i += "white" === n ? "Q" : "q";
                  else if (t === a.last() && c(o) && o < t)
                    i += "white" === n ? "K" : "k";
                  else {
                    const s = e[d(t)];
                    i += "white" === n ? s.toUpperCase() : s
                  }
              }
              return i || "-"
            },
            zt = t => `${t.white}+${t.black}`,
            At = (t, e) => [qt(t.board) + (t.pockets ? `[${Ot(t.pockets)}]` : ""), t.turn[0], xt(t.board, t.unmovedRooks), c(t.epSquare) ? k(t.epSquare) : "-", ...t.remainingChecks ? [zt(t.remainingChecks)] : [], ...(null == e ? void 0 : e.epd) ? [] : [Math.max(0, Math.min(t.halfmoves, 9999)), Math.max(1, Math.min(t.fullmoves, 9999))]].join(" ");
          var Mt = Object.freeze({
            __proto__: null,
            INITIAL_BOARD_FEN: ct,
            INITIAL_EPD: ut,
            INITIAL_FEN: lt,
            EMPTY_BOARD_FEN: dt,
            EMPTY_EPD: pt,
            EMPTY_FEN: ft,
            get InvalidFen() {
              return mt
            },
            FenError: kt,
            parseBoardFen: gt,
            parsePockets: vt,
            parseCastlingFen: yt,
            parseRemainingChecks: Et,
            parseFen: Ct,
            parsePiece: t => {
              if (!t)
                return;
              const e = bt(t[0]);
              if (e) {
                if (2 === t.length && "~" === t[1])
                  e.promoted = !0;
                else if (t.length > 1)
                  return;
                return e
              }
            },
            makePiece: St,
            makeBoardFen: qt,
            makePocket: Rt,
            makePockets: Ot,
            makeCastlingFen: xt,
            makeRemainingChecks: zt,
            makeFen: At
          });
          const Pt = t => St(t),
            _t = t => k(t),
            Bt = (t, e, s = !1) => {
              if (e < 1)
                return 1;
              const r = ["queen", "knight", "rook", "bishop"];
              "antichess" === t.rules && r.push("king");
              const n = t.ctx(),
                o = t.dropDests(n);
              if (!s && 1 === e && o.isEmpty()) {
                let e = 0;
                for (const [s, i] of t.allDests(n))
                  if (e += i.size(), t.board.pawn.has(s)) {
                    const s = S.backrank(u(t.turn));
                    e += i.intersect(s).size() * (r.length - 1)
                  }
                return e
              } {
                let a = 0;
                for (const [i, o] of t.allDests(n)) {
                  const n = l(i) === ("white" === t.turn ? 6 : 1) && t.board.pawn.has(i) ? r : [void 0];
                  for (const r of o)
                    for (const o of n) {
                      const n = t.clone(),
                        h = {
                          from: i,
                          to: r,
                          promotion: o
                        };
                      n.play(h);
                      const c = Bt(n, e - 1, !1);
                      s && console.log(b(h), c),
                        a += c
                    }
                }
                if (t.pockets)
                  for (const r of i)
                    if (t.pockets[t.turn][r] > 0)
                      for (const i of "pawn" === r ? o.diff(S.backranks()) : o) {
                        const n = t.clone(),
                          o = {
                            role: r,
                            to: i
                          };
                        n.play(o);
                        const h = Bt(n, e - 1, !1);
                        s && console.log(b(o), h),
                          a += h
                      }
                return a
              }
            };
          var It = Object.freeze({
            __proto__: null,
            squareSet: t => {
              const e = [];
              for (let s = 7; s >= 0; s--)
                for (let r = 0; r < 8; r++) {
                  const i = r + 8 * s;
                  e.push(t.has(i) ? "1" : "."),
                    e.push(r < 7 ? " " : "\n")
                }
              return e.join("")
            },
            piece: Pt,
            board: t => {
              const e = [];
              for (let s = 7; s >= 0; s--)
                for (let r = 0; r < 8; r++) {
                  const i = r + 8 * s,
                    n = t.get(i),
                    o = n ? Pt(n) : ".";
                  e.push(o),
                    e.push(r < 7 ? o.length < 2 ? " " : "" : "\n")
                }
              return e.join("")
            },
            square: _t,
            dests: t => {
              const e = [];
              for (const [s, r] of t)
                e.push(`${k(s)}: ${Array.from(r, _t).join(" ")}`);
              return e.join("\n")
            },
            perft: Bt
          });
          const Nt = (t, r) => {
            let i = "";
            if (o(r))
              "pawn" !== r.role && (i = p(r.role).toUpperCase()), i += "@" + k(r.to);
            else {
              const n = t.board.getRole(r.from);
              if (!n)
                return "--";
              if ("king" !== n || !t.board[t.turn].has(r.to) && 2 !== Math.abs(r.to - r.from)) {
                const o = t.board.occupied.has(r.to) || "pawn" === n && d(r.from) !== d(r.to);
                if ("pawn" !== n) {
                  let o;
                  if (i = p(n).toUpperCase(), o = "king" === n ? A(r.to).intersect(t.board.king) : "queen" === n ? U(r.to, t.board.occupied).intersect(t.board.queen) : "rook" === n ? K(r.to, t.board.occupied).intersect(t.board.rook) : "bishop" === n ? V(r.to, t.board.occupied).intersect(t.board.bishop) : M(r.to).intersect(t.board.knight), o = o.intersect(t.board[t.turn]).without(r.from), o.nonEmpty()) {
                    const n = t.ctx();
                    for (const e of o)
                      t.dests(e, n).has(r.to) || (o = o.without(e));
                    if (o.nonEmpty()) {
                      let t = !1,
                        n = o.intersects(S.fromRank(l(r.from)));
                      o.intersects(S.fromFile(d(r.from))) ? t = !0 : n = !0,
                        n && (i += e[d(r.from)]),
                        t && (i += s[l(r.from)])
                    }
                  }
                } else
                  o && (i = e[d(r.from)]);
                o && (i += "x"),
                  i += k(r.to),
                  r.promotion && (i += "=" + p(r.promotion).toUpperCase())
              } else
                i = r.to > r.from ? "O-O" : "O-O-O"
            }
            return i
          },
            Ft = (t, e) => {
              var s;
              const r = Nt(t, e);
              return t.play(e),
                (null === (s = t.outcome()) || void 0 === s ? void 0 : s.winner) ? r + "#" : t.isCheck() ? r + "+" : r
            };
          var Vt = Object.freeze({
            __proto__: null,
            makeSanAndPlay: Ft,
            makeSanVariation: (t, e) => {
              var s;
              t = t.clone();
              const r = [];
              for (let i = 0; i < e.length; i++) {
                0 !== i && r.push(" "),
                  "white" === t.turn ? r.push(t.fullmoves, ". ") : 0 === i && r.push(t.fullmoves, "... ");
                const n = Nt(t, e[i]);
                if (t.play(e[i]), r.push(n), "--" === n)
                  return r.join("");
                i === e.length - 1 && (null === (s = t.outcome()) || void 0 === s ? void 0 : s.winner) ? r.push("#") : t.isCheck() && r.push("+")
              }
              return r.join("")
            },
            makeSan: (t, e) => Ft(t.clone(), e),
            parseSan: (t, e) => {
              const s = t.ctx(),
                r = e.match(/^([NBRQK])?([a-h])?([1-8])?[-x]?([a-h][1-8])(?:=?([nbrqkNBRQK]))?[+#]?$/);
              if (!r) {
                let r;
                if ("O-O" === e || "O-O+" === e || "O-O#" === e ? r = "h" : "O-O-O" !== e && "O-O-O+" !== e && "O-O-O#" !== e || (r = "a"), r) {
                  const e = t.castles.rook[t.turn][r];
                  if (!c(s.king) || !c(e) || !t.dests(s.king, s).has(e))
                    return;
                  return {
                    from: s.king,
                    to: e
                  }
                }
                const i = e.match(/^([pnbrqkPNBRQK])?@([a-h][1-8])[+#]?$/);
                if (!i)
                  return;
                const n = {
                  role: i[1] ? f(i[1]) : "pawn",
                  to: m(i[2])
                };
                return t.isLegal(n, s) ? n : void 0
              }
              const i = r[1] ? f(r[1]) : "pawn",
                n = m(r[4]),
                o = r[5] ? f(r[5]) : void 0;
              if (!!o !== ("pawn" === i && S.backranks().has(n)))
                return;
              if ("king" === o && "antichess" !== t.rules)
                return;
              let a = t.board.pieces(t.turn, i);
              "pawn" !== i || r[2] ? r[2] && (a = a.intersect(S.fromFile(r[2].charCodeAt(0) - "a".charCodeAt(0)))) : a = a.intersect(S.fromFile(d(n))),
                r[3] && (a = a.intersect(S.fromRank(r[3].charCodeAt(0) - "1".charCodeAt(0))));
              const h = "pawn" === i ? S.fromFile(d(n)) : S.empty();
              let l;
              a = a.intersect(h.union(D({
                color: u(t.turn),
                role: i
              }, n, t.board.occupied)));
              for (const e of a)
                if (t.dests(e, s).has(n)) {
                  if (c(l))
                    return;
                  l = e
                }
              return c(l) ? {
                from: l,
                to: n,
                promotion: o
              }
                : void 0
            }
          });
          const Kt = (t, e) => {
            const s = T.empty();
            s.occupied = e(t.occupied),
              s.promoted = e(t.promoted);
            for (const i of r)
              s[i] = e(t[i]);
            for (const r of i)
              s[r] = e(t[r]);
            return s
          };
          var Ut = Object.freeze({
            __proto__: null,
            flipVertical: t => t.bswap64(),
            flipHorizontal: t => {
              const e = new S(1431655765, 1431655765),
                s = new S(858993459, 858993459),
                r = new S(252645135, 252645135);
              return t = (t = (t = t.shr64(1).intersect(e).union(t.intersect(e).shl64(1))).shr64(2).intersect(s).union(t.intersect(s).shl64(2))).shr64(4).intersect(r).union(t.intersect(r).shl64(4))
            },
            flipDiagonal: t => {
              let e = t.xor(t.shl64(28)).intersect(new S(0, 252645135));
              return t = t.xor(e.xor(e.shr64(28))),
                e = t.xor(t.shl64(14)).intersect(new S(858980352, 858980352)),
                t = t.xor(e.xor(e.shr64(14))),
                e = t.xor(t.shl64(7)).intersect(new S(1426085120, 1426085120)),
                t = t.xor(e.xor(e.shr64(7)))
            },
            rotate180: t => t.rbit64(),
            transformBoard: Kt,
            transformSetup: (t, e) => {
              var s,
                r;
              return {
                board: Kt(t.board, e),
                pockets: null === (s = t.pockets) || void 0 === s ? void 0 : s.clone(),
                turn: t.turn,
                unmovedRooks: e(t.unmovedRooks),
                epSquare: c(t.epSquare) ? e(S.fromSquare(t.epSquare)).first() : void 0,
                remainingChecks: null === (r = t.remainingChecks) || void 0 === r ? void 0 : r.clone(),
                halfmoves: t.halfmoves,
                fullmoves: t.fullmoves
              }
            }
          });
          class Dt extends J {
            constructor() {
              super("crazyhouse")
            }
            reset() {
              super.reset(),
                this.pockets = Q.empty()
            }
            setupUnchecked(t) {
              super.setupUnchecked(t),
                this.board.promoted = t.board.promoted.intersect(t.board.occupied).diff(t.board.king).diff(t.board.pawn),
                this.pockets = t.pockets ? t.pockets.clone() : Q.empty()
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
            validate(e) {
              return super.validate(e).chain((e => {
                var s,
                  r;
                return (null === (s = this.pockets) || void 0 === s ? void 0 : s.count("king")) ? t.err(new W(Y.Kings)) : ((null === (r = this.pockets) || void 0 === r ? void 0 : r.size()) || 0) + this.board.occupied.size() > 64 ? t.err(new W(Y.Variant)) : t.ok(void 0)
              }))
            }
            hasInsufficientMaterial(t) {
              return this.pockets ? this.board.occupied.size() + this.pockets.size() <= 3 && this.board.pawn.isEmpty() && this.board.promoted.isEmpty() && this.board.rooksAndQueens().isEmpty() && this.pockets.count("pawn") <= 0 && this.pockets.count("rook") <= 0 && this.pockets.count("queen") <= 0 : super.hasInsufficientMaterial(t)
            }
            dropDests(t) {
              var e,
                s;
              const r = this.board.occupied.complement().intersect((null === (e = this.pockets) || void 0 === e ? void 0 : e[this.turn].hasNonPawns()) ? S.full() : (null === (s = this.pockets) || void 0 === s ? void 0 : s[this.turn].hasPawns()) ? S.backranks().complement() : S.empty());
              if (t = t || this.ctx(), c(t.king) && t.checkers.nonEmpty()) {
                const e = t.checkers.singleSquare();
                return c(e) ? r.intersect(j(e, t.king)) : S.empty()
              }
              return r
            }
          }
          class $t extends J {
            constructor() {
              super("atomic")
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
            validate(e) {
              if (this.board.occupied.isEmpty())
                return t.err(new W(Y.Empty));
              if (this.board.king.size() > 2)
                return t.err(new W(Y.Kings));
              const s = this.board.kingOf(u(this.turn));
              return c(s) ? this.kingAttackers(s, this.turn, this.board.occupied).nonEmpty() ? t.err(new W(Y.OppositeCheck)) : S.backranks().intersects(this.board.pawn) ? t.err(new W(Y.PawnsOnBackrank)) : (null == e ? void 0 : e.ignoreImpossibleCheck) ? t.ok(void 0) : this.validateCheckers() : t.err(new W(Y.Kings))
            }
            validateCheckers() {
              return c(this.epSquare) ? t.ok(void 0) : super.validateCheckers()
            }
            kingAttackers(t, e, s) {
              const r = this.board.pieces(e, "king");
              return r.isEmpty() || A(t).intersects(r) ? S.empty() : super.kingAttackers(t, e, s)
            }
            playCaptureAt(t, e) {
              super.playCaptureAt(t, e),
                this.board.take(t);
              for (const e of A(t).intersect(this.board.occupied).diff(this.board.pawn)) {
                const t = this.board.take(e);
                "rook" === (null == t ? void 0 : t.role) && this.castles.discardRook(e),
                  "king" === (null == t ? void 0 : t.role) && this.castles.discardColor(t.color)
              }
            }
            hasInsufficientMaterial(t) {
              if (this.board.pieces(u(t), "king").isEmpty())
                return !1;
              if (this.board[t].diff(this.board.king).isEmpty())
                return !0;
              if (this.board[u(t)].diff(this.board.king).nonEmpty()) {
                if (this.board.occupied.equals(this.board.bishop.union(this.board.king))) {
                  if (!this.board.bishop.intersect(this.board.white).intersects(S.darkSquares()))
                    return !this.board.bishop.intersect(this.board.black).intersects(S.lightSquares());
                  if (!this.board.bishop.intersect(this.board.white).intersects(S.lightSquares()))
                    return !this.board.bishop.intersect(this.board.black).intersects(S.darkSquares())
                }
                return !1
              }
              return !this.board.queen.nonEmpty() && !this.board.pawn.nonEmpty() && (1 === this.board.knight.union(this.board.bishop).union(this.board.rook).size() || !!this.board.occupied.equals(this.board.knight.union(this.board.king)) && this.board.knight.size() <= 2)
            }
            dests(t, e) {
              e = e || this.ctx();
              let s = S.empty();
              for (const r of it(this, t, e)) {
                const e = this.clone();
                e.play({
                  from: t,
                  to: r
                });
                const i = e.board.kingOf(this.turn);
                !c(i) || c(e.board.kingOf(e.turn)) && !e.kingAttackers(i, e.turn, e.board.occupied).isEmpty() || (s = s.with(r))
              }
              return s
            }
            isVariantEnd() {
              return !!this.variantOutcome()
            }
            variantOutcome(t) {
              for (const t of r)
                if (this.board.pieces(t, "king").isEmpty())
                  return {
                    winner: u(t)
                  }
            }
          }
          class jt extends J {
            constructor() {
              super("antichess")
            }
            reset() {
              super.reset(),
                this.castles = Z.empty()
            }
            setupUnchecked(t) {
              super.setupUnchecked(t),
                this.castles = Z.empty()
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
            validate(e) {
              return this.board.occupied.isEmpty() ? t.err(new W(Y.Empty)) : S.backranks().intersects(this.board.pawn) ? t.err(new W(Y.PawnsOnBackrank)) : t.ok(void 0)
            }
            kingAttackers(t, e, s) {
              return S.empty()
            }
            ctx() {
              const t = super.ctx();
              if (c(this.epSquare) && P(u(this.turn), this.epSquare).intersects(this.board.pieces(this.turn, "pawn")))
                return t.mustCapture = !0, t;
              const e = this.board[u(this.turn)];
              for (const s of this.board[this.turn])
                if (it(this, s, t).intersects(e))
                  return t.mustCapture = !0, t;
              return t
            }
            dests(t, e) {
              e = e || this.ctx();
              const s = it(this, t, e),
                r = this.board[u(this.turn)];
              return s.intersect(e.mustCapture ? c(this.epSquare) && "pawn" === this.board.getRole(t) ? r.with(this.epSquare) : r : S.full())
            }
            hasInsufficientMaterial(t) {
              if (this.board[t].isEmpty())
                return !1;
              if (this.board[u(t)].isEmpty())
                return !0;
              if (this.board.occupied.equals(this.board.bishop)) {
                const e = this.board[t].intersects(S.lightSquares()),
                  s = this.board[t].intersects(S.darkSquares()),
                  r = this.board[u(t)].isDisjoint(S.lightSquares()),
                  i = this.board[u(t)].isDisjoint(S.darkSquares());
                return e && r || s && i
              }
              return !(!this.board.occupied.equals(this.board.knight) || 2 !== this.board.occupied.size()) && this.board.white.intersects(S.lightSquares()) !== this.board.black.intersects(S.darkSquares()) != (this.turn === t)
            }
            isVariantEnd() {
              return this.board[this.turn].isEmpty()
            }
            variantOutcome(t) {
              if ((t = t || this.ctx()).variantEnd || this.isStalemate(t))
                return {
                  winner: this.turn
                }
            }
          }
          class Tt extends J {
            constructor() {
              super("kingofthehill")
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
            hasInsufficientMaterial(t) {
              return !1
            }
            isVariantEnd() {
              return this.board.king.intersects(S.center())
            }
            variantOutcome(t) {
              for (const t of r)
                if (this.board.pieces(t, "king").intersects(S.center()))
                  return {
                    winner: t
                  }
            }
          }
          class Lt extends J {
            constructor() {
              super("3check")
            }
            reset() {
              super.reset(),
                this.remainingChecks = H.default()
            }
            setupUnchecked(t) {
              var e;
              super.setupUnchecked(t),
                this.remainingChecks = (null === (e = t.remainingChecks) || void 0 === e ? void 0 : e.clone()) || H.default()
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
            hasInsufficientMaterial(t) {
              return this.board.pieces(t, "king").equals(this.board[t])
            }
            isVariantEnd() {
              return !!this.remainingChecks && (this.remainingChecks.white <= 0 || this.remainingChecks.black <= 0)
            }
            variantOutcome(t) {
              if (this.remainingChecks)
                for (const t of r)
                  if (this.remainingChecks[t] <= 0)
                    return {
                      winner: t
                    }
            }
          }
          class Qt extends J {
            constructor() {
              super("racingkings")
            }
            reset() {
              this.board = (() => {
                const t = T.empty();
                return t.occupied = new S(65535, 0),
                  t.promoted = S.empty(),
                  t.white = new S(61680, 0),
                  t.black = new S(3855, 0),
                  t.pawn = S.empty(),
                  t.knight = new S(6168, 0),
                  t.bishop = new S(9252, 0),
                  t.rook = new S(16962, 0),
                  t.queen = new S(129, 0),
                  t.king = new S(33024, 0),
                  t
              })(),
                this.pockets = void 0,
                this.turn = "white",
                this.castles = Z.empty(),
                this.epSquare = void 0,
                this.remainingChecks = void 0,
                this.halfmoves = 0,
                this.fullmoves = 1
            }
            setupUnchecked(t) {
              super.setupUnchecked(t),
                this.castles = Z.empty()
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
            validate(e) {
              return this.isCheck() || this.board.pawn.nonEmpty() ? t.err(new W(Y.Variant)) : super.validate(e)
            }
            dests(t, e) {
              if (t === (e = e || this.ctx()).king)
                return super.dests(t, e);
              let s = S.empty();
              for (const r of super.dests(t, e)) {
                const e = {
                  from: t,
                  to: r
                },
                  i = this.clone();
                i.play(e),
                  i.isCheck() || (s = s.with(r))
              }
              return s
            }
            hasInsufficientMaterial(t) {
              return !1
            }
            isVariantEnd() {
              const t = S.fromRank(7),
                e = this.board.king.intersect(t);
              if (e.isEmpty())
                return !1;
              if ("white" === this.turn || e.intersects(this.board.black))
                return !0;
              const s = this.board.kingOf("black");
              if (c(s)) {
                const e = this.board.occupied.without(s);
                for (const r of A(s).intersect(t).diff(this.board.black))
                  if (this.kingAttackers(r, "white", e).isEmpty())
                    return !1
              }
              return !0
            }
            variantOutcome(t) {
              if (t ? !t.variantEnd : !this.isVariantEnd())
                return;
              const e = S.fromRank(7),
                s = this.board.pieces("black", "king").intersects(e),
                r = this.board.pieces("white", "king").intersects(e);
              return s && !r ? {
                winner: "black"
              }
                : r && !s ? {
                  winner: "white"
                }
                  : {
                    winner: void 0
                  }
            }
          }
          class Ht extends J {
            constructor() {
              super("horde")
            }
            reset() {
              this.board = (() => {
                const t = T.empty();
                return t.occupied = new S(4294967295, 4294901862),
                  t.promoted = S.empty(),
                  t.white = new S(4294967295, 102),
                  t.black = new S(0, 4294901760),
                  t.pawn = new S(4294967295, 16711782),
                  t.knight = new S(0, 1107296256),
                  t.bishop = new S(0, 603979776),
                  t.rook = new S(0, 2164260864),
                  t.queen = new S(0, 134217728),
                  t.king = new S(0, 268435456),
                  t
              })(),
                this.pockets = void 0,
                this.turn = "white",
                this.castles = Z.default(),
                this.castles.discardColor("white"),
                this.epSquare = void 0,
                this.remainingChecks = void 0,
                this.halfmoves = 0,
                this.fullmoves = 1
            }
            static default() {
              const t = new this;
              return t.reset(),
                t
            }
            static fromSetup(t, e) {
              const s = new this;
              return s.setupUnchecked(t),
                s.validate(e).map((t => s))
            }
            clone() {
              return super.clone()
            }
            validate(e) {
              if (this.board.occupied.isEmpty())
                return t.err(new W(Y.Empty));
              if (1 !== this.board.king.size())
                return t.err(new W(Y.Kings));
              const s = this.board.kingOf(u(this.turn));
              if (c(s) && this.kingAttackers(s, this.turn, this.board.occupied).nonEmpty())
                return t.err(new W(Y.OppositeCheck));
              for (const e of r) {
                const s = this.board.pieces(e, "king").isEmpty() ? S.backrank(u(e)) : S.backranks();
                if (this.board.pieces(e, "pawn").intersects(s))
                  return t.err(new W(Y.PawnsOnBackrank))
              }
              return (null == e ? void 0 : e.ignoreImpossibleCheck) ? t.ok(void 0) : this.validateCheckers()
            }
            hasInsufficientMaterial(t) {
              return !1
            }
            isVariantEnd() {
              return this.board.white.isEmpty() || this.board.black.isEmpty()
            }
            variantOutcome(t) {
              return this.board.white.isEmpty() ? {
                winner: "black"
              }
                : this.board.black.isEmpty() ? {
                  winner: "white"
                }
                  : void 0
            }
          }
          const Gt = t => {
            switch (t) {
              case "chess":
                return X.default();
              case "antichess":
                return jt.default();
              case "atomic":
                return $t.default();
              case "horde":
                return Ht.default();
              case "racingkings":
                return Qt.default();
              case "kingofthehill":
                return Tt.default();
              case "3check":
                return Lt.default();
              case "crazyhouse":
                return Dt.default()
            }
          },
            Yt = (t, e, s) => {
              switch (t) {
                case "chess":
                  return X.fromSetup(e, s);
                case "antichess":
                  return jt.fromSetup(e, s);
                case "atomic":
                  return $t.fromSetup(e, s);
                case "horde":
                  return Ht.fromSetup(e, s);
                case "racingkings":
                  return Qt.fromSetup(e, s);
                case "kingofthehill":
                  return Tt.fromSetup(e, s);
                case "3check":
                  return Lt.fromSetup(e, s);
                case "crazyhouse":
                  return Dt.fromSetup(e, s)
              }
            };
          var Wt = Object.freeze({
            __proto__: null,
            Position: J,
            PositionError: W,
            get IllegalSetup() {
              return Y
            },
            Chess: X,
            Castles: Z,
            equalsIgnoreMoves: (t, e) => {
              var s,
                r;
              return t.rules === e.rules && ((t, e) => t.white.equals(e.white) && t.promoted.equals(e.promoted) && i.every((s => t[s].equals(e[s]))))(t.board, e.board) && (e.pockets && (null === (s = t.pockets) || void 0 === s ? void 0 : s.equals(e.pockets)) || !t.pockets && !e.pockets) && t.turn === e.turn && t.castles.unmovedRooks.equals(e.castles.unmovedRooks) && et(t) === et(e) && (e.remainingChecks && (null === (r = t.remainingChecks) || void 0 === r ? void 0 : r.equals(e.remainingChecks)) || !t.remainingChecks && !e.remainingChecks)
            },
            castlingSide: nt,
            normalizeMove: ot,
            Crazyhouse: Dt,
            Atomic: $t,
            Antichess: jt,
            KingOfTheHill: Tt,
            ThreeCheck: Lt,
            RacingKings: Qt,
            Horde: Ht,
            defaultPosition: Gt,
            setupPosition: Yt,
            isStandardMaterial: t => {
              var e,
                s,
                i,
                n,
                o;
              switch (t.rules) {
                case "chess":
                case "antichess":
                case "atomic":
                case "kingofthehill":
                case "3check":
                  return r.every((e => at(t.board, e)));
                case "crazyhouse": {
                  const r = t.board.promoted;
                  return r.size() + t.board.pawn.size() + ((null === (e = t.pockets) || void 0 === e ? void 0 : e.count("pawn")) || 0) <= 16 && t.board.knight.diff(r).size() + ((null === (s = t.pockets) || void 0 === s ? void 0 : s.count("knight")) || 0) <= 4 && t.board.bishop.diff(r).size() + ((null === (i = t.pockets) || void 0 === i ? void 0 : i.count("bishop")) || 0) <= 4 && t.board.rook.diff(r).size() + ((null === (n = t.pockets) || void 0 === n ? void 0 : n.count("rook")) || 0) <= 4 && t.board.queen.diff(r).size() + ((null === (o = t.pockets) || void 0 === o ? void 0 : o.count("queen")) || 0) <= 2
                }
                case "horde":
                  return r.every((e => t.board.pieces(e, "king").nonEmpty() ? at(t.board, e) : t.board[e].size() <= 36));
                case "racingkings":
                  return r.every((e => t.board.pieces(e, "knight").size() <= 2 && t.board.pieces(e, "bishop").size() <= 2 && t.board.pieces(e, "rook").size() <= 2 && t.board.pieces(e, "queen").size() <= 1))
              }
            }
          });
          const Zt = (t = ne) => ({
            headers: t(),
            moves: new Jt
          });
          class Jt {
            constructor() {
              this.children = []
            }
            * mainline() {
              let t = this;
              for (; t.children.length;) {
                const e = t.children[0];
                yield e.data,
                  t = e
              }
            }
          }
          class Xt extends Jt {
            constructor(t) {
              super(),
                this.data = t
            }
          }
          class te {
            constructor(t) {
              this.value = t
            }
            clone() {
              return new te(this.value)
            }
          }
          const ee = t => t ? "white" === t.winner ? "1-0" : "black" === t.winner ? "0-1" : "1/2-1/2" : "*",
            se = t => "1-0" === t ? {
              winner: "white"
            }
              : "0-1" === t ? {
                winner: "black"
              }
                : "1/2-1/2" === t ? {
                  winner: void 0
                }
                  : void 0,
            re = t => t.replace(/\\/g, "\\\\").replace(/"/g, '\\"'),
            ie = t => t.replace(/\}/g, ""),
            ne = () => new Map([["Event", "?"], ["Site", "?"], ["Date", "????.??.??"], ["Round", "?"], ["White", "?"], ["Black", "?"], ["Result", "*"]]),
            oe = t => /^\s*$/.test(t),
            ae = t => t.startsWith("%");
          class he extends Error { }
          class ce {
            constructor(t, e = ne, s = 1e6) {
              this.emitGame = t,
                this.initHeaders = e,
                this.maxBudget = s,
                this.lineBuf = [],
                this.resetGame(),
                this.state = 0
            }
            resetGame() {
              this.budget = this.maxBudget,
                this.found = !1,
                this.state = 1,
                this.game = Zt(this.initHeaders),
                this.stack = [{
                  parent: this.game.moves,
                  root: !0
                }
                ],
                this.commentBuf = []
            }
            consumeBudget(t) {
              if (this.budget -= t, this.budget < 0)
                throw new he("ERR_PGN_BUDGET")
            }
            parse(t, e) {
              if (!(this.budget < 0))
                try {
                  let s = 0;
                  for (; ;) {
                    const e = t.indexOf("\n", s);
                    if (-1 === e)
                      break;
                    const r = e > s && "\r" === t[e - 1] ? e - 1 : e;
                    this.consumeBudget(e - s),
                      this.lineBuf.push(t.slice(s, r)),
                      s = e + 1,
                      this.handleLine()
                  }
                  this.consumeBudget(t.length - s),
                    this.lineBuf.push(t.slice(s)),
                    (null == e ? void 0 : e.stream) || (this.handleLine(), this.emit(void 0))
                } catch (t) {
                  this.emit(t)
                }
            }
            handleLine() {
              let t = !0,
                e = this.lineBuf.join("");
              this.lineBuf = [];
              t: for (; ;)
                switch (this.state) {
                  case 0:
                    e.startsWith("\ufeff") && (e = e.slice(1)),
                      this.state = 1;
                  case 1:
                    if (oe(e) || ae(e))
                      return;
                    this.found = !0,
                      this.state = 2;
                  case 2: {
                    if (ae(e))
                      return;
                    let s = !0;
                    for (; s;)
                      s = !1, e = e.replace(/^\s*\[([A-Za-z0-9][A-Za-z0-9_+#=:-]*)\s+"((?:[^"\\]|\\"|\\\\)*)"\]/, ((e, r, i) => (this.consumeBudget(200), this.game.headers.set(r, i.replace(/\\"/g, '"').replace(/\\\\/g, "\\")), s = !0, t = !1, "")));
                    if (oe(e))
                      return;
                    this.state = 3
                  }
                  case 3: {
                    if (t) {
                      if (ae(e))
                        return;
                      if (oe(e))
                        return this.emit(void 0)
                    }
                    const s = /(?:[NBKRQ]?[a-h]?[1-8]?[-x]?[a-h][1-8](?:=?[nbrqkNBRQK])?|[pnbrqkPNBRQK]?@[a-h][1-8]|O-O-O|0-0-0|O-O|0-0)[+#]?|--|Z0|0000|@@@@|{|;|\$\d{1,4}|[?!]{1,2}|\(|\)|\*|1-0|0-1|1\/2-1\/2/g;
                    let r;
                    for (; r = s.exec(e);) {
                      const t = this.stack[this.stack.length - 1];
                      let i = r[0];
                      if (";" === i)
                        return;
                      if (i.startsWith("$"))
                        this.handleNag(parseInt(i.slice(1), 10));
                      else if ("!" === i)
                        this.handleNag(1);
                      else if ("?" === i)
                        this.handleNag(2);
                      else if ("!!" === i)
                        this.handleNag(3);
                      else if ("??" === i)
                        this.handleNag(4);
                      else if ("!?" === i)
                        this.handleNag(5);
                      else if ("?!" === i)
                        this.handleNag(6);
                      else if ("1-0" === i || "0-1" === i || "1/2-1/2" === i || "*" === i)
                        1 === this.stack.length && "*" !== i && this.game.headers.set("Result", i);
                      else if ("(" === i)
                        this.consumeBudget(100), this.stack.push({
                          parent: t.parent,
                          root: !1
                        });
                      else if (")" === i)
                        this.stack.length > 1 && this.stack.pop();
                      else {
                        if ("{" === i) {
                          const t = s.lastIndex,
                            r = " " === e[t] ? t + 1 : t;
                          e = e.slice(r),
                            this.state = 4;
                          continue t
                        }
                        this.consumeBudget(100),
                          "Z0" === i || "0000" === i || "@@@@" === i ? i = "--" : i.startsWith("0") && (i = i.replace(/0/g, "O")),
                          t.node && (t.parent = t.node),
                          t.node = new Xt({
                            san: i,
                            startingComments: t.startingComments
                          }),
                          t.startingComments = void 0,
                          t.root = !1,
                          t.parent.children.push(t.node)
                      }
                    }
                    return
                  }
                  case 4: {
                    const s = e.indexOf("}");
                    if (-1 === s)
                      return void this.commentBuf.push(e); {
                      const r = s > 0 && " " === e[s - 1] ? s - 1 : s;
                      this.commentBuf.push(e.slice(0, r)),
                        this.handleComment(),
                        e = e.slice(s),
                        this.state = 3,
                        t = !1
                    }
                  }
                }
            }
            handleNag(t) {
              var e;
              this.consumeBudget(50);
              const s = this.stack[this.stack.length - 1];
              s.node && ((e = s.node.data).nags || (e.nags = []), s.node.data.nags.push(t))
            }
            handleComment() {
              var t,
                e;
              this.consumeBudget(100);
              const s = this.stack[this.stack.length - 1],
                r = this.commentBuf.join("\n");
              this.commentBuf = [],
                s.node ? ((t = s.node.data).comments || (t.comments = []), s.node.data.comments.push(r)) : s.root ? ((e = this.game).comments || (e.comments = []), this.game.comments.push(r)) : (s.startingComments || (s.startingComments = []), s.startingComments.push(r))
            }
            emit(t) {
              if (4 === this.state && this.handleComment(), t)
                return this.emitGame(this.game, t);
              this.found && this.emitGame(this.game, void 0),
                this.resetGame()
            }
          }
          const ue = t => {
            switch ((t || "chess").toLowerCase()) {
              case "chess":
              case "chess960":
              case "chess 960":
              case "standard":
              case "from position":
              case "classical":
              case "normal":
              case "fischerandom":
              case "fischerrandom":
              case "fischer random":
              case "wild/0":
              case "wild/1":
              case "wild/2":
              case "wild/3":
              case "wild/4":
              case "wild/5":
              case "wild/6":
              case "wild/7":
              case "wild/8":
              case "wild/8a":
                return "chess";
              case "crazyhouse":
              case "crazy house":
              case "house":
              case "zh":
                return "crazyhouse";
              case "king of the hill":
              case "koth":
              case "kingofthehill":
                return "kingofthehill";
              case "three-check":
              case "three check":
              case "threecheck":
              case "three check chess":
              case "3-check":
              case "3 check":
              case "3check":
                return "3check";
              case "antichess":
              case "anti chess":
              case "anti":
                return "antichess";
              case "atomic":
              case "atom":
              case "atomic chess":
                return "atomic";
              case "horde":
              case "horde chess":
                return "horde";
              case "racing kings":
              case "racingkings":
              case "racing":
              case "race":
                return "racingkings";
              default:
                return
            }
          },
            le = t => {
              switch (t) {
                case "chess":
                  return;
                case "crazyhouse":
                  return "Crazyhouse";
                case "racingkings":
                  return "Racing Kings";
                case "horde":
                  return "Horde";
                case "atomic":
                  return "Atomic";
                case "antichess":
                  return "Antichess";
                case "3check":
                  return "Three-check";
                case "kingofthehill":
                  return "King of the Hill"
              }
            },
            de = t => "mate" in t,
            pe = t => {
              t = Math.max(0, t);
              const e = Math.floor(t / 3600),
                s = Math.floor(t % 3600 / 60);
              return t = t % 3600 % 60,
                `${e}:${s.toString().padStart(2, "0")}:${t.toLocaleString("en", { minimumIntegerDigits: 2, maximumFractionDigits: 3 })}`
            },
            fe = t => {
              switch (t) {
                case "green":
                  return "G";
                case "red":
                  return "R";
                case "yellow":
                  return "Y";
                case "blue":
                  return "B"
              }
            };
          const me = t => t.to === t.from ? `${fe(t.color)}${k(t.to)}` : `${fe(t.color)}${k(t.from)}${k(t.to)}`,
            ke = t => {
              const e = function (t) {
                switch (t) {
                  case "G":
                    return "green";
                  case "R":
                    return "red";
                  case "Y":
                    return "yellow";
                  case "B":
                    return "blue";
                  default:
                    return
                }
              }
                (t.slice(0, 1)),
                s = m(t.slice(1, 3)),
                r = m(t.slice(3, 5));
              if (e && c(s))
                return 3 === t.length ? {
                  color: e,
                  from: s,
                  to: s
                }
                  : 5 === t.length && c(r) ? {
                    color: e,
                    from: s,
                    to: r
                  }
                    : void 0
            };
          var we = Object.freeze({
            __proto__: null,
            defaultGame: Zt,
            Node: Jt,
            ChildNode: Xt,
            isChildNode: t => t instanceof Xt,
            Box: te,
            transform: (t, e, s) => {
              const r = new Jt,
                i = [{
                  before: t,
                  after: r,
                  ctx: e
                }
                ];
              let n;
              for (; n = i.pop();)
                for (let t = 0; t < n.before.children.length; t++) {
                  const e = t < n.before.children.length - 1 ? n.ctx.clone() : n.ctx,
                    r = n.before.children[t],
                    o = s(e, r.data, t);
                  if (c(o)) {
                    const t = new Xt(o);
                    n.after.children.push(t),
                      i.push({
                        before: r,
                        after: t,
                        ctx: e
                      })
                  }
                }
              return r
            },
            walk: (t, e, s) => {
              const r = [{
                node: t,
                ctx: e
              }
              ];
              let i;
              for (; i = r.pop();)
                for (let t = 0; t < i.node.children.length; t++) {
                  const e = t < i.node.children.length - 1 ? i.ctx.clone() : i.ctx,
                    n = i.node.children[t];
                  !1 !== s(e, n.data, t) && r.push({
                    node: n,
                    ctx: e
                  })
                }
            },
            makeOutcome: ee,
            parseOutcome: se,
            makePgn: t => {
              const e = [],
                s = [];
              if (t.headers.size) {
                for (const [s, r] of t.headers.entries())
                  e.push("[", s, ' "', re(r), '"]\n');
                e.push("\n")
              }
              for (const e of t.comments || [])
                s.push("{", ie(e), "}");
              const r = t.headers.get("FEN"),
                i = r ? Ct(r).unwrap((t => 2 * (t.fullmoves - 1) + ("white" === t.turn ? 0 : 1)), (t => 0)) : 0,
                n = [];
              if (t.moves.children.length) {
                const e = t.moves.children[Symbol.iterator]();
                n.push({
                  state: 0,
                  ply: i,
                  node: e.next().value,
                  sidelines: e,
                  startsVariation: !1,
                  inVariation: !1
                })
              }
              let o = !0;
              for (; n.length;) {
                const t = n[n.length - 1];
                switch (t.inVariation && (s.push(")"), t.inVariation = !1, o = !0), t.state) {
                  case 0:
                    for (const e of t.node.data.startingComments || [])
                      s.push("{", ie(e), "}"), o = !0;
                    (o || t.ply % 2 == 0) && (s.push(Math.floor(t.ply / 2) + 1 + (t.ply % 2 ? "..." : ".")), o = !1),
                      s.push(t.node.data.san);
                    for (const e of t.node.data.nags || [])
                      s.push("$" + e), o = !0;
                    for (const e of t.node.data.comments || [])
                      s.push("{", ie(e), "}");
                    t.state = 1;
                  case 1: {
                    const e = t.sidelines.next();
                    if (e.done) {
                      if (t.node.children.length) {
                        const e = t.node.children[Symbol.iterator]();
                        n.push({
                          state: 0,
                          ply: t.ply + 1,
                          node: e.next().value,
                          sidelines: e,
                          startsVariation: !1,
                          inVariation: !1
                        })
                      }
                      t.state = 2
                    } else
                      s.push("("), o = !0, n.push({
                        state: 0,
                        ply: t.ply,
                        node: e.value,
                        sidelines: [][Symbol.iterator](),
                        startsVariation: !0,
                        inVariation: !1
                      }), t.inVariation = !0;
                    break
                  }
                  case 2:
                    n.pop()
                }
              }
              return s.push(ee(se(t.headers.get("Result")))),
                e.push(s.join(" "), "\n"),
                e.join("")
            },
            defaultHeaders: ne,
            emptyHeaders: () => new Map,
            PgnError: he,
            PgnParser: ce,
            parsePgn: (t, e = ne) => {
              const s = [];
              return new ce((t => s.push(t)), e, NaN).parse(t),
                s
            },
            parseVariant: ue,
            makeVariant: le,
            startingPosition: (e, s) => {
              const r = ue(e.get("Variant"));
              if (!r)
                return t.err(new W(Y.Variant));
              const i = e.get("FEN");
              return i ? Ct(i).chain((t => Yt(r, t, s))) : t.ok(Gt(r))
            },
            setStartingPosition: (t, e) => {
              const s = le(e.rules);
              s ? t.set("Variant", s) : t.delete("Variant");
              const r = At(e.toSetup());
              r !== At(Gt(e.rules).toSetup()) ? t.set("FEN", r) : t.delete("FEN")
            },
            isPawns: t => "pawns" in t,
            isMate: de,
            makeComment: t => {
              const e = [];
              c(t.text) && e.push(t.text);
              const s = (t.shapes || []).filter((t => t.to === t.from)).map(me);
              s.length && e.push(`[%csl ${s.join(",")}]`);
              const r = (t.shapes || []).filter((t => t.to !== t.from)).map(me);
              return r.length && e.push(`[%cal ${r.join(",")}]`),
                t.evaluation && e.push(`[%eval ${(t => { const e = de(t) ? "#" + t.mate : t.pawns.toFixed(2); return c(t.depth) ? e + "," + t.depth : e })(t.evaluation)}]`),
                c(t.emt) && e.push(`[%emt ${pe(t.emt)}]`),
                c(t.clock) && e.push(`[%clk ${pe(t.clock)}]`),
                e.join(" ")
            },
            parseComment: t => {
              let e,
                s,
                r;
              const i = [];
              return {
                text: t.replace(/\s?\[%(emt|clk)\s(\d{1,5}):(\d{1,2}):(\d{1,2}(?:\.\d{0,3})?)\]\s?/g, ((t, r, i, n, o) => {
                  const a = 3600 * parseInt(i, 10) + 60 * parseInt(n, 10) + parseFloat(o);
                  return "emt" === r ? e = a : "clk" === r && (s = a),
                    "  "
                })).replace(/\s?\[%(?:csl|cal)\s([RGYB][a-h][1-8](?:[a-h][1-8])?(?:,[RGYB][a-h][1-8](?:[a-h][1-8])?)*)\]\s?/g, ((t, e) => {
                  for (const t of e.split(","))
                    i.push(ke(t));
                  return "  "
                })).replace(/\s?\[%eval\s(?:#([+-]?\d{1,5})|([+-]?(?:\d{1,5}|\d{0,5}\.\d{1,2})))(?:,(\d{1,5}))?\]\s?/g, ((t, e, s, i) => {
                  const n = i && parseInt(i, 10);
                  return r = e ? {
                    mate: parseInt(e, 10),
                    depth: n
                  }
                    : {
                      pawns: parseFloat(s),
                      depth: n
                    },
                    "  "
                })).trim(),
                shapes: i,
                emt: e,
                clock: s,
                evaluation: r
              }
            }
          });
          chessops.Board = T;
          chessops.CASTLING_SIDES = n;
          chessops.COLORS = r;
          chessops.Castles = Z;
          chessops.Chess = X;
          chessops.FILE_NAMES = e;
          chessops.IllegalSetup = Y;
          chessops.Material = Q;
          chessops.MaterialSide = L;
          chessops.Position = J;
          chessops.PositionError = W;
          chessops.RANK_NAMES = s;
          chessops.ROLES = i;
          chessops.RULES = h;
          chessops.RemainingChecks = H;
          chessops.SquareSet = S;
          chessops.attacks = D;
          chessops.between = j;
          chessops.bishopAttacks = V;
          chessops.charToRole = f;
          chessops.compat = ht;
          chessops.debug = It;
          chessops.defaultSetup = G;
          chessops.defined = c;
          chessops.fen = Mt;
          chessops.isDrop = o;
          chessops.isNormal = a;
          chessops.kingAttacks = A;
          chessops.kingCastlesTo = g;
          chessops.knightAttacks = M;
          chessops.makeSquare = k;
          chessops.makeUci = b;
          chessops.opposite = u;
          chessops.parseSquare = m;
          chessops.parseUci = w;
          chessops.pawnAttacks = P;
          chessops.pgn = we;
          chessops.queenAttacks = U;
          chessops.ray = $;
          chessops.roleToChar = p;
          chessops.rookAttacks = K;
          chessops.san = Vt;
          chessops.squareFile = d;
          chessops.squareRank = l;
          chessops.transform = Ut;
          chessops.variant = Wt;
        })();

        return chessops;

      })();
    }

  }
  LiChessTools.Tools.ChessOps = ChessOpsTool;
})();
