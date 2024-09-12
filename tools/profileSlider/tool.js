(() => {
	class ProfileSliderTool extends LiChessTools.Tools.ToolBase {
		preferences = [
			{
				name: "profileSlider",
				category: "general",
				type: "multiple",
				possibleValues: ["showText", "add1w", "fixSize"],
				defaultValue: "showText,add1w,fixSize",
				advanced: true,
			},
		];

		intl = {
			"en-US": {
				"options.general": "General",
				"options.profileSlider": "Profile slider options",
				"profileSlider.showText": "Show dates",
				"profileSlider.add1w": "Add 1W filter",
				"profileSlider.fixSize": "Fix small intervals",
				sliderLabelTitle: "LiChess Tools - Profile slider options",
				button1wTitle: "LiChess Tools - one week",
			},
			"ro-RO": {
				"options.general": "General",
				"options.profileSlider": "Op\u0163iuni pentru slider-ul din Profil",
				"profileSlider.showText": "Arat\u0103 datele",
				"profileSlider.add1w": "Adaug\u0103 filtru 1W",
				"profileSlider.fixSize": "Repar\u0103 intervale mici",
				sliderLabelTitle:
					"LiChess Tools - op\u0163iuni pentru slider-ul din Profil",
				button1wTitle: "LiChess Tools - o s\u0103pt\u0103m\u00e2n\u0103",
			},
		};

		updateSlider = (ev) => {
			if (!this.options.showText) return;
			const start = new Date(+ev[0]).toDateString().substr(4);
			const end = new Date(+ev[1]).toDateString().substr(4);
			$(".time-selector-buttons label.lichessTools-profileSliderText")
				.empty()
				.append($("<span>").text(start))
				.append("<span> - </span>")
				.append($("<span>").text(end));
		};

		setSlider = (ev) => {
			if (!this.options.fixSize) return;
			if (this._setSlider) return;
			const parent = this.lichessTools;
			const $ = parent.$;
			const uiSlider = this.uiSlider;
			const [currentStart, currentEnd] = uiSlider.get().map((x) => parseInt(x));
			const { min: rangeStart, max: rangeEnd } = uiSlider.options.range;
			let newRangeStart = currentEnd - (currentEnd - currentStart) * 10;
			let newRangeEnd = currentStart + (currentEnd - currentStart) * 10;
			if (newRangeStart < this.rangeStart) {
				newRangeStart = this.rangeStart;
			}
			if (newRangeEnd > this.rangeEnd) {
				newRangeEnd = this.rangeEnd;
			}
			if (
				uiSlider.options.range.min != newRangeStart ||
				uiSlider.options.range.max != newRangeEnd
			) {
				uiSlider.options.range = { min: newRangeStart, max: newRangeEnd };
				uiSlider.options.start = [currentStart, currentEnd];
				try {
					this._setSlider = true;
					uiSlider.updateOptions(uiSlider.options);
				} finally {
					this._setSlider = false;
				}
			}
			$(uiSlider.target)
				.toggleClass(
					"lichessTools-moreToTheLeft",
					uiSlider.options.range.min > this.rangeStart,
				)
				.toggleClass(
					"lichessTools-moreToTheRight",
					uiSlider.options.range.max < this.rangeEnd,
				);
		};

		restoreFullRange = (ev) => {
			const uiSlider = this.uiSlider;
			if (!uiSlider) return;
			ev.preventDefault();
			uiSlider.options.range = { min: this.rangeStart, max: this.rangeEnd };
			uiSlider.options.start = [this.rangeStart, this.rangeEnd];
			uiSlider.options.animate = false;
			uiSlider.updateOptions(uiSlider.options);
		};

		check1wActive = () => {
			const uiSlider = this.uiSlider;
			if (!uiSlider) return;
			const parent = this.lichessTools;
			const $ = parent.$;
			const newValues = [this.rangeEnd - 7 * 86400000, this.rangeEnd];
			const current = uiSlider.get();
			const isActive = newValues[0] == current[0] && newValues[1] == current[1];
			$(".time-selector-buttons button.lichessTools-1w").toggleClass(
				"active",
				isActive,
			);
		};

		async start() {
			const parent = this.lichessTools;
			const $ = parent.$;
			const trans = parent.translator;
			const value = parent.currentOptions.getValue("profileSlider");
			this.logOption("Slider dates", value);
			this.options = {
				showText: parent.isOptionSet(value, "showText"),
				add1w: parent.isOptionSet(value, "add1w"),
				fixSize: parent.isOptionSet(value, "fixSize"),
			};
			const slider = $("#time-range-slider");
			const uiSlider = $("#time-range-slider")[0]?.noUiSlider;
			if (!uiSlider) return;
			if (!this.rangeStart) {
				this.rangeStart = uiSlider.options.range.min;
				this.rangeEnd = uiSlider.options.range.max;
			}
			this.uiSlider = uiSlider;
			$(
				".time-selector-buttons label.lichessTools-profileSliderText,.time-selector-buttons button.lichessTools-1w",
			).remove();
			$(".time-selector-buttons button:nth-last-of-type(1)").off(
				"mousedown",
				this.restoreFullRange,
			);
			uiSlider.off(".lichessTools");
			if (this.options.showText) {
				$('<label class="lichessTools-profileSliderText">')
					.attr("title", trans.noarg("sliderLabelTitle"))
					.appendTo(".time-selector-buttons");
				uiSlider.on("update.lichessTools", this.updateSlider);
				this.updateSlider(uiSlider.get());
			}
			if (this.options.fixSize) {
				uiSlider.on("set.lichessTools", this.setSlider);
				this.setSlider();
				$(".time-selector-buttons button:not(.lichessTools-1w)").on(
					"mousedown",
					this.restoreFullRange,
				);
			}
			if (this.options.add1w) {
				$('<button class="btn-rack__btn lichessTools-1w">')
					.text("1w")
					.attr("title", trans.noarg("button1wTitle"))
					.prependTo(".time-selector-buttons")
					.on("mousedown", (ev) => {
						ev.preventDefault();
						const newValues = [this.rangeEnd - 7 * 86400000, this.rangeEnd];
						uiSlider.options.range = {
							min: this.rangeEnd - 21 * 86400000,
							max: this.rangeEnd,
						};
						uiSlider.options.start = newValues;
						uiSlider.updateOptions(uiSlider.options);
						if (this.options.fixSize) {
							this.setSlider();
						} else {
							uiSlider.options.range = {
								min: this.rangeStart,
								max: this.rangeEnd,
							};
							uiSlider.updateOptions(uiSlider.options);
						}
						if (this.options.showText) {
							this.updateSlider(uiSlider.get());
						}
					});
				uiSlider.on("set.lichessTools", this.check1wActive);
			}
		}
	}
	LiChessTools.Tools.ProfileSlider = ProfileSliderTool;
})();
