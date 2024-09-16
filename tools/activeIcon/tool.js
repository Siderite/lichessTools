(() => {
	class ActiveIconTool extends LiChessTools.Tools.ToolBase {
		preferences = [
			{
				name: "activeIcon",
				category: "general",
				type: "single",
				possibleValues: [false, true],
				defaultValue: false,
				advanced: true,
			},
		];

		intl = {
			"en-US": {
				"options.general": "General",
				"options.activeIcon": "Active title icon",
			},
			"ro-RO": {
				"options.general": "General",
				"options.activeIcon": "Iconi\u0163\u0103 titlu activ\u0103",
			},
			"zh-TW": {
				"options.general": "主要",
				"options.activeIcon": "標題圖示",
			},
		};

		_iconCache = {};
		getIcon = (isBlack, isPlaying) => {
			const parent = this.lichessTools;
			const asset = parent.lichess.asset;
			let key = "";
			switch (isBlack) {
				case true:
					key += "b";
					break;
				case false:
					key += "w";
					break;
				default:
					key += " ";
					break;
			}
			key += isPlaying ? "p" : "n";
			let icon = this._iconCache[key];
			if (!icon) {
				icon = isPlaying
					? asset.url(
							isBlack ? "cursors/black-pawn.cur" : "cursors/white-pawn.cur",
						)
					: asset.flairSrc("activity.lichess");
				this._iconCache[key] = icon;
			}
			return icon;
		};

		setIcon = (isBlack, isPlaying) => {
			const parent = this.lichessTools;
			const $ = parent.$;
			if (!$("div.main-board").length) {
				isBlack = false;
				isPlaying = false;
			}
			if (isBlack === undefined) {
				const fen = parent.getPositionFromBoard($("div.main-board"), true);
				isBlack = / b\b/.test(fen);
			}
			if (isPlaying !== false) {
				isPlaying = !$(
					".result-wrap .result,.study__player .result,.game__meta .status",
				).length;
			}
			const icon = this.getIcon(isBlack, isPlaying);
			const elem = $("link[rel=icon][source=lichessTools]");
			const href = elem.attr("href");
			if (href != icon) elem.attr("href", icon);
		};

		handlePly = (ply) => {
			this.setIcon(ply % 2 == 1, true);
		};

		async start() {
			const parent = this.lichessTools;
			const lichess = parent.lichess;
			const $ = parent.$;
			const value = parent.currentOptions.getValue("activeIcon");
			this.logOption("Active icon", value);
			parent.global.clearInterval(this.interval);
			lichess.pubsub.off("ply", this.handlePly);
			$("link[rel=icon][source=lichessTools]").remove();
			$("link[rel=xicon]").attr("rel", "icon");

			if (!value) return;

			this.interval = parent.global.setInterval(this.setIcon, 1000);
			$("link[rel=icon]").attr("rel", "xicon");
			$('<link rel="icon" source="lichessTools">').appendTo("head");
			this.setIcon();
			lichess.pubsub.on("ply", this.handlePly);
		}
	}
	LiChessTools.Tools.ActiveIcon = ActiveIconTool;
})();
