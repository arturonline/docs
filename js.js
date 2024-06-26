!(function (n, t, e) {
  function r(n) {
    return t[m + "Element"](n);
  }
  function i(n) {
    return n.toLowerCase();
  }
  function o(n) {
    return "string" == typeof n;
  }
  function u(n) {
    return 3 === n.nodeType;
  }
  function c(n) {
    return void 0 === n;
  }
  function f(n) {
    return "function" == typeof n;
  }
  function s(n, t) {
    return RegExp(n, t);
  }
  function a(n, t) {
    return (
      (t = t || "[\\w-:]+"),
      n[O](s("<\\/" + t + ">|<" + t + "(\\s[^<>]*?)?>", "gi"), "")
        [O](/ +/g, " ")
        [O](/^\s*|\s*$/g, "")
    );
  }
  function l(n, t) {
    return n.join(t || "");
  }
  function v(n, t, e) {
    return n[C](t, e, St);
  }
  function d(n, t, e) {
    return n[S](t, e);
  }
  function g(n) {
    var e,
      u = r(Rt),
      c = t[m + "DocumentFragment"](),
      f = [],
      s = [],
      a = "";
    if (o(n)) {
      for (u[k] = n; (e = u[N]); ) s[K](i(e[j] || "")), f[K](c[R](e));
      return [f, c, s, n];
    }
    for (s in n)
      (e = n[s]) &&
        (o(e) ? ((a += e), (u[k] = e), (e = u[N])) : (a += e[z]),
        f[K](i(e[j] || "")),
        c[R](e));
    return [n, c, f, a];
  }
  var h,
    p,
    b = "__instance__",
    x = "lot",
    m = "create",
    w = "style",
    $ = "minHeight",
    y = "HTML",
    k = "inner" + y,
    z = "outer" + y,
    M = "className",
    y = "EventListener",
    C = "add" + y,
    S = "remove" + y,
    y = "Child",
    N = "first" + y,
    R = "append" + y,
    B = "remove" + y,
    E = "parentNode",
    A = "children",
    L = "childNodes",
    _ = "insertBefore",
    j = "nodeName",
    y = "Attribute",
    T = "get" + y,
    q = "set" + y,
    H = "remove" + y,
    O = "replace",
    D = "value",
    I = "length",
    U = "indexOf",
    F = "substring",
    K = "push",
    X = "preventDefault",
    G = "click",
    J = "focus",
    P = "blur",
    Q = "select",
    V = "keydown",
    W = "paste",
    Y = "view",
    Z = "source",
    nt = "dialog",
    tt = "error",
    et = "test",
    rt = "contenteditable",
    it = "readonly",
    ot = "spellcheck",
    ut = "placeholder",
    ct = "getSelection",
    ft = "getRangeAt",
    st = "rangeCount",
    at = "addRange",
    lt = "removeAllRanges",
    vt = m + "Range",
    y = "Contents",
    dt = "clone" + y,
    gt = "delete" + y,
    ht = Q + "Node",
    pt = ht + y,
    bt = "insertNode",
    xt = "cloneRange",
    mt = "collapse",
    wt = "setStart",
    $t = "setEnd",
    yt = wt + "Before",
    kt = wt + "After",
    zt = $t + "Before",
    Mt = $t + "After",
    Ct = !0,
    St = !1,
    Nt = null,
    Rt = "div",
    y = "Key",
    Bt = "ctrl" + y,
    Et = "shift" + y,
    At = "keyCode",
    Lt = setTimeout;
  !(function (n) {
    (n.version = "1.3.1"),
      (n[b] = {}),
      (n.each = function (t, e) {
        return (
          Lt(
            function () {
              var e,
                r = n[b];
              for (e in r) t(r[e], e, r);
            },
            0 === e ? 0 : e || 1
          ),
          n
        );
      }),
      (n.x = "​");
  })(
    (n[e] = function (o, y) {
      function C() {
        return (h = (n[ct] && n[ct]()) || {}), (h[st] && h) || Nt;
      }
      function S(n) {
        return (h = C()), (h && h[ft](n || 0)) || Nt;
      }
      function N(n, t, e) {
        if (n) {
          if ((h = C())) {
            var i,
              o,
              u = r(Rt);
            for (i = 0, o = h[st]; o > i; ++i) u[R](h[ft](i)[dt]());
            return (
              (n = l(u[k].split(we))),
              (n = c(t) || t ? se.f(n) : n),
              c(e) || e ? n : n[O](s(Se, "g"), "\n\n")[O](s(Ne, "g"), "")
            );
          }
          return "";
        }
        return C() + "";
      }
      function _t(n, t) {
        var e,
          r,
          o,
          u,
          f = N(1, 0, 0),
          s = g(f);
        if (
          (s && s[0][I] && ((p = S()), p[gt](), p[bt](s[1])), (s = s[0]), n)
        ) {
          for (o = 0, u = s[I]; u > o; ++o)
            if (((e = s[o]), i(e[j]) === n)) return e;
          return (c(t) || t) &&
            ((o = Ht()),
            (r = Tt(we + f)),
            (r = r && r[0] && r[0][E]),
            r && i(r[j]) === n && r !== be)
            ? ((r[k] = l(r[k].split(we))), f && f !== r[k] ? Ot(o) : It([r]), r)
            : Nt;
        }
        return s[I] ? s : Nt;
      }
      function jt(n) {
        return (
          (p = S()) && ((n = 1 === n ? St : 0 === n ? Ct : n), p[mt](n)), p
        );
      }
      function Tt(n, t) {
        if (Ee[J]) {
          var e = g(n);
          return (
            (h = C()) &&
              ((p = S()),
              p[gt](),
              p[bt](e[1]),
              0 === t ? jt(1) : 1 === t && (Tt(n, Ct), jt(0)),
              h[lt](),
              h[at](p)),
            e[0]
          );
        }
        return Nt;
      }
      function qt(t) {
        try {
          var e = _t("a"),
            r = a(N(1, 1, 0), "a");
          t = a(t[O](/^\s*javascript:/i, ""));
          var i = t[0],
            o = n.location.hostname;
          return (
            (i = -1 !== "/?&#"[U](i) || -1 === t[U]("/")),
            !o || (0 !== t[U]("//" + o) && -1 === t[U]("://" + o)) || (i = 1),
            r || (Tt(t, Ct), (r = t)),
            t
              ? (e
                  ? e[q]("href", t)
                  : (e = Tt('<a href="' + t + '">' + r + "</a>", Ct)[0]),
                i
                  ? (e[H]("rel"), e[H]("target"))
                  : (e[q]("rel", "nofollow"), e[q]("target", "_blank")))
              : (e && ((r = e[k]), e[E][B](e)), (e = Tt(r, Ct)[0])),
            e
          );
        } catch (u) {}
        return Nt;
      }
      function Ht() {
        var n, t, e;
        return (n = S())
          ? ((t = n[xt]()),
            t[pt](be),
            t[$t](n.startContainer, n.startOffset),
            (e = (t + "")[I]),
            (e = [e, e + (n + "")[I]]),
            e[1] - e[0] === 1 ? [e[0], e[0]] : e)
          : Nt;
      }
      function Ot(e) {
        if (e) {
          var r,
            i,
            o,
            c,
            f,
            s,
            a = t[vt](),
            l = 0,
            v = [be];
          for (a[wt](be, 0), a[mt](Ct); !s && (c = v.pop()); )
            if (u(c))
              (i = l + c[I]),
                f || e[0] < l || e[0] > i || (a[wt](c, e[0] - l), (f = 1)),
                !f || e[1] < l || e[1] > i || (a[$t](c, e[1] - l), (s = 1)),
                (l = i);
            else for (o = c[L][I]; o--; ) v[K](c[L][o]);
          (r = n[ct]()), r[lt](), r[at](a);
        }
      }
      function Dt() {
        return g(N(1, 1, 0))[0];
      }
      function It(n, t) {
        t = c(t) || !t;
        var e = n[0],
          r = n[n[I] - 1];
        return (
          (h = C()),
          (p = S()),
          1 === n[I]
            ? p[t ? pt : ht](e)
            : (p[t ? kt : yt](e), p[t ? zt : Mt](r)),
          h[lt](),
          h[at](p),
          n
        );
      }
      function Ut(n, t) {
        if (Ee[J]) {
          c(t) && (t = -1);
          var e,
            i,
            o,
            u = _t(n),
            f = N(1, 0, 0),
            l = [];
          if (0 === t || (-1 === t && u)) {
            if (u) {
              (e = u[k]), u[E][B](u);
              var v = a(f, n),
                d = a(e, n);
              if (-1 !== d[U](v) && v[I] < d[I])
                (u = s("<" + n + "(\\s[^<>]*?)?>", "i").exec(u[z])),
                  (u = (u && u[1]) || ""),
                  (f = g([e[F](0, e[U](v)), v, e[F](e[U](v) + v[I])])[0]),
                  f[0] &&
                    Tt(
                      "<" + n + u + ">" + (f[0][z] || f[0]) + "</" + n + ">",
                      0
                    ),
                  f[2] &&
                    Tt(
                      "<" + n + u + ">" + (f[2][z] || f[2]) + "</" + n + ">",
                      1
                    ),
                  (l = Tt(f[1][z] || f[1], Ct));
              else {
                if (((l = g(f)), (e = r(Rt)), l && l[2] && (o = l[2][I])))
                  for (i = 0; o > i; ++i)
                    l[2][i] === n ? (e[k] += l[0][i][k]) : e[R](l[0][i]);
                l = Tt(e[k], Ct);
              }
            }
          } else
            (1 === t || (-1 === t && !u)) &&
              (u ||
                (f =
                  f &&
                  f[O](
                    s("(\\n|" + Me + "){2,}", "gi"),
                    "</" + n + ">" + me + me + "<" + n + ">"
                  )),
              (l = Tt("<" + n + ">" + (f || "") + "</" + n + ">", Ct)));
          return l[0] || Nt;
        }
        return Nt;
      }
      function Ft(n, t) {
        J in n &&
          ((n.selectionStart = n.selectionEnd = c(t) ? n[D][I] : t), n[J]());
      }
      function Kt(n, t) {
        var e = n[M];
        return s("(^|\\s)\\s*" + t + "\\s*(\\s|$)")[et](e)
          ? n
          : ((n[M] = a(e + " " + t)), n);
      }
      function Xt(n, t) {
        var e = a(n[M][O](s("(^|\\s)\\s*" + t + "\\s*(\\s|$)", "g"), "$1$2"));
        return e ? (n[M] = e) : n[H]("class"), n;
      }
      function Gt(n, t, e, i) {
        function o(n) {
          i.call(se, n, u), Pt(), be[J](), f(_e) && _e.call(se, n, be), n[X]();
        }
        var u = Kt(r("a"), t),
          c = e[1] || e[0];
        return (
          0 === c[U]("svg:") && (c = ve + c.slice(4) + de),
          (u[k] = "<span>" + c + "</span>"),
          (u.title = n),
          (u.href = "javascript:;"),
          i && (v(u, "touchstart", o), v(u, "mousedown", o)),
          [u, i]
        );
      }
      function Jt() {
        be[k] = se
          .f(o[D])
          [O](s(Se, "gi"), me + me)
          [O](s(Ne, "gi"), "");
      }
      function Pt() {
        var n = se.f(be[k]);
        ge.tidy &&
          (n = n[O](s(Se, "gi"), "</p>\n\n<p$1>")[O](s(ye, "gi"), me + "\n")),
          (o[D] = n);
      }
      function Qt() {
        (Ee[J] = Ct),
          (Ee[P] = St),
          Kt(he, J),
          o.required && ("" === o[D] || ((Ee[tt] = St), Xt(he, tt)));
      }
      function Vt() {
        (Ee[J] = St),
          (Ee[P] = Ct),
          Pt(),
          Xt(he, J),
          o.required &&
            ("" === o[D]
              ? ((Ee[tt] = Ct), Kt(he, tt))
              : ((Ee[tt] = St), Xt(he, tt)));
      }
      function Wt() {
        Lt(function () {
          var n = Ht();
          Pt(), Jt(), be[P](), Ot(n);
        }, 1);
      }
      function Yt(n) {
        return i(n.key || String.fromCharCode(n[At]));
      }
      function Zt(n) {
        var t,
          e = n[Bt],
          r = n[Et],
          o = n[At],
          u = he,
          c = Yt(n);
        if (!e || r || ("b" !== c && 66 !== o))
          if (!e || r || ("i" !== c && 73 !== o))
            if (!e || r || ("u" !== c && 85 !== o))
              if (!e || r || ("l" !== c && 76 !== o)) {
                if (e && r && ("x" === c || 88 === o) && Le) Ie.x[1](), n[X]();
                else if (!r && ("enter" === c || 13 === o))
                  if (
                    (Ae && ((h = C()), (p = S()), Tt(me, 0), Tt(we, 1), n[X]()),
                    Ae)
                  )
                    f(Ae) && Ae(n, se, be);
                  else {
                    for (Pt(); (u = u[E]); )
                      if ("form" === i(u[j])) {
                        t = u;
                        break;
                      }
                    t && (t.submit(), n[X]());
                  }
              } else Ie.a[1](), n[X]();
            else Ie.u[1](), n[X]();
          else Ie.i[1](), n[X]();
        else Ie.b[1](), n[X]();
        f(_e) && _e.call(se, n, be),
          Lt(function () {
            var n = be[k][O](s(we, "g"), "");
            (n && n !== me) || (be[k] = "");
          }, 0);
      }
      function ne(n) {
        var t = n[Bt],
          e = n[Et],
          r = n[At],
          i = Yt(n);
        t && e && ("x" === i || 88 === r) && Le
          ? (Ie.x[1](), n[X]())
          : e || ("enter" !== i && 13 !== r) || (f(Ae) && Ae(n, se, o)),
          f(_e) && _e.call(se, n, o),
          Lt(Jt, 2);
      }
      function te() {
        Ee[Y] && be[J]();
      }
      function ee() {
        (Ee[tt] = St), Xt(he, tt);
      }
      function re(n) {
        var t = this,
          e = n[Bt],
          r = n[Et],
          i = n[At],
          o = Yt(n);
        e || r || ("enter" !== o && 13 !== i)
          ? r ||
            ("escape" !== o &&
              27 !== i &&
              (t[D][I] || ("backspace" !== o && 8 !== i))) ||
            (se.d.x(1, 1), (ue = 0), n[X]())
          : (se.d.x(1, 1),
            ue && ue.call(se, n, t),
            (ue = 0),
            (t[D] = ""),
            f(_e) && _e.call(se, n, be),
            n[X]());
      }
      function ie() {
        if (he[E]) return se;
        Kt(o, je + "-" + Z),
          v(be, V, Zt),
          v(be, J, Qt),
          v(be, P, Vt),
          v(be, W, Wt),
          v(o, V, ne),
          v(o, J, te),
          (ce = ge.tools);
        for (fe in ce)
          if (((fe = ce[fe]), Ie[fe])) {
            if ("x" === fe && !Le) continue;
            pe[R](Ie[fe][0]);
          }
        return (
          he[R](be),
          Ue &&
            "p" === i(Ue[j]) &&
            (Ue[_](Fe, o), Ue[E][_](o, Ue), Ue[E][B](Ue)),
          o[E][_](he, o),
          he[R](o),
          he[R](pe),
          Kt(xe, je + "-" + nt),
          se.d.x(),
          v(Ke, G, ee),
          v(Ke, V, re),
          he[R](xe),
          Jt(),
          Pt(),
          se
        );
      }
      function oe() {
        return he[E]
          ? (Ue && (he[E][_](Ue, he), Ue[_](o, Fe), Ue[B](Fe)),
            (o[w][$] = ""),
            o[T](w) || o[H](w),
            Xt(o, je + "-" + Z),
            d(be, V, Zt),
            d(be, J, Qt),
            d(be, P, Vt),
            d(be, W, Wt),
            d(o, V, ne),
            d(o, J, te),
            d(Ke, G, ee),
            d(Ke, V, re),
            he[E][B](he),
            Jt(),
            Pt(),
            se)
          : se;
      }
      var ue,
        ce,
        fe,
        se = this,
        ae = "⌘",
        le = "⇧",
        ve =
          '<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="',
        de = '"></path></svg>',
        ge = {
          classes: ["rich-text-editor"],
          tags: [
            "a|abbr|b|br|code|dfn|del|em|i|ins|kbd|mark|p|span|strong|u|var",
          ],
          blocks: [
            "article|aside|blockquote|figure|figcaption|figure|h[1-6]|header|div|li|[ou]l|p|pre|section|table|tr|th",
          ],
          attributes: ["class|data-[\\w-]+?|href|id|rel|style|target|title"],
          tools: ["b", "i", "u", "x"],
          text: {
            b: [
              "Bold",
              ve +
                "M9 10.344c0.563 0 1-0.438 1-1s-0.438-1-1-1h-2.344v2h2.344zM6.656 4.344v2h2c0.563 0 1-0.438 1-1s-0.438-1-1-1h-2zM10.406 7.188c0.875 0.406 1.438 1.281 1.438 2.281 0 1.406-1.063 2.531-2.469 2.531h-4.719v-9.344h4.188c1.5 0 2.656 1.188 2.656 2.688 0 0.688-0.438 1.406-1.094 1.844z" +
                de,
              ae + "+B",
            ],
            i: [
              "Italic",
              ve +
                "M6.656 2.656h5.344v2h-1.875l-2.25 5.344h1.469v2h-5.344v-2h1.875l2.25-5.344h-1.469v-2z" +
                de,
              ae + "+I",
            ],
            u: [
              "Underline",
              ve +
                "M3.344 12.656h9.313v1.344h-9.313v-1.344zM8 11.344c-2.219 0-4-1.781-4-4v-5.344h1.656v5.344c0 1.281 1.063 2.313 2.344 2.313s2.344-1.031 2.344-2.313v-5.344h1.656v5.344c0 2.219-1.781 4-4 4z" +
                de,
              ae + "+U",
            ],
            a: [
              "Link",
              ve +
                "M11.344 4.656c1.844 0 3.313 1.5 3.313 3.344s-1.469 3.344-3.313 3.344h-2.688v-1.281h2.688c1.125 0 2.063-0.938 2.063-2.063s-0.938-2.063-2.063-2.063h-2.688v-1.281h2.688zM5.344 8.656v-1.313h5.313v1.313h-5.313zM2.594 8c0 1.125 0.938 2.063 2.063 2.063h2.688v1.281h-2.688c-1.844 0-3.313-1.5-3.313-3.344s1.469-3.344 3.313-3.344h2.688v1.281h-2.688c-1.125 0-2.063 0.938-2.063 2.063z" +
                de,
              ae + "+L",
            ],
            x: [
              "Source",
              ve +
                "M8 6.656c0.719 0 1.344 0.625 1.344 1.344s-0.625 1.344-1.344 1.344-1.344-0.625-1.344-1.344 0.625-1.344 1.344-1.344zM12 6.656c0.719 0 1.344 0.625 1.344 1.344s-0.625 1.344-1.344 1.344-1.344-0.625-1.344-1.344 0.625-1.344 1.344-1.344zM4 6.656c0.719 0 1.344 0.625 1.344 1.344s-0.625 1.344-1.344 1.344-1.344-0.625-1.344-1.344 0.625-1.344 1.344-1.344z" +
                de,
              ae + "+" + le + "+X",
            ],
          },
          tidy: 1,
          enter: 1,
          x: 1,
          update: 0,
        },
        he = r(Rt),
        pe = r(Rt),
        be = r(Rt),
        xe = r(Rt),
        me = "<br>",
        we = n[e].x,
        $e = "(\\s[^<>]*?)?",
        ye = "<br" + $e + "\\s*\\/?>",
        ke = "<p" + $e + ">",
        ze = "<\\/p>",
        $e = "\\s*",
        Me = $e + "(?:" + ye + ")" + $e,
        Ce =
          "^" +
          $e +
          ke +
          "(?:" +
          Me +
          ")*" +
          $e +
          "|" +
          $e +
          "(?:" +
          Me +
          ")*" +
          ze +
          $e +
          "$",
        Se = $e + "(?:" + Me + ")*" + ze + $e + ke + "(?:" + Me + ")*" + $e,
        Ne =
          $e + "(?:" + ke + "(?:" + Me + ")*|(?:" + Me + ")*" + ze + ")" + $e,
        Re = $e + ke + "(?:" + Me + ")*" + $e + "(?:" + Me + ")*" + ze + $e,
        Be = $e + ke + "(?:" + Me + ")*(?:[\\s\\S]*?)(?:" + Me + ")*" + ze + $e;
      (se.is = {
        view: Ct,
        source: St,
        dialog: St,
        e: function (n) {
          var t = C()[J + "Node"];
          if (!t) return Nt;
          if ((u(t) && (t = t[E]), t === be)) {
            if ((t = N(1, 1, 0)) && -1 !== i(t)[U]("</" + n + ">"))
              return Tt(t, Ct)[0];
          } else {
            if (t[j] && i(t[j]) === n) return t;
            for (; t && t !== be; ) {
              if (t[j] && i(t[j]) === n) return t;
              t = t[E];
            }
          }
          return Nt;
        },
        focus: St,
        blur: Ct,
        error: St,
      }),
        (y = y || {});
      for (fe in ge) c(y[fe]) || (ge[fe] = y[fe]);
      var Ee = se.is,
        Ae = ge.enter,
        Le = ge.x,
        _e = ge.update,
        je = ge.classes[0],
        Te = ge.text || {},
        qe = l(ge.tags, "|"),
        He = l(ge.attributes, "|"),
        Oe = l(ge.blocks, "|"),
        De = 0,
        Ie = {
          b: function () {
            Ut("strong");
          },
          i: function () {
            Ut("em");
          },
          u: function () {
            Ut("u");
          },
          a: function () {
            var n,
              t,
              e = a(N(1, 1, 0)).split(/\s/)[0];
            /^[a-z\d]+:\/\/\S+$/[et](e)
              ? (_t("a") ? Ut("a", 0) : qt(e), Pt())
              : Ee[nt]
              ? se.d.x(1)
              : ((n = _t("a")) && (t = n[T]("href")),
                ($e = "http://"),
                se.d(
                  $e,
                  (t ? t[O](/\/+$/, "") : $e + i(e)) || "",
                  function (n, t) {
                    qt(t[D]), Pt();
                  }
                ),
                Lt(function () {
                  t && xe[A][0][Q]();
                }, 2));
          },
          x: function (n) {
            if (Le) {
              var t = be.offsetHeight;
              t && (o[w][$] = t + "px"),
                De
                  ? ((se[x][0] = Ht()),
                    Kt(he, Y),
                    Xt(he, Z),
                    be[J](),
                    Ot(se[x][1]),
                    (De = 0))
                  : ((se[x][1] = Ht()),
                    Kt(he, Z),
                    Xt(he, Y),
                    o[J](),
                    Ot(se[x][0]),
                    (De = 1)),
                (Ee[Y] = !De),
                (Ee[Z] = !!De),
                se.d.x(0, 1),
                f(Le) && Le.call(se, n, De || 0);
            }
          },
        };
      (se.$$ = function (n, t) {
        var e = [C(), S(t)];
        return c(n) ? e : e[n];
      }),
        (se[x] = [Nt, Nt]),
        (se.d = function (n, t, e) {
          var r = xe[A][0];
          return (
            (r[ut] = n),
            (r[D] = t),
            Lt(function () {
              Ft(r);
            }, 1),
            (ue = e),
            se.d.v(1),
            se
          );
        }),
        (se.d.x = function (n, t) {
          var e = xe[A][0],
            r = e[D];
          return (
            r && !t
              ? (Kt(he, tt),
                (Ee[tt] = Ct),
                (Ee[nt] = Ct),
                Lt(function () {
                  (Ee[J] = St), (Ee[P] = Ct), e[J](), e[Q]();
                }, 1))
              : (Xt(he, nt), Xt(he, tt), (Ee[nt] = St)),
            (Ee[J] = Ct),
            (Ee[P] = St),
            n && (se[J](), Ot(se[x][1])),
            se
          );
        }),
        (se.d.v = function (n) {
          return (
            Kt(he, nt),
            Xt(he, tt),
            (Ee[tt] = St),
            (Ee[nt] = Ct),
            n && (se[x][1] = Ht()),
            se
          );
        }),
        (n[e][b][o.id || o.name || Object.keys(n[e][b])[I]] = se),
        (se.t = function (n, t, e, r) {
          var i = Gt(
            t[0] + (t[2] ? " (" + t[2] + ")" : ""),
            je + "-t:" + n,
            t,
            e
          );
          return (
            c(r) ? (r = Nt) : 0 > r && (r = pe[A][I] + r),
            pe[_](i[0], pe[A][r] || Nt),
            (se.t[n] = i[1]),
            (se.t[n].e = i[0])
          );
        });
      for (fe in Ie)
        (se.t[fe] = Ie[fe]),
          (Ie[fe] = Gt(
            Te[fe][0] + (Te[fe][2] ? " (" + Te[fe][2] + ")" : ""),
            je + "-t:" + fe,
            Te[fe],
            Ie[fe]
          )),
          (se.t[fe].e = Ie[fe][0]);
      (se.f = function (n) {
        return (
          (n = l(n[O](/\r/g, "").split(we))),
          (n = n[O](
            /<([\w-:]+?)(?:\s[^<>]*?)?>\s*<\/([\w-:]+?)>/g,
            function (n, t, e) {
              return t === e ? "" : n;
            }
          )),
          (n = n[O](
            /<code(\s[^<>]*?)?>([\s\S]*?)<\/code>/g,
            function (n, t, e) {
              return (
                "<code" +
                (t || "") +
                ">" +
                e[O](/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")[O](/ /g, "&nbsp;") +
                "</code>"
              );
            }
          )),
          (n = n[O](/<(\/?)([\w-:]+?)(\s[^<>]*?)?>/g, function (n, t, e, r) {
            if (((e = i(e)), !s("^(" + qe + "|" + Oe + ")$")[et](e))) return "";
            (r = r || "") &&
              (r = r[O](
                /\s+([\w-:]+?)(?:="((?:\\.|[^"])*?)"|$)/g,
                function (n, t) {
                  return s("^(" + He + ")$")[et](t) ? n : "";
                }
              ));
            var o = /^(h[1-6]|th)$/[et](e),
              u = /^((fig)?caption)$/[et](e),
              c = t ? "" : r;
            return "b" === e || "strong" === e || o
              ? "<" + t + "strong" + c + ">" + (o && t ? me + me : "")
              : "i" === e || "em" === e || u
              ? "<" + t + "em" + c + ">"
              : s("^(" + qe + ")$")[et](e)
              ? "<" + t + e + c + ">"
              : s("^(" + Oe + ")$")[et](e)
              ? me + me
              : "";
          })),
          (n = n[O](s(Se, "gi"), "</p><p$1>")
            [O](s(Me, "gi"), me)
            [O](/\n/g, me)
            [O](s("(?:" + Me + "){3,}", "gi"), me + me)
            [O](s("^(?:" + Me + ")+|(?:" + Me + ")+$", "gi"), "")
            [O](s("(?:" + Me + "){2,}", "gi"), "</p><p>")
            [O](s(Re, "gi"), "")),
          (n = n && !s("^" + Be + "$", "gi")[et](n) ? "<p>" + n + "</p>" : n),
          (n = g(n)),
          n[3] || ""
        );
      }),
        Jt(),
        Pt(),
        Kt(he, je + " " + Y),
        o[q](ot, St),
        Kt(pe, je + "-tools"),
        Kt(be, je + "-" + Y),
        Ae && Kt(he, "expand"),
        be[q](rt, Ct),
        be[q](ot, St),
        be[q](ut, o[ut] || "");
      var Ue = o[E],
        Fe = r("a"),
        Ke = r("input");
      return (
        (Ke.type = "text"),
        Ke[q](ot, St),
        xe[R](Ke),
        ie(),
        (se.config = ge),
        (se.container = he),
        (se.view = be),
        (se.source = o),
        (se.tools = pe),
        (se.dialog = xe),
        (se.c = jt),
        (se.e = _t),
        (se.g = g),
        (se.i = Tt),
        (se.m = It),
        (se.n = Dt),
        (se.r = Ot),
        (se.s = Ht),
        (se.v = N),
        (se.w = Ut),
        (se[m] = ie),
        (se.destroy = oe),
        (se[J] = function (n) {
          if (Ee[Y]) {
            var e = be[k];
            be[J](),
              se[x][1] && Ot(se[x][1]),
              (Ee[J] = Ct),
              (Ee[P] = St),
              0 === n
                ? ((be[k] = ""), Tt(e, 1))
                : 1 === n
                ? ((be[k] = ""), Tt(e, 0))
                : n === Ct &&
                  ((p = t[vt]()), p[pt](be), (h = C()), h[lt](), h[at](p));
          } else
            Ee[Z] &&
              (o[J](),
              0 === n
                ? Ft(o, 0)
                : 1 === n
                ? Ft(o, o[D][I])
                : n === Ct && o[Q]());
          return se;
        }),
        (se[P] = function () {
          return (
            Ee[Y] ? ((Ee[J] = St), (Ee[P] = Ct), be[P]()) : Ee[Z] && o[P](), se
          );
        }),
        (se.set = function (n, t) {
          return (
            (n = se.f(n)),
            (Ee[Y] || 1 === t) &&
              (n = n[O](s(Ce, "gi"), "")[O](s(Se, "gi"), me + me)),
            c(t)
              ? Ee[Y]
                ? ((be[k] = n), Pt())
                : Ee[Z]
                ? ((o[D] = n), Jt())
                : Ee[nt] && (xe[A][0][D] = n)
              : 0 === t
              ? ((o[D] = n), Jt())
              : 1 === t && ((be[k] = n), Pt()),
            se
          );
        }),
        (se.get = function (n, t) {
          if (c(t)) {
            var e;
            return (e = Ee[Z] ? o[D] : Ee[nt] ? xe[A][0][D] : o[D]), e ? e : n;
          }
          return 0 === t ? o[D] || n : 1 === t ? be[k] || n : void 0;
        }),
        (se.disable = function () {
          return be[H](rt), o[q](it, Ct), se;
        }),
        (se.enable = function () {
          return be[q](rt, Ct), o[H](it), se;
        }),
        se
      );
    })
  );
})(window, document, "RTE");
