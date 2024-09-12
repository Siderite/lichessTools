(() => {
	class CopyPgnCommandTool extends LiChessTools.Tools.ToolBase {
		dependencies = ["ExportPGN", "CliCommands"];

		preferences = [
			{
				name: "copyPgnCommand",
				category: "command",
				type: "single",
				possibleValues: [false, true],
				defaultValue: true,
				advanced: true,
				hidden: true,
				offValue: false,
			},
		];

		intl = {
			"en-US": {
				"options.copyPgnCommand": "Command: Copy moves to clipboard",
				"copyPgnCommand.helpText":
					'/copypgn ["fen"] ["separate"] ["tohere"] ["unicode"]\r\n fen: from current position\r\n separate: separate branches\r\n tohere: to current position\r\n unicode: unicode piece characters\r\nCopy moves to clipboard',
			},
			"ro-RO": {
				"options.copyPgnCommand":
					"Comand\u0103: Copiaz\u0103 mut\u0103ri \u00een clipboard",
				"copyPgnCommand.helpText":
					'/copypgn ["fen"] ["separate"] ["tohere"] ["unicode"]\r\n fen: de la posi\u0163ia curent\u0103\r\n separate: separ\u0103 varia\u0163iunile\r\ntohere: p\u00e2n\u0103 la posi\u0163ia curent\u0103unicode: caractere unicod ca piese\r\nCopiaz\u0103 mut\u0103ri \u00een clipboard',
			},
		};

		copyPgn = async (commandText) => {
			const parent = this.lichessTools;
			const lichess = parent.lichess;
			const analysis = lichess.analysis;
			if (!analysis) return;
			const options = {
				fromPosition: /\bfen\b/.test(commandText),
				separateLines: /\bseparate\b/.test(commandText),
				toPosition: /\btohere\b/.test(commandText),
				unicode: /\bunicode\b/.test(commandText),
				path: analysis.path,
			};

			parent.exportPgn(options.path, {
				copyToClipboard: true,
				fromPosition: options.fromPosition,
				separateLines: options.separateLines,
				toPosition: options.toPosition,
				unicode: options.unicode,
			});
		};

		async start() {
			const parent = this.lichessTools;
			const $ = parent.$;
			const trans = parent.translator;
			const value = parent.currentOptions.getValue("copyPgnCommand");
			this.options = { enabled: value };
			this.logOption("Command - copy PGN", value);
			const lichess = parent.lichess;
			const analysis = lichess.analysis;
			if (value && analysis) {
				parent.registerCommand &&
					parent.registerCommand("copyPgnCommand", {
						handle: (val) => {
							if (val?.startsWith("copypgn")) {
								this.copyPgn(val, analysis.path);
								return true;
							}
						},
						getHelp: () => trans.noarg("copyPgnCommand.helpText"),
					});
			} else {
				parent.unregisterCommand && parent.unregisterCommand("copyPgnCommand");
			}
		}
	}
	LiChessTools.Tools.CopyPgnCommand = CopyPgnCommandTool;
})();
