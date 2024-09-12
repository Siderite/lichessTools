(() => {
	class OpeningExplorerUsersTool extends LiChessTools.Tools.ToolBase {
		dependencies = ["EmitRedraw"];

		preferences = [
			{
				name: "openingExplorerUsers",
				category: "analysis",
				type: "multiple",
				possibleValues: ["switchWithMe"],
				defaultValue: "switchWithMe",
				advanced: true,
				needsLogin: true,
			},
		];

		intl = {
			"en-US": {
				"options.analysis": "Analysis",
				"options.openingExplorerUsers": "Opening explorer player features",
				switchWithMe: "Me",
				switchWithMeTitle: "LiChess Tools - Switch player with yourself",
				"openingExplorerUsers.switchWithMe":
					"Me button to switch to your player",
			},
			"ro-RO": {
				"options.analysis": "Analiz\u0103",
				"options.openingExplorerUsers":
					"Facilit\u0103\u0163i pentru juc\u0103tori \u00een Explorator",
				switchWithMe: "Eu",
				switchWithMeTitle:
					"LiChess Tools - Schimb\u0103 juc\u0103torul cu tine",
				"openingExplorerUsers.switchWithMe":
					"Buton Eu pentru selec\u0163ie rapid\u0103",
			},
		};

		addOpeningExplorerUserSwitchButton = () => {
			const parent = this.lichessTools;
			const $ = parent.$;
			const lichess = parent.lichess;
			const explorer = lichess.analysis?.explorer;
			const trans = parent.translator;
			if (!explorer) return;
			let previousUsers = parent.jsonParse(
				(_) => lichess.storage.get("explorer.player.name.previous"),
				[],
			);
			if (previousUsers.length <= 0) {
				$("div.explorer-title button.lichessTools-switchWithMe").remove();
				return;
			}
			if ($("div.explorer-title button.lichessTools-switchWithMe").length)
				return;
			const translatedText = trans.noarg("switchWithMe");
			const translatedTitle = trans.noarg("switchWithMeTitle");
			$('<button class="button-link"/>')
				.text(translatedText)
				.attr("title", translatedTitle)
				.addClass("lichessTools-switchWithMe")
				.on("click", function (ev) {
					ev.preventDefault();
					let previousUsers = parent.jsonParse(
						(_) => lichess.storage.get("explorer.player.name.previous"),
						[],
					);
					const myName = explorer.config.myName;
					const currentUser = explorer.config.data.playerName.value();
					const user = currentUser != myName ? myName : previousUsers[0];
					if (user) {
						explorer.config.selectPlayer(user);
						explorer.reload();
					}
				})
				.appendTo("div.explorer-title");
		};

		async start() {
			const parent = this.lichessTools;
			const value = parent.currentOptions.getValue("openingExplorerUsers");
			this.logOption("Opening explorer player features", value);
			if (!parent.getUserId()) {
				parent.global.console.debug(" ... Disabled (not logged in)");
				return;
			}
			const lichess = parent.lichess;
			const analysis = lichess?.analysis;
			if (!analysis) return;
			const $ = parent.$;
			$("div.explorer-title button.lichessTools-switchWithMe").remove();
			lichess.pubsub.off(
				"lichessTools.redraw",
				this.addOpeningExplorerUserSwitchButton,
			);
			if (parent.isOptionSet(value, "switchWithMe")) {
				lichess.pubsub.on(
					"lichessTools.redraw",
					this.addOpeningExplorerUserSwitchButton,
				);
				this.addOpeningExplorerUserSwitchButton();
			}
		}
	}
	LiChessTools.Tools.OpeningExplorerUsers = OpeningExplorerUsersTool;
})();
