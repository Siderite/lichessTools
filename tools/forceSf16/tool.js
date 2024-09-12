(() => {
	class ForceSf16Tool extends LiChessTools.Tools.ToolBase {
		preferences = [
			{
				name: "forceSf16",
				category: "analysis",
				type: "single",
				possibleValues: [false, true],
				defaultValue: false,
				advanced: true,
			},
		];

		intl = {
			"en-US": {
				"options.analysis": "Analysis",
				"options.forceSf16": "Force add Stockfish 16",
			},
			"ro-RO": {
				"options.analysis": "Analiz\u0103",
				"options.forceSf16": "Adaug\u0103 for\u0163at Stockfish 16",
			},
		};

		async start() {
			const parent = this.lichessTools;
			const value = parent.currentOptions.getValue("forceSf16");
			this.logOption("Force SF16", value);
			const lichess = parent.lichess;
			const $ = parent.$;
			const key = "ceval.lsfw.forceEnable";
			const currentValue = lichess.storage.get(key);
			const newValue = (!!value).toString();
			if (currentValue !== newValue) {
				lichess.storage.set(key, newValue);
			}
		}
	}
	LiChessTools.Tools.ForceSf16 = ForceSf16Tool;
})();
