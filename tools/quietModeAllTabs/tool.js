(() => {
	class QuietModeAllTabsTool extends LiChessTools.Tools.ToolBase {
		preferences = [
			{
				name: "quietModeAllTabs",
				category: "play",
				type: "single",
				possibleValues: [false, true],
				defaultValue: true,
				advanced: true,
			},
		];

		intl = {
			"en-US": {
				"options.play": "Play",
				"options.quietModeAllTabs": "Quiet mode on all tabs",
				quietModeDisableText: "Disable quiet mode",
				quietModeEnableText: "Enable quiet mode",
				quietModeDisableTitle: "LiChess Tools - disable quiet mode",
				quietModeEnableTitle: "LiChess Tools - enable quiet mode",
			},
			"ro-RO": {
				"options.play": "Joc",
				"options.quietModeAllTabs": "Mod silen\u0163ios \u00een toate taburile",
				quietModeDisableText: "Opre\u015Fte mod silen\u0163ios",
				quietModeEnableText: "Porne\u015Fte mod silen\u0163ios",
				quietModeDisableTitle:
					"LiChess Tools - opre\u015Fte mod silen\u0163ios",
				quietModeEnableTitle:
					"LiChess Tools - porne\u015Fte mod silen\u0163ios",
			},
		};

		addQuietModeMenu = (isOpening) => {
			if (!isOpening) return;
			const parent = this.lichessTools;
			const lichess = parent.lichess;
			const $ = parent.$;
			const trans = parent.translator;
			const container = $("div.site-buttons div.dasher #dasher_app div.links");
			if (this.options.enabled) {
				if (!container.children().length) {
					parent.global.setTimeout(() => this.addQuietModeMenu(isOpening), 500);
					return;
				}
				let elem = $("a.lichessTools-quietMode", container);
				if (!elem.length) {
					elem = $('<a class="text lichessTools-quietMode">')
						.attr("data-icon", "\uE00F")
						.on("click", (ev) => {
							ev.preventDefault();
							lichess.forcedQuietMode = !lichess.quietMode;
							if (lichess.quietMode && !lichess.forcedQuietMode)
								lichess.quietMode = false;
							this.addQuietModeMenu(true);
						})
						.appendTo(container);
				}
				const text = lichess.quietMode
					? trans.noarg("quietModeDisableText")
					: trans.noarg("quietModeEnableText");
				const title = lichess.quietMode
					? trans.noarg("quietModeDisableTitle")
					: trans.noarg("quietModeEnableTitle");
				elem
					.text(text)
					.attr("title", title)
					.toggleClass("lichessTools-forcedQuietMode", !!lichess.quietMode);
			} else {
				$("a.lichessTools-quietMode", container).remove();
			}
		};

		async start() {
			const parent = this.lichessTools;
			const value = parent.currentOptions.getValue("quietModeAllTabs");
			this.logOption("Quiet mode all tabs", value);
			this.options = {
				enabled: value,
			};
			const lichess = parent.lichess;
			const descriptor = Object.getOwnPropertyDescriptor(lichess, "quietMode");
			const isProperty = descriptor?.get && descriptor?.set;
			lichess.pubsub.off("dasher.toggle", this.addQuietModeMenu);
			if (!value) {
				if (isProperty) {
					delete lichess.quietMode;
					delete lichess.forcedQuietMode;
					lichess.quietMode = false;
				}
				return;
			}
			lichess.pubsub.on("dasher.toggle", this.addQuietModeMenu);
			if (!isProperty) {
				const quietMode = lichess.quietMode;
				Object.defineProperty(lichess, "forcedQuietMode", {
					configurable: true,
					get: function () {
						return this.storage.get("LichessTools.forcedQuietMode") == "true";
					},
					set: function (val) {
						this.storage.set("LichessTools.forcedQuietMode", `${!!val}`);
					},
				});
				Object.defineProperty(lichess, "quietMode", {
					configurable: true,
					get: function () {
						if (this.forcedQuietMode) return true;
						return this.storage.get("LichessTools.quietMode") == "true";
					},
					set: function (val) {
						this.storage.set("LichessTools.quietMode", `${!!val}`);
					},
				});
				if (quietMode) lichess.quietMode = true;
			}
		}
	}
	LiChessTools.Tools.QuietModeAllTabs = QuietModeAllTabsTool;
})();
