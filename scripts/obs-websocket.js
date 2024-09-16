var OBSWebSocket = (function () {
	function e() {
		return (
			(e = Object.assign
				? Object.assign.bind()
				: function (e) {
						for (var t = 1; t < arguments.length; t++) {
							var n = arguments[t];
							for (var r in n)
								Object.prototype.hasOwnProperty.call(n, r) && (e[r] = n[r]);
						}
						return e;
					}),
			e.apply(this, arguments)
		);
	}
	function t(e, t) {
		(e.prototype = Object.create(t.prototype)),
			(e.prototype.constructor = e),
			r(e, t);
	}
	function n(e) {
		return (
			(n = Object.setPrototypeOf
				? Object.getPrototypeOf.bind()
				: function (e) {
						return e.__proto__ || Object.getPrototypeOf(e);
					}),
			n(e)
		);
	}
	function r(e, t) {
		return (
			(r = Object.setPrototypeOf
				? Object.setPrototypeOf.bind()
				: function (e, t) {
						return (e.__proto__ = t), e;
					}),
			r(e, t)
		);
	}
	function o(e, t, n) {
		return (
			(o = (function () {
				if ("undefined" == typeof Reflect || !Reflect.construct) return !1;
				if (Reflect.construct.sham) return !1;
				if ("function" == typeof Proxy) return !0;
				try {
					return (
						Boolean.prototype.valueOf.call(
							Reflect.construct(Boolean, [], function () {}),
						),
						!0
					);
				} catch (e) {
					return !1;
				}
			})()
				? Reflect.construct.bind()
				: function (e, t, n) {
						var o = [null];
						o.push.apply(o, t);
						var i = new (Function.bind.apply(e, o))();
						return n && r(i, n.prototype), i;
					}),
			o.apply(null, arguments)
		);
	}
	function i(e) {
		var t = "function" == typeof Map ? new Map() : void 0;
		return (
			(i = function (e) {
				if (
					null === e ||
					-1 === Function.toString.call(e).indexOf("[native code]")
				)
					return e;
				if ("function" != typeof e)
					throw new TypeError(
						"Super expression must either be null or a function",
					);
				if (void 0 !== t) {
					if (t.has(e)) return t.get(e);
					t.set(e, i);
				}
				function i() {
					return o(e, arguments, n(this).constructor);
				}
				return (
					(i.prototype = Object.create(e.prototype, {
						constructor: {
							value: i,
							enumerable: !1,
							writable: !0,
							configurable: !0,
						},
					})),
					r(i, e)
				);
			}),
			i(e)
		);
	}
	var s =
		"undefined" != typeof globalThis
			? globalThis
			: "undefined" != typeof window
				? window
				: "undefined" != typeof global
					? global
					: "undefined" != typeof self
						? self
						: {};
	function c(e) {
		var t = { exports: {} };
		return e(t, t.exports), t.exports;
	}
	var a = 1e3,
		u = 60 * a,
		f = 60 * u,
		l = 24 * f,
		d = function (e, t) {
			t = t || {};
			var n = typeof e;
			if ("string" === n && e.length > 0)
				return (function (e) {
					if (!((e = String(e)).length > 100)) {
						var t =
							/^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
								e,
							);
						if (t) {
							var n = parseFloat(t[1]);
							switch ((t[2] || "ms").toLowerCase()) {
								case "years":
								case "year":
								case "yrs":
								case "yr":
								case "y":
									return 315576e5 * n;
								case "weeks":
								case "week":
								case "w":
									return 6048e5 * n;
								case "days":
								case "day":
								case "d":
									return n * l;
								case "hours":
								case "hour":
								case "hrs":
								case "hr":
								case "h":
									return n * f;
								case "minutes":
								case "minute":
								case "mins":
								case "min":
								case "m":
									return n * u;
								case "seconds":
								case "second":
								case "secs":
								case "sec":
								case "s":
									return n * a;
								case "milliseconds":
								case "millisecond":
								case "msecs":
								case "msec":
								case "ms":
									return n;
								default:
									return;
							}
						}
					}
				})(e);
			if ("number" === n && isFinite(e))
				return t.long
					? (function (e) {
							var t = Math.abs(e);
							return t >= l
								? h(e, t, l, "day")
								: t >= f
									? h(e, t, f, "hour")
									: t >= u
										? h(e, t, u, "minute")
										: t >= a
											? h(e, t, a, "second")
											: e + " ms";
						})(e)
					: (function (e) {
							var t = Math.abs(e);
							return t >= l
								? Math.round(e / l) + "d"
								: t >= f
									? Math.round(e / f) + "h"
									: t >= u
										? Math.round(e / u) + "m"
										: t >= a
											? Math.round(e / a) + "s"
											: e + "ms";
						})(e);
			throw new Error(
				"val is not a non-empty string or a valid number. val=" +
					JSON.stringify(e),
			);
		};
	function h(e, t, n, r) {
		var o = t >= 1.5 * n;
		return Math.round(e / n) + " " + r + (o ? "s" : "");
	}
	var p = c(function (e, t) {
			(t.formatArgs = function (t) {
				if (
					((t[0] =
						(this.useColors ? "%c" : "") +
						this.namespace +
						(this.useColors ? " %c" : " ") +
						t[0] +
						(this.useColors ? "%c " : " ") +
						"+" +
						e.exports.humanize(this.diff)),
					!this.useColors)
				)
					return;
				const n = "color: " + this.color;
				t.splice(1, 0, n, "color: inherit");
				let r = 0,
					o = 0;
				t[0].replace(/%[a-zA-Z%]/g, (e) => {
					"%%" !== e && (r++, "%c" === e && (o = r));
				}),
					t.splice(o, 0, n);
			}),
				(t.save = function (e) {
					try {
						e ? t.storage.setItem("debug", e) : t.storage.removeItem("debug");
					} catch (e) {}
				}),
				(t.load = function () {
					let e;
					try {
						e = t.storage.getItem("debug");
					} catch (e) {}
					return (
						!e &&
							"undefined" != typeof process &&
							"env" in process &&
							(e = process.env.DEBUG),
						e
					);
				}),
				(t.useColors = function () {
					return (
						!(
							"undefined" == typeof window ||
							!window.process ||
							("renderer" !== window.process.type && !window.process.__nwjs)
						) ||
						(("undefined" == typeof navigator ||
							!navigator.userAgent ||
							!navigator.userAgent
								.toLowerCase()
								.match(/(edge|trident)\/(\d+)/)) &&
							(("undefined" != typeof document &&
								document.documentElement &&
								document.documentElement.style &&
								document.documentElement.style.WebkitAppearance) ||
								("undefined" != typeof window &&
									window.console &&
									(window.console.firebug ||
										(window.console.exception && window.console.table))) ||
								("undefined" != typeof navigator &&
									navigator.userAgent &&
									navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
									parseInt(RegExp.$1, 10) >= 31) ||
								("undefined" != typeof navigator &&
									navigator.userAgent &&
									navigator.userAgent
										.toLowerCase()
										.match(/applewebkit\/(\d+)/))))
					);
				}),
				(t.storage = (function () {
					try {
						return localStorage;
					} catch (e) {}
				})()),
				(t.destroy = (() => {
					let e = !1;
					return () => {
						e ||
							((e = !0),
							console.warn(
								"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
							));
					};
				})()),
				(t.colors = [
					"#0000CC",
					"#0000FF",
					"#0033CC",
					"#0033FF",
					"#0066CC",
					"#0066FF",
					"#0099CC",
					"#0099FF",
					"#00CC00",
					"#00CC33",
					"#00CC66",
					"#00CC99",
					"#00CCCC",
					"#00CCFF",
					"#3300CC",
					"#3300FF",
					"#3333CC",
					"#3333FF",
					"#3366CC",
					"#3366FF",
					"#3399CC",
					"#3399FF",
					"#33CC00",
					"#33CC33",
					"#33CC66",
					"#33CC99",
					"#33CCCC",
					"#33CCFF",
					"#6600CC",
					"#6600FF",
					"#6633CC",
					"#6633FF",
					"#66CC00",
					"#66CC33",
					"#9900CC",
					"#9900FF",
					"#9933CC",
					"#9933FF",
					"#99CC00",
					"#99CC33",
					"#CC0000",
					"#CC0033",
					"#CC0066",
					"#CC0099",
					"#CC00CC",
					"#CC00FF",
					"#CC3300",
					"#CC3333",
					"#CC3366",
					"#CC3399",
					"#CC33CC",
					"#CC33FF",
					"#CC6600",
					"#CC6633",
					"#CC9900",
					"#CC9933",
					"#CCCC00",
					"#CCCC33",
					"#FF0000",
					"#FF0033",
					"#FF0066",
					"#FF0099",
					"#FF00CC",
					"#FF00FF",
					"#FF3300",
					"#FF3333",
					"#FF3366",
					"#FF3399",
					"#FF33CC",
					"#FF33FF",
					"#FF6600",
					"#FF6633",
					"#FF9900",
					"#FF9933",
					"#FFCC00",
					"#FFCC33",
				]),
				(t.log = console.debug || console.log || (() => {})),
				(e.exports = (function (e) {
					function t(e) {
						let r,
							o,
							i,
							s = null;
						function c(...e) {
							if (!c.enabled) return;
							const n = c,
								o = Number(new Date());
							(n.diff = o - (r || o)),
								(n.prev = r),
								(n.curr = o),
								(r = o),
								(e[0] = t.coerce(e[0])),
								"string" != typeof e[0] && e.unshift("%O");
							let i = 0;
							(e[0] = e[0].replace(/%([a-zA-Z%])/g, (r, o) => {
								if ("%%" === r) return "%";
								i++;
								const s = t.formatters[o];
								return (
									"function" == typeof s &&
										((r = s.call(n, e[i])), e.splice(i, 1), i--),
									r
								);
							})),
								t.formatArgs.call(n, e),
								(n.log || t.log).apply(n, e);
						}
						return (
							(c.namespace = e),
							(c.useColors = t.useColors()),
							(c.color = t.selectColor(e)),
							(c.extend = n),
							(c.destroy = t.destroy),
							Object.defineProperty(c, "enabled", {
								enumerable: !0,
								configurable: !1,
								get: () =>
									null !== s
										? s
										: (o !== t.namespaces &&
												((o = t.namespaces), (i = t.enabled(e))),
											i),
								set: (e) => {
									s = e;
								},
							}),
							"function" == typeof t.init && t.init(c),
							c
						);
					}
					function n(e, n) {
						const r = t(this.namespace + (void 0 === n ? ":" : n) + e);
						return (r.log = this.log), r;
					}
					function r(e) {
						return e
							.toString()
							.substring(2, e.toString().length - 2)
							.replace(/\.\*\?$/, "*");
					}
					return (
						(t.debug = t),
						(t.default = t),
						(t.coerce = function (e) {
							return e instanceof Error ? e.stack || e.message : e;
						}),
						(t.disable = function () {
							const e = [
								...t.names.map(r),
								...t.skips.map(r).map((e) => "-" + e),
							].join(",");
							return t.enable(""), e;
						}),
						(t.enable = function (e) {
							let n;
							t.save(e), (t.namespaces = e), (t.names = []), (t.skips = []);
							const r = ("string" == typeof e ? e : "").split(/[\s,]+/),
								o = r.length;
							for (n = 0; n < o; n++)
								r[n] &&
									("-" === (e = r[n].replace(/\*/g, ".*?"))[0]
										? t.skips.push(new RegExp("^" + e.slice(1) + "$"))
										: t.names.push(new RegExp("^" + e + "$")));
						}),
						(t.enabled = function (e) {
							if ("*" === e[e.length - 1]) return !0;
							let n, r;
							for (n = 0, r = t.skips.length; n < r; n++)
								if (t.skips[n].test(e)) return !1;
							for (n = 0, r = t.names.length; n < r; n++)
								if (t.names[n].test(e)) return !0;
							return !1;
						}),
						(t.humanize = d),
						(t.destroy = function () {
							console.warn(
								"Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.",
							);
						}),
						Object.keys(e).forEach((n) => {
							t[n] = e[n];
						}),
						(t.names = []),
						(t.skips = []),
						(t.formatters = {}),
						(t.selectColor = function (e) {
							let n = 0;
							for (let t = 0; t < e.length; t++)
								(n = (n << 5) - n + e.charCodeAt(t)), (n |= 0);
							return t.colors[Math.abs(n) % t.colors.length];
						}),
						t.enable(t.load()),
						t
					);
				})(t));
			const { formatters: n } = e.exports;
			n.j = function (e) {
				try {
					return JSON.stringify(e);
				} catch (e) {
					return "[UnexpectedJSONParseError]: " + e.message;
				}
			};
		}),
		v = c(function (e) {
			var t = Object.prototype.hasOwnProperty,
				n = "~";
			function r() {}
			function o(e, t, n) {
				(this.fn = e), (this.context = t), (this.once = n || !1);
			}
			function i(e, t, r, i, s) {
				if ("function" != typeof r)
					throw new TypeError("The listener must be a function");
				var c = new o(r, i || e, s),
					a = n ? n + t : t;
				return (
					e._events[a]
						? e._events[a].fn
							? (e._events[a] = [e._events[a], c])
							: e._events[a].push(c)
						: ((e._events[a] = c), e._eventsCount++),
					e
				);
			}
			function s(e, t) {
				0 == --e._eventsCount ? (e._events = new r()) : delete e._events[t];
			}
			function c() {
				(this._events = new r()), (this._eventsCount = 0);
			}
			Object.create &&
				((r.prototype = Object.create(null)), new r().__proto__ || (n = !1)),
				(c.prototype.eventNames = function () {
					var e,
						r,
						o = [];
					if (0 === this._eventsCount) return o;
					for (r in (e = this._events))
						t.call(e, r) && o.push(n ? r.slice(1) : r);
					return Object.getOwnPropertySymbols
						? o.concat(Object.getOwnPropertySymbols(e))
						: o;
				}),
				(c.prototype.listeners = function (e) {
					var t = this._events[n ? n + e : e];
					if (!t) return [];
					if (t.fn) return [t.fn];
					for (var r = 0, o = t.length, i = new Array(o); r < o; r++)
						i[r] = t[r].fn;
					return i;
				}),
				(c.prototype.listenerCount = function (e) {
					var t = this._events[n ? n + e : e];
					return t ? (t.fn ? 1 : t.length) : 0;
				}),
				(c.prototype.emit = function (e, t, r, o, i, s) {
					var c = n ? n + e : e;
					if (!this._events[c]) return !1;
					var a,
						u,
						f = this._events[c],
						l = arguments.length;
					if (f.fn) {
						switch ((f.once && this.removeListener(e, f.fn, void 0, !0), l)) {
							case 1:
								return f.fn.call(f.context), !0;
							case 2:
								return f.fn.call(f.context, t), !0;
							case 3:
								return f.fn.call(f.context, t, r), !0;
							case 4:
								return f.fn.call(f.context, t, r, o), !0;
							case 5:
								return f.fn.call(f.context, t, r, o, i), !0;
							case 6:
								return f.fn.call(f.context, t, r, o, i, s), !0;
						}
						for (u = 1, a = new Array(l - 1); u < l; u++)
							a[u - 1] = arguments[u];
						f.fn.apply(f.context, a);
					} else {
						var d,
							h = f.length;
						for (u = 0; u < h; u++)
							switch (
								(f[u].once && this.removeListener(e, f[u].fn, void 0, !0), l)
							) {
								case 1:
									f[u].fn.call(f[u].context);
									break;
								case 2:
									f[u].fn.call(f[u].context, t);
									break;
								case 3:
									f[u].fn.call(f[u].context, t, r);
									break;
								case 4:
									f[u].fn.call(f[u].context, t, r, o);
									break;
								default:
									if (!a)
										for (d = 1, a = new Array(l - 1); d < l; d++)
											a[d - 1] = arguments[d];
									f[u].fn.apply(f[u].context, a);
							}
					}
					return !0;
				}),
				(c.prototype.on = function (e, t, n) {
					return i(this, e, t, n, !1);
				}),
				(c.prototype.once = function (e, t, n) {
					return i(this, e, t, n, !0);
				}),
				(c.prototype.removeListener = function (e, t, r, o) {
					var i = n ? n + e : e;
					if (!this._events[i]) return this;
					if (!t) return s(this, i), this;
					var c = this._events[i];
					if (c.fn)
						c.fn !== t ||
							(o && !c.once) ||
							(r && c.context !== r) ||
							s(this, i);
					else {
						for (var a = 0, u = [], f = c.length; a < f; a++)
							(c[a].fn !== t ||
								(o && !c[a].once) ||
								(r && c[a].context !== r)) &&
								u.push(c[a]);
						u.length
							? (this._events[i] = 1 === u.length ? u[0] : u)
							: s(this, i);
					}
					return this;
				}),
				(c.prototype.removeAllListeners = function (e) {
					var t;
					return (
						e
							? this._events[(t = n ? n + e : e)] && s(this, t)
							: ((this._events = new r()), (this._eventsCount = 0)),
						this
					);
				}),
				(c.prototype.off = c.prototype.removeListener),
				(c.prototype.addListener = c.prototype.on),
				(c.prefixed = n),
				(c.EventEmitter = c),
				(e.exports = c);
		}),
		y = null;
	"undefined" != typeof WebSocket
		? (y = WebSocket)
		: "undefined" != typeof MozWebSocket
			? (y = MozWebSocket)
			: "undefined" != typeof global
				? (y = global.WebSocket || global.MozWebSocket)
				: "undefined" != typeof window
					? (y = window.WebSocket || window.MozWebSocket)
					: "undefined" != typeof self &&
						(y = self.WebSocket || self.MozWebSocket);
	var m,
		g,
		C,
		w = y;
	!(function (e) {
		(e[(e.Hello = 0)] = "Hello"),
			(e[(e.Identify = 1)] = "Identify"),
			(e[(e.Identified = 2)] = "Identified"),
			(e[(e.Reidentify = 3)] = "Reidentify"),
			(e[(e.Event = 5)] = "Event"),
			(e[(e.Request = 6)] = "Request"),
			(e[(e.RequestResponse = 7)] = "RequestResponse"),
			(e[(e.RequestBatch = 8)] = "RequestBatch"),
			(e[(e.RequestBatchResponse = 9)] = "RequestBatchResponse");
	})(m || (m = {})),
		(function (e) {
			(e[(e.None = 0)] = "None"),
				(e[(e.General = 1)] = "General"),
				(e[(e.Config = 2)] = "Config"),
				(e[(e.Scenes = 4)] = "Scenes"),
				(e[(e.Inputs = 8)] = "Inputs"),
				(e[(e.Transitions = 16)] = "Transitions"),
				(e[(e.Filters = 32)] = "Filters"),
				(e[(e.Outputs = 64)] = "Outputs"),
				(e[(e.SceneItems = 128)] = "SceneItems"),
				(e[(e.MediaInputs = 256)] = "MediaInputs"),
				(e[(e.Vendors = 512)] = "Vendors"),
				(e[(e.Ui = 1024)] = "Ui"),
				(e[(e.All = 2047)] = "All"),
				(e[(e.InputVolumeMeters = 65536)] = "InputVolumeMeters"),
				(e[(e.InputActiveStateChanged = 131072)] = "InputActiveStateChanged"),
				(e[(e.InputShowStateChanged = 262144)] = "InputShowStateChanged"),
				(e[(e.SceneItemTransformChanged = 524288)] =
					"SceneItemTransformChanged");
		})(g || (g = {})),
		(function (e) {
			(e[(e.None = -1)] = "None"),
				(e[(e.SerialRealtime = 0)] = "SerialRealtime"),
				(e[(e.SerialFrame = 1)] = "SerialFrame"),
				(e[(e.Parallel = 2)] = "Parallel");
		})(C || (C = {}));
	var b = { __proto__: null, default: {} },
		_ = c(function (e, t) {
			var n;
			e.exports =
				((n =
					n ||
					(function (e, t) {
						var n;
						if (
							("undefined" != typeof window &&
								window.crypto &&
								(n = window.crypto),
							"undefined" != typeof self && self.crypto && (n = self.crypto),
							"undefined" != typeof globalThis &&
								globalThis.crypto &&
								(n = globalThis.crypto),
							!n &&
								"undefined" != typeof window &&
								window.msCrypto &&
								(n = window.msCrypto),
							!n && void 0 !== s && s.crypto && (n = s.crypto),
							!n)
						)
							try {
								n = b;
							} catch (e) {}
						var r = function () {
								if (n) {
									if ("function" == typeof n.getRandomValues)
										try {
											return n.getRandomValues(new Uint32Array(1))[0];
										} catch (e) {}
									if ("function" == typeof n.randomBytes)
										try {
											return n.randomBytes(4).readInt32LE();
										} catch (e) {}
								}
								throw new Error(
									"Native crypto module could not be used to get secure random number.",
								);
							},
							o =
								Object.create ||
								(function () {
									function e() {}
									return function (t) {
										var n;
										return (
											(e.prototype = t), (n = new e()), (e.prototype = null), n
										);
									};
								})(),
							i = {},
							c = (i.lib = {}),
							a = (c.Base = {
								extend: function (e) {
									var t = o(this);
									return (
										e && t.mixIn(e),
										(t.hasOwnProperty("init") && this.init !== t.init) ||
											(t.init = function () {
												t.$super.init.apply(this, arguments);
											}),
										(t.init.prototype = t),
										(t.$super = this),
										t
									);
								},
								create: function () {
									var e = this.extend();
									return e.init.apply(e, arguments), e;
								},
								init: function () {},
								mixIn: function (e) {
									for (var t in e) e.hasOwnProperty(t) && (this[t] = e[t]);
									e.hasOwnProperty("toString") && (this.toString = e.toString);
								},
								clone: function () {
									return this.init.prototype.extend(this);
								},
							}),
							u = (c.WordArray = a.extend({
								init: function (e, t) {
									(e = this.words = e || []),
										(this.sigBytes = null != t ? t : 4 * e.length);
								},
								toString: function (e) {
									return (e || l).stringify(this);
								},
								concat: function (e) {
									var t = this.words,
										n = e.words,
										r = this.sigBytes,
										o = e.sigBytes;
									if ((this.clamp(), r % 4))
										for (var i = 0; i < o; i++)
											t[(r + i) >>> 2] |=
												((n[i >>> 2] >>> (24 - (i % 4) * 8)) & 255) <<
												(24 - ((r + i) % 4) * 8);
									else
										for (var s = 0; s < o; s += 4)
											t[(r + s) >>> 2] = n[s >>> 2];
									return (this.sigBytes += o), this;
								},
								clamp: function () {
									var t = this.words,
										n = this.sigBytes;
									(t[n >>> 2] &= 4294967295 << (32 - (n % 4) * 8)),
										(t.length = e.ceil(n / 4));
								},
								clone: function () {
									var e = a.clone.call(this);
									return (e.words = this.words.slice(0)), e;
								},
								random: function (e) {
									for (var t = [], n = 0; n < e; n += 4) t.push(r());
									return new u.init(t, e);
								},
							})),
							f = (i.enc = {}),
							l = (f.Hex = {
								stringify: function (e) {
									for (
										var t = e.words, n = e.sigBytes, r = [], o = 0;
										o < n;
										o++
									) {
										var i = (t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255;
										r.push((i >>> 4).toString(16)),
											r.push((15 & i).toString(16));
									}
									return r.join("");
								},
								parse: function (e) {
									for (var t = e.length, n = [], r = 0; r < t; r += 2)
										n[r >>> 3] |=
											parseInt(e.substr(r, 2), 16) << (24 - (r % 8) * 4);
									return new u.init(n, t / 2);
								},
							}),
							d = (f.Latin1 = {
								stringify: function (e) {
									for (
										var t = e.words, n = e.sigBytes, r = [], o = 0;
										o < n;
										o++
									)
										r.push(
											String.fromCharCode(
												(t[o >>> 2] >>> (24 - (o % 4) * 8)) & 255,
											),
										);
									return r.join("");
								},
								parse: function (e) {
									for (var t = e.length, n = [], r = 0; r < t; r++)
										n[r >>> 2] |= (255 & e.charCodeAt(r)) << (24 - (r % 4) * 8);
									return new u.init(n, t);
								},
							}),
							h = (f.Utf8 = {
								stringify: function (e) {
									try {
										return decodeURIComponent(escape(d.stringify(e)));
									} catch (e) {
										throw new Error("Malformed UTF-8 data");
									}
								},
								parse: function (e) {
									return d.parse(unescape(encodeURIComponent(e)));
								},
							}),
							p = (c.BufferedBlockAlgorithm = a.extend({
								reset: function () {
									(this._data = new u.init()), (this._nDataBytes = 0);
								},
								_append: function (e) {
									"string" == typeof e && (e = h.parse(e)),
										this._data.concat(e),
										(this._nDataBytes += e.sigBytes);
								},
								_process: function (t) {
									var n,
										r = this._data,
										o = r.words,
										i = r.sigBytes,
										s = this.blockSize,
										c = i / (4 * s),
										a =
											(c = t
												? e.ceil(c)
												: e.max((0 | c) - this._minBufferSize, 0)) * s,
										f = e.min(4 * a, i);
									if (a) {
										for (var l = 0; l < a; l += s) this._doProcessBlock(o, l);
										(n = o.splice(0, a)), (r.sigBytes -= f);
									}
									return new u.init(n, f);
								},
								clone: function () {
									var e = a.clone.call(this);
									return (e._data = this._data.clone()), e;
								},
								_minBufferSize: 0,
							}));
						c.Hasher = p.extend({
							cfg: a.extend(),
							init: function (e) {
								(this.cfg = this.cfg.extend(e)), this.reset();
							},
							reset: function () {
								p.reset.call(this), this._doReset();
							},
							update: function (e) {
								return this._append(e), this._process(), this;
							},
							finalize: function (e) {
								return e && this._append(e), this._doFinalize();
							},
							blockSize: 16,
							_createHelper: function (e) {
								return function (t, n) {
									return new e.init(n).finalize(t);
								};
							},
							_createHmacHelper: function (e) {
								return function (t, n) {
									return new v.HMAC.init(e, n).finalize(t);
								};
							},
						});
						var v = (i.algo = {});
						return i;
					})(Math)),
				n);
		}),
		F = c(function (e, t) {
			var n;
			e.exports =
				((n = _),
				(function (e) {
					var t = n,
						r = t.lib,
						o = r.WordArray,
						i = r.Hasher,
						s = t.algo,
						c = [],
						a = [];
					!(function () {
						function t(t) {
							for (var n = e.sqrt(t), r = 2; r <= n; r++)
								if (!(t % r)) return !1;
							return !0;
						}
						function n(e) {
							return (4294967296 * (e - (0 | e))) | 0;
						}
						for (var r = 2, o = 0; o < 64; )
							t(r) &&
								(o < 8 && (c[o] = n(e.pow(r, 0.5))),
								(a[o] = n(e.pow(r, 1 / 3))),
								o++),
								r++;
					})();
					var u = [],
						f = (s.SHA256 = i.extend({
							_doReset: function () {
								this._hash = new o.init(c.slice(0));
							},
							_doProcessBlock: function (e, t) {
								for (
									var n = this._hash.words,
										r = n[0],
										o = n[1],
										i = n[2],
										s = n[3],
										c = n[4],
										f = n[5],
										l = n[6],
										d = n[7],
										h = 0;
									h < 64;
									h++
								) {
									if (h < 16) u[h] = 0 | e[t + h];
									else {
										var p = u[h - 15],
											v = u[h - 2];
										u[h] =
											(((p << 25) | (p >>> 7)) ^
												((p << 14) | (p >>> 18)) ^
												(p >>> 3)) +
											u[h - 7] +
											(((v << 15) | (v >>> 17)) ^
												((v << 13) | (v >>> 19)) ^
												(v >>> 10)) +
											u[h - 16];
									}
									var y = (r & o) ^ (r & i) ^ (o & i),
										m =
											d +
											(((c << 26) | (c >>> 6)) ^
												((c << 21) | (c >>> 11)) ^
												((c << 7) | (c >>> 25))) +
											((c & f) ^ (~c & l)) +
											a[h] +
											u[h];
									(d = l),
										(l = f),
										(f = c),
										(c = (s + m) | 0),
										(s = i),
										(i = o),
										(o = r),
										(r =
											(m +
												((((r << 30) | (r >>> 2)) ^
													((r << 19) | (r >>> 13)) ^
													((r << 10) | (r >>> 22))) +
													y)) |
											0);
								}
								(n[0] = (n[0] + r) | 0),
									(n[1] = (n[1] + o) | 0),
									(n[2] = (n[2] + i) | 0),
									(n[3] = (n[3] + s) | 0),
									(n[4] = (n[4] + c) | 0),
									(n[5] = (n[5] + f) | 0),
									(n[6] = (n[6] + l) | 0),
									(n[7] = (n[7] + d) | 0);
							},
							_doFinalize: function () {
								var t = this._data,
									n = t.words,
									r = 8 * this._nDataBytes,
									o = 8 * t.sigBytes;
								return (
									(n[o >>> 5] |= 128 << (24 - (o % 32))),
									(n[14 + (((o + 64) >>> 9) << 4)] = e.floor(r / 4294967296)),
									(n[15 + (((o + 64) >>> 9) << 4)] = r),
									(t.sigBytes = 4 * n.length),
									this._process(),
									this._hash
								);
							},
							clone: function () {
								var e = i.clone.call(this);
								return (e._hash = this._hash.clone()), e;
							},
						}));
					(t.SHA256 = i._createHelper(f)),
						(t.HmacSHA256 = i._createHmacHelper(f));
				})(Math),
				n.SHA256);
		}),
		P = c(function (e, t) {
			var n, r;
			e.exports =
				((r = (n = _).lib.WordArray),
				(n.enc.Base64 = {
					stringify: function (e) {
						var t = e.words,
							n = e.sigBytes,
							r = this._map;
						e.clamp();
						for (var o = [], i = 0; i < n; i += 3)
							for (
								var s =
										(((t[i >>> 2] >>> (24 - (i % 4) * 8)) & 255) << 16) |
										(((t[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 255) <<
											8) |
										((t[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 255),
									c = 0;
								c < 4 && i + 0.75 * c < n;
								c++
							)
								o.push(r.charAt((s >>> (6 * (3 - c))) & 63));
						var a = r.charAt(64);
						if (a) for (; o.length % 4; ) o.push(a);
						return o.join("");
					},
					parse: function (e) {
						var t = e.length,
							n = this._map,
							o = this._reverseMap;
						if (!o) {
							o = this._reverseMap = [];
							for (var i = 0; i < n.length; i++) o[n.charCodeAt(i)] = i;
						}
						var s = n.charAt(64);
						if (s) {
							var c = e.indexOf(s);
							-1 !== c && (t = c);
						}
						return (function (e, t, n) {
							for (var o = [], i = 0, s = 0; s < t; s++)
								if (s % 4) {
									var c = n[e.charCodeAt(s - 1)] << ((s % 4) * 2),
										a = n[e.charCodeAt(s)] >>> (6 - (s % 4) * 2);
									(o[i >>> 2] |= (c | a) << (24 - (i % 4) * 8)), i++;
								}
							return r.create(o, i);
						})(e, t, o);
					},
					_map: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
				}),
				n.enc.Base64);
		}),
		S = ["authentication", "rpcVersion"];
	function k(e, t) {
		try {
			var n = e();
		} catch (e) {
			return t(e);
		}
		return n && n.then ? n.then(void 0, t) : n;
	}
	var x = p("obs-websocket-js"),
		O = /*#__PURE__*/ (function (e) {
			function n(t, n) {
				var r;
				return ((r = e.call(this, n) || this).code = void 0), (r.code = t), r;
			}
			return t(n, e), n;
		})(/*#__PURE__*/ i(Error)),
		j = /*#__PURE__*/ (function (n) {
			function r() {
				for (var e, t = arguments.length, r = new Array(t), o = 0; o < t; o++)
					r[o] = arguments[o];
				return (
					((e = n.call.apply(n, [this].concat(r)) || this)._identified = !1),
					(e.internalListeners = new v()),
					(e.socket = void 0),
					e
				);
			}
			t(r, n),
				(r.generateMessageId = function () {
					return String(r.requestCounter++);
				});
			var o,
				i,
				s = r.prototype;
			return (
				(s.connect = function (e, t, n) {
					void 0 === e && (e = "ws://127.0.0.1:4455"), void 0 === n && (n = {});
					try {
						var r = function () {
								return k(
									function () {
										var r = o.internalEventPromise("ConnectionClosed"),
											i = o.internalEventPromise("ConnectionError");
										return Promise.resolve(
											Promise.race([
												(function () {
													try {
														return Promise.resolve(o.createConnection(e)).then(
															function (e) {
																return o.emit("Hello", e), o.identify(e, t, n);
															},
														);
													} catch (e) {
														return Promise.reject(e);
													}
												})(),
												new Promise(function (e, t) {
													i.then(function (e) {
														e.message && t(e);
													}),
														r.then(function (e) {
															t(e);
														});
												}),
											]),
										);
									},
									function (e) {
										return Promise.resolve(o.disconnect()).then(function () {
											throw e;
										});
									},
								);
							},
							o = this,
							i = (function () {
								if (o.socket)
									return Promise.resolve(o.disconnect()).then(function () {});
							})();
						return Promise.resolve(i && i.then ? i.then(r) : r());
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.disconnect = function () {
					try {
						var e = this;
						if (!e.socket || e.socket.readyState === w.CLOSED)
							return Promise.resolve();
						var t = e.internalEventPromise("ConnectionClosed");
						return e.socket.close(), Promise.resolve(t).then(function () {});
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.reidentify = function (e) {
					try {
						var t = this.internalEventPromise("op:" + m.Identified);
						return Promise.resolve(this.message(m.Reidentify, e)).then(
							function () {
								return t;
							},
						);
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.call = function (e, t) {
					try {
						var n = r.generateMessageId(),
							o = this.internalEventPromise("res:" + n);
						return Promise.resolve(
							this.message(m.Request, {
								requestId: n,
								requestType: e,
								requestData: t,
							}),
						).then(function () {
							return Promise.resolve(o).then(function (e) {
								var t = e.requestStatus,
									n = e.responseData;
								if (!t.result) throw new O(t.code, t.comment);
								return n;
							});
						});
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.callBatch = function (t, n) {
					void 0 === n && (n = {});
					try {
						var o = r.generateMessageId(),
							i = this.internalEventPromise("res:" + o);
						return Promise.resolve(
							this.message(m.RequestBatch, e({ requestId: o, requests: t }, n)),
						).then(function () {
							return Promise.resolve(i).then(function (e) {
								return e.results;
							});
						});
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.cleanup = function () {
					this.socket &&
						((this.socket.onopen = null),
						(this.socket.onmessage = null),
						(this.socket.onerror = null),
						(this.socket.onclose = null),
						(this.socket = void 0),
						(this._identified = !1),
						this.internalListeners.removeAllListeners());
				}),
				(s.createConnection = function (e) {
					try {
						var t = this,
							n = t.internalEventPromise("ConnectionOpened"),
							r = t.internalEventPromise("op:" + m.Hello);
						return (
							(t.socket = new w(e, t.protocol)),
							(t.socket.onopen = t.onOpen.bind(t)),
							(t.socket.onmessage = t.onMessage.bind(t)),
							(t.socket.onerror = t.onError.bind(t)),
							(t.socket.onclose = t.onClose.bind(t)),
							Promise.resolve(n).then(function () {
								var e,
									n = null == (e = t.socket) ? void 0 : e.protocol;
								if (!n) throw new O(-1, "Server sent no subprotocol");
								if (n !== t.protocol)
									throw new O(-1, "Server sent an invalid subprotocol");
								return r;
							})
						);
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.identify = function (t, n, r) {
					var o,
						i,
						s = t.authentication,
						c = t.rpcVersion,
						a = (function (e, t) {
							if (null == e) return {};
							var n,
								r,
								o = {},
								i = Object.keys(e);
							for (r = 0; r < i.length; r++)
								t.indexOf((n = i[r])) >= 0 || (o[n] = e[n]);
							return o;
						})(t, S);
					void 0 === r && (r = {});
					try {
						var u = this,
							f = e({ rpcVersion: c }, r);
						s &&
							n &&
							(f.authentication =
								((o = s.challenge),
								(i = P.stringify(F(n + s.salt))),
								P.stringify(F(i + o))));
						var l = u.internalEventPromise("op:" + m.Identified);
						return Promise.resolve(u.message(m.Identify, f)).then(function () {
							return Promise.resolve(l).then(function (t) {
								return (
									(u._identified = !0),
									u.emit("Identified", t),
									e({ rpcVersion: c }, a, t)
								);
							});
						});
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.message = function (e, t) {
					try {
						var n = this;
						if (!n.socket) throw new Error("Not connected");
						if (!n.identified && 1 !== e)
							throw new Error("Socket not identified");
						return Promise.resolve(n.encodeMessage({ op: e, d: t })).then(
							function (e) {
								n.socket.send(e);
							},
						);
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.internalEventPromise = function (e) {
					try {
						var t = this;
						return Promise.resolve(
							new Promise(function (n) {
								t.internalListeners.once(e, n);
							}),
						);
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.onOpen = function (e) {
					x("socket.open"),
						this.emit("ConnectionOpened"),
						this.internalListeners.emit("ConnectionOpened", e);
				}),
				(s.onMessage = function (e) {
					try {
						var t = this;
						return Promise.resolve(
							k(
								function () {
									return Promise.resolve(t.decodeMessage(e.data)).then(
										function (e) {
											var n = e.op,
												r = e.d;
											if (
												(x("socket.message: %d %j", n, r),
												void 0 !== n && void 0 !== r)
											)
												switch (n) {
													case m.Event:
														return void t.emit(r.eventType, r.eventData);
													case m.RequestResponse:
													case m.RequestBatchResponse:
														return void t.internalListeners.emit(
															"res:" + r.requestId,
															r,
														);
													default:
														t.internalListeners.emit("op:" + n, r);
												}
										},
									);
								},
								function (e) {
									x("error handling message: %o", e);
								},
							),
						);
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(s.onError = function (e) {
					x("socket.error: %o", e);
					var t = new O(-1, e.message);
					this.emit("ConnectionError", t),
						this.internalListeners.emit("ConnectionError", t);
				}),
				(s.onClose = function (e) {
					x("socket.close: %s (%d)", e.reason, e.code);
					var t = new O(e.code, e.reason);
					this.emit("ConnectionClosed", t),
						this.internalListeners.emit("ConnectionClosed", t),
						this.cleanup();
				}),
				(o = r),
				(i = [
					{
						key: "identified",
						get: function () {
							return this._identified;
						},
					},
				]) &&
					(function (e, t) {
						for (var n = 0; n < t.length; n++) {
							var r = t[n];
							(r.enumerable = r.enumerable || !1),
								(r.configurable = !0),
								"value" in r && (r.writable = !0),
								Object.defineProperty(
									e,
									"symbol" ==
										typeof (o = (function (e, t) {
											if ("object" != typeof e || null === e) return e;
											var n = e[Symbol.toPrimitive];
											if (void 0 !== n) {
												var r = n.call(e, "string");
												if ("object" != typeof r) return r;
												throw new TypeError(
													"@@toPrimitive must return a primitive value.",
												);
											}
											return String(e);
										})(r.key))
										? o
										: String(o),
									r,
								);
						}
						var o;
					})(o.prototype, i),
				Object.defineProperty(o, "prototype", { writable: !1 }),
				r
			);
		})(v);
	(j.requestCounter = 1),
		"undefined" != typeof exports &&
			Object.defineProperty(exports, "__esModule", { value: !0 });
	var E = /*#__PURE__*/ (function (e) {
			function n() {
				for (var t, n = arguments.length, r = new Array(n), o = 0; o < n; o++)
					r[o] = arguments[o];
				return (
					((t = e.call.apply(e, [this].concat(r)) || this).protocol =
						"obswebsocket.json"),
					t
				);
			}
			t(n, e);
			var r = n.prototype;
			return (
				(r.encodeMessage = function (e) {
					try {
						return Promise.resolve(JSON.stringify(e));
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				(r.decodeMessage = function (e) {
					try {
						return Promise.resolve(JSON.parse(e));
					} catch (e) {
						return Promise.reject(e);
					}
				}),
				n
			);
		})(j),
		I = /*#__PURE__*/ (function (e) {
			function n() {
				return e.apply(this, arguments) || this;
			}
			return t(n, e), n;
		})(E);
	return (
		(I.OBSWebSocketError = O),
		(I.WebSocketOpCode = m),
		(I.EventSubscription = g),
		(I.RequestBatchExecutionType = C),
		I
	);
})();
