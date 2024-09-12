(() => {
	class ExpandAllTool extends LiChessTools.Tools.ToolBase {
		dependencies = ["EmitRedraw"];

		preferences = [
			{
				name: "expandAll",
				category: "analysis",
				type: "multiple",
				possibleValues: ["showButton", "autoExpand"],
				defaultValue: false,
				advanced: true,
			},
		];

		intl = {
			"en-US": {
				"options.analysis": "Analysis",
				"options.expandAll": "Expand all variations",
				"expandAll.showButton": "Show button",
				"expandAll.autoExpand": "Auto expand",
				expandAllTitle: "LiChess Tools - expand all variations",
			},
			"ro-RO": {
				"options.analysis": "Analiz\u0103",
				"options.expandAll": "Expandare toate varia\u0163iunile",
				"expandAll.showButton": "Arat\u0103 butonul",
				"expandAll.autoExpand": "Expandeaz\u0103 automat",
				expandAllTitle:
					"LiChess Tools - expandeaz\u0103 toate varia\u0163iunile",
			},
		};

		addExpandAllButton = () => {
			const parent = this.lichessTools;
			const $ = parent.$;
			const trans = parent.translator;
			let button = $("button.lichessTools-expandAll");
			if ($(".tview2 line.expand").length) {
				if (button.length) return;
			} else {
				button.remove();
				return;
			}
			button = $('<button type="button" class="lichessTools-expandAll">')
				.attr("data-icon", "\uE02F")
				.attr("title", trans.noarg("expandAllTitle"))
				.on("mousedown touchstart", (ev) => {
					ev.preventDefault();
					ev.stopPropagation();
					this.expandAll();
				})
				.insertBefore($("index.sbhint1").eq(0));
		};

		expandAll = () => {
			const parent = this.lichessTools;
			const $ = parent.$;
			const analysis = parent.lichess.analysis;
			analysis.setAllCollapsed("", false);
			$("button.lichessTools-expandAll").remove();
		};

		autoExpand = () => {
			const parent = this.lichessTools;
			const $ = parent.$;
			const analysis = parent.lichess.analysis;
			const tview2 = $(".tview2")[0];
			if (!tview2) return;
			const autoExpanded = analysis.tree.root;
			if (tview2.autoExpanded !== autoExpanded) {
				this.expandAll();
			}
			tview2.autoExpanded = autoExpanded;
		};

		async start() {
			const parent = this.lichessTools;
			const value = parent.currentOptions.getValue("expandAll");
			this.logOption("Expand all", value);
			this.options = {
				showButton: parent.isOptionSet(value, "showButton"),
				autoExpand: parent.isOptionSet(value, "autoExpand"),
				get isSet() {
					return this.showButton || this.autoExpand;
				},
			};
			const lichess = parent.lichess;
			const $ = parent.$;
			const analysis = lichess?.analysis;
			if (!analysis) return;
			$("button.lichessTools-expandAll").remove();
			lichess.pubsub.off("lichessTools.redraw", this.addExpandAllButton);
			lichess.pubsub.off("lichessTools.redraw", this.autoExpand);
			if (this.options.showButton) {
				lichess.pubsub.on("lichessTools.redraw", this.addExpandAllButton);
				this.addExpandAllButton();
			}
			if (this.options.autoExpand) {
				lichess.pubsub.on("lichessTools.redraw", this.autoExpand);
				this.autoExpand();
			}
		}
	}
	LiChessTools.Tools.ExpandAll = ExpandAllTool;
})();
