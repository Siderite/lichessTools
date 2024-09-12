(() => {
	class CtrlSpaceForBestComputerMoveTool extends LiChessTools.Tools.ToolBase {
		preferences = [
			{
				name: "spaceDisabled",
				category: "analysis",
				type: "single",
				possibleValues: [false, true],
				defaultValue: true,
				advanced: true,
			},
		];

		intl = {
			"en-US": {
				"options.analysis": "Analysis",
				"options.spaceDisabled":
					"Ctrl-space to play best computer move instead of Space",
			},
			"ro-RO": {
				"options.analysis": "Analiz\u0103",
				"options.spaceDisabled":
					"Ctrl-space pentru a juca cea mai bun\u0103 mutare a computerului, nu Space",
			},
		};

		oldSpaceHandler = null;
		async start() {
			const parent = this.lichessTools;
			const value = parent.currentOptions.getValue("spaceDisabled");
			this.logOption("Ctrl-Space to play best computer move", value);
			if (!this.oldSpaceHandler) {
				this.oldSpaceHandler = parent.getKeyHandler("space");
				if (!this.oldSpaceHandler) return;
			}
			parent.unbindKeyHandler("space");
			parent.unbindKeyHandler("ctrl+space", true);
			if (value) {
				parent.bindKeyHandler("ctrl+space", this.oldSpaceHandler);
				parent.bindKeyHandler("space", this.spaceForGamebookPlay);
			} else {
				parent.bindKeyHandler("space", this.oldSpaceHandler, false);
			}
		}

		spaceForGamebookPlay = () => {
			const ctrl = this.lichessTools.lichess.analysis;
			if (!ctrl) return;
			const gb = ctrl.gamebookPlay();
			if (gb) gb.onSpace();
		};
	}
	LiChessTools.Tools.CtrlSpaceForBestComputerMove =
		CtrlSpaceForBestComputerMoveTool;
})();
