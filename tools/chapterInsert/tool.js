(() => {
	class ChapterInsertTool extends LiChessTools.Tools.ToolBase {
		preferences = [
			{
				name: "chapterInsert",
				category: "study",
				type: "single",
				possibleValues: [false, true],
				defaultValue: true,
				advanced: true,
				needsLogin: true,
			},
		];

		intl = {
			"en-US": {
				"options.study": "Study",
				"options.chapterInsert": "Insert new chapter after current one",
				chapterInsertText: "Create after current",
				chapterInsertTitle:
					"LiChess Tools - create chapter after current chapter",
			},
			"ro-RO": {
				"options.study": "Studiu",
				"options.chapterInsert":
					"Insereaz\u0103 capitole noi dup\u0103 cel curent",
				chapterInsertText: "Creaz\u0103 dup\u0103 capitolul curent",
				chapterInsertTitle:
					"LiChess Tools - creaz\u0103 capitol dup\u0103 cel curent",
			},
		};

		setupButtons = async (studyId) => {
			const parent = this.lichessTools;
			const lichess = parent.lichess;
			const $ = parent.$;
			const trans = parent.translator;
			const container = $("div.dialog-content div.form-actions");
			if (!container.length) return;
			const study = lichess.analysis.study;
			const allChapters = study.chapters.list.all();
			const currentChapter = study.currentChapter();
			const isLast = currentChapter === allChapters.at(-1);
			const button = $("button.lichessTools-chapterInsert", container);
			if (button.length) {
				if (isLast) {
					container.addClass("single");
					button.remove();
				}
				return;
			} else {
				if (isLast) {
					return;
				}
			}
			container.removeClass("single");
			$('<button type="submit" class="button lichessTools-chapterInsert">')
				.on("click", (ev) => {
					this.chapterData = {
						chapters: allChapters,
						current: currentChapter,
					};
				})
				.text(trans.noarg("chapterInsertText"))
				.attr("title", trans.noarg("chapterInsertTitle"))
				.prependTo(container);
		};

		onChapterAdd = (newChapterId) => {
			const parent = this.lichessTools;
			const lichess = parent.lichess;
			const study = lichess.analysis.study;
			const chapters = study.chapters.list.all();
			if (!chapters || !this.chapterData) return;
			const newOrder = chapters.map((c) => c.id);
			const index = newOrder.findIndex(
				(id) => id == this.chapterData.current.id,
			);
			if (index < 0 || index == chapters.length - 1) return;
			newOrder.splice(index + 1, 0, newChapterId);
			study.makeChange("sortChapters", newOrder);
			setTimeout(
				() =>
					$(
						'div.study__chapters div.draggable[data-id="' + newChapterId + '"]',
					)[0]?.scrollIntoViewIfNeeded(),
				500,
			);

			this.chapterData = null;
		};

		async start() {
			const parent = this.lichessTools;
			const value = parent.currentOptions.getValue("chapterInsert");
			this.logOption("Chapter insert", value);
			if (!parent.getUserId()) {
				parent.global.console.debug(" ... Disabled (not logged in)");
				return;
			}
			const lichess = parent.lichess;
			const $ = parent.$;
			const study = lichess?.analysis?.study;
			if (!study) return;
			study.chapters.newForm.toggle = parent.unwrapFunction(
				study.chapters.newForm.toggle,
				"chapterInsert",
			);
			$(
				"div.dialog-content div.form-actions button.lichessTools-chapterInsert",
			).remove();
			$("div.dialog-content div.form-actions").addClass("single");
			lichess.socket.handle = parent.unwrapFunction(
				lichess.socket.handle,
				"chapterInsert",
			);
			if (!value) return;
			if (lichess.socket) {
				lichess.socket.handle = parent.wrapFunction(lichess.socket.handle, {
					id: "chapterInsert",
					after: ($this, result, m) => {
						if (m.t == "addChapter") {
							const newChapterId = m.d.p.chapterId;
							this.onChapterAdd(newChapterId);
						}
					},
				});
			}

			study.chapters.newForm.toggle = parent.wrapFunction(
				study.chapters.newForm.toggle,
				{
					id: "chapterInsert",
					after: ($this, result, data) => {
						const interval = parent.global.setInterval(() => {
							const input = $("#chapter-name");
							if (!input.length) return;
							parent.global.clearInterval(interval);
							this.setupButtons(study.data.id);
						}, 100);
					},
				},
			);
		}
	}
	LiChessTools.Tools.ChapterInsert = ChapterInsertTool;
})();
