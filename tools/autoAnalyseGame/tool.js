(() => {
	class AutoAnalyseGameTool extends LiChessTools.Tools.ToolBase {
		preferences = [
			{
				name: "autoAnalyseGame",
				category: "play",
				type: "single",
				possibleValues: [false, true],
				defaultValue: false,
				advanced: true,
			},
		];

		intl = {
			"en-US": {
				"options.play": "Play",
				"options.autoAnalyseGame": "Go to Analysis on game end",
			},
			"ro-RO": {
				"options.play": "Joc",
				"options.autoAnalyseGame":
					"Intr\u0103 \u00een Analiz\u0103 c\u00e2nd se termin\u0103 jocul",
			},
			"zh-TW": {
				"options.play": "下棋",
				"options.autoAnalyseGame": "在棋局結束後前往「棋局分析」",
			},
		};

		retries = 0;
		checkEndGame = () => {
			const parent = this.lichessTools;
			const $ = parent.$;
			if (!$("body").is(".playing")) {
				this.retries = 0;
				return;
			}
			if (!$(".result-wrap .result").length) {
				if (this.retries < 8) {
					parent.global.setTimeout(this.checkEndGame, 500);
					this.retries++;
				}
				return;
			}
			this.retries = 0;
			const href = $("a.fbt.analysis").attr("href");
			if (!href) return;
			parent.global.location.href = href;
		};

		async start() {
			const parent = this.lichessTools;
			const lichess = parent.lichess;
			const $ = parent.$;
			const value = parent.currentOptions.getValue("autoAnalyseGame");
			this.logOption("Auto analyse game", value);
			lichess.pubsub.off("socket.in.endData", this.checkEndGame);
			this.retries = 0;
			if (!value) return;
			if (!$("main").is(".round")) return;
			lichess.pubsub.on("socket.in.endData", this.checkEndGame);
		}
	}
	LiChessTools.Tools.AutoAnalyseGame = AutoAnalyseGameTool;
})();
