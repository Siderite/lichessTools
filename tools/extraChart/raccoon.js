(function () {
	/*
    Raccoon analyzes chess or chess variant positions and generates a move or list of moves that it regards as
    strongest Copyright (C) 2020  Michael Oghenevhede Edegware  (michael.edegware@gmail.com)

    Raccoon is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/
	"use strict";
	let Raccoon = function (options) {
		options = options || {};

		const MAX_MOVES = 2048;
		const BOARD_SQUARE_NUM = 120;

		const PIECES = {
			EMPTY: 0,
			WHITEPAWN: 1,
			WHITEBISHOP: 2,
			WHITEKNIGHT: 3,
			WHITEROOK: 4,
			WHITEQUEEN: 5,
			WHITEKING: 6,
			BLACKPAWN: 7,
			BLACKBISHOP: 8,
			BLACKKNIGHT: 9,
			BLACKROOK: 10,
			BLACKQUEEN: 11,
			BLACKKING: 12,
		};
		const FILES = {
			A_FILE: 0,
			B_FILE: 1,
			C_FILE: 2,
			D_FILE: 3,
			E_FILE: 4,
			F_FILE: 5,
			G_FILE: 6,
			H_FILE: 7,
			NONE_FILE: 8,
		};
		const RANKS = {
			FIRST_RANK: 0,
			SECOND_RANK: 1,
			THIRD_RANK: 2,
			FOURTH_RANK: 3,
			FIFTH_RANK: 4,
			SIXTH_RANK: 5,
			SEVENTH_RANK: 6,
			EIGHTH_RANK: 7,
			NONE_RANK: 8,
		};
		const COLORS = { WHITE: 0, BLACK: 1, BOTH: 2 };
		const SQUARES = {
			A1: 21,
			B1: 22,
			C1: 23,
			D1: 24,
			E1: 25,
			F1: 26,
			G1: 27,
			H1: 28,
			A2: 31,
			B2: 32,
			C2: 33,
			D2: 34,
			E2: 35,
			F2: 36,
			G2: 37,
			H2: 38,
			A3: 41,
			B3: 42,
			C3: 43,
			D3: 44,
			E3: 45,
			F3: 46,
			G3: 47,
			H3: 48,
			A4: 51,
			B4: 52,
			C4: 53,
			D4: 54,
			E4: 55,
			F4: 56,
			G4: 57,
			H4: 58,
			A5: 61,
			B5: 62,
			C5: 63,
			D5: 64,
			E5: 65,
			F5: 66,
			G5: 67,
			H5: 68,
			A6: 71,
			B6: 72,
			C6: 73,
			D6: 74,
			E6: 75,
			F6: 76,
			G6: 77,
			H6: 78,
			A7: 81,
			B7: 82,
			C7: 83,
			D7: 84,
			E7: 85,
			F7: 86,
			G7: 87,
			H7: 88,
			A8: 91,
			B8: 92,
			C8: 93,
			D8: 94,
			E8: 95,
			F8: 96,
			G8: 97,
			H8: 98,
			OFF_SQUARE: 99,
			OFF_BOARD: 100,
		};
		const CASTLING = {
			WHITE_CASTLE_OO: 1 << 0,
			WHITE_CASTLE_OOO: 1 << 1,
			BLACK_CASTLE_OO: 1 << 2,
			BLACK_CASTLE_OOO: 1 << 3,
		};

		let board = {
			turn: COLORS.WHITE,
			enpassant: SQUARES.OFF_SQUARE,
			half_moves: 0,
			castling_right: 0,
			ply: 0,
			full_moves: 0,
			history_ply: 0,
			current_polyglot_key: 0n,

			kings: new Array(2),
			pawns: new Array(3),

			pieces: new Array(BOARD_SQUARE_NUM),
			material_eg: new Array(2),
			material_mg: new Array(2),
			number_pieces: new Array(13),
			number_big_pieces: new Array(2),
			number_major_pieces: new Array(2),
			number_minor_pieces: new Array(2),

			piece_list: new Array(13 * 10),
			history: new Array(MAX_MOVES),
		};

		let files_board = new Array(BOARD_SQUARE_NUM);
		let ranks_board = new Array(BOARD_SQUARE_NUM);

		let square64_to_square120 = new Array(64);
		let square120_to_square64 = new Array(BOARD_SQUARE_NUM);

		const get_value_piece = [
			//-- get_value_piece[PHASE][PIECES]
			[0, 128, 825, 781, 1276, 2538, 0, 128, 825, 781, 1276, 2538, 0],
			[0, 213, 915, 854, 1380, 1380, 0, 213, 915, 854, 1380, 1380, 0],
		];
		const get_poly_piece = [-1, 1, 5, 3, 7, 9, 11, 0, 4, 2, 6, 8, 10];
		const get_color_piece = [
			COLORS.BOTH,
			COLORS.WHITE,
			COLORS.WHITE,
			COLORS.WHITE,
			COLORS.WHITE,
			COLORS.WHITE,
			COLORS.WHITE,
			COLORS.BLACK,
			COLORS.BLACK,
			COLORS.BLACK,
			COLORS.BLACK,
			COLORS.BLACK,
			COLORS.BLACK,
		];

		const is_big_piece = [
			false,
			false,
			true,
			true,
			true,
			true,
			true,
			false,
			true,
			true,
			true,
			true,
			true,
		];
		const is_major_piece = [
			false,
			false,
			false,
			false,
			true,
			true,
			true,
			false,
			false,
			false,
			true,
			true,
			true,
		];
		const is_minor_piece = [
			false,
			false,
			true,
			true,
			false,
			false,
			false,
			false,
			true,
			true,
			false,
			false,
			false,
		];
		const is_pawn = [
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
		];
		const is_knight = [
			false,
			false,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			false,
			false,
		];
		const is_bishop = [
			false,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			false,
			false,
			false,
		];
		const is_king = [
			false,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			true,
		];
		const is_queen = [
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
		];
		const is_rook = [
			false,
			false,
			false,
			false,
			true,
			false,
			false,
			false,
			false,
			false,
			true,
			false,
			false,
		];
		const is_rook_or_queen = [
			false,
			false,
			false,
			false,
			true,
			true,
			false,
			false,
			false,
			false,
			true,
			true,
			false,
		];
		const is_bishop_or_queen = [
			false,
			false,
			true,
			false,
			false,
			true,
			false,
			false,
			true,
			false,
			false,
			true,
			false,
		];
		const is_white_piece = [
			false,
			true,
			true,
			true,
			true,
			true,
			true,
			false,
			false,
			false,
			false,
			false,
			false,
		];

		const is_color_bishop = [
			[
				false,
				false,
				true,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
			[
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				true,
				false,
				false,
				false,
				false,
			],
		];
		const is_color_knight = [
			[
				false,
				false,
				false,
				true,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
			[
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				true,
				false,
				false,
				false,
			],
		];
		const is_color_rook = [
			[
				false,
				false,
				false,
				false,
				true,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
			[
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				true,
				false,
				false,
			],
		];
		const is_color_queen = [
			[
				false,
				false,
				false,
				false,
				false,
				true,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
			[
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				true,
				false,
			],
		];
		const is_color_pawn = [
			[
				false,
				true,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				false,
			],
			[
				false,
				false,
				false,
				false,
				false,
				false,
				false,
				true,
				false,
				false,
				false,
				false,
				false,
			],
		];

		let piece_to_ascii = ".PBNRQKpbnrqk";
		let castle64_hash = [
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
			0n,
		];
		let castle_permission = new Array(120);

		/*****************************************************************************
		 * GAME MACRO
		 ****************************************************************************/
		function FILE_RANK_TO_SQUARE(file, rank) {
			return 21 + file + rank * 10;
		}
		function square_64(square_120) {
			return square120_to_square64[square_120];
		}
		function square_120(square_64) {
			return square64_to_square120[square_64];
		}
		function PIECE_INDEX(piece, piece_num) {
			return piece * 10 + piece_num;
		}
		function CLEAR_BIT(color, sq) {
			board.pawns[color].ranks[ranks_board[sq]] -= 1;
			board.pawns[color].files[files_board[sq]] -= 1;
		}
		function SET_BIT(color, sq) {
			board.pawns[color].ranks[ranks_board[sq]] += 1;
			board.pawns[color].files[files_board[sq]] += 1;
		}
		function square_color(sq) {
			return (ranks_board[sq] + files_board[sq]) % 2 === 0
				? COLORS.BLACK
				: COLORS.WHITE;
		}
		/*****************************************************************************
		 * HELPER FUNCTIONS
		 ****************************************************************************/
		function initialize_files_rank_array() {
			for (let i = 0; i < BOARD_SQUARE_NUM; i++) {
				files_board[i] = SQUARES.OFF_BOARD;
				ranks_board[i] = SQUARES.OFF_BOARD;
			}
			for (let rank = RANKS.FIRST_RANK; rank <= RANKS.EIGHTH_RANK; ++rank) {
				for (let file = FILES.A_FILE; file <= FILES.H_FILE; ++file) {
					let square_120 = FILE_RANK_TO_SQUARE(file, rank);
					files_board[square_120] = file;
					ranks_board[square_120] = rank;
				}
			}
		}
		function initialize_square120_to_square64() {
			let sq_64 = 0;
			let i, rank, file;
			for (i = 0; i < BOARD_SQUARE_NUM; ++i) {
				square120_to_square64[i] = 65;
			}
			for (i = 0; i < 64; ++i) {
				square64_to_square120[i] = 120;
			}

			for (rank = RANKS.FIRST_RANK; rank <= RANKS.EIGHTH_RANK; ++rank) {
				for (file = FILES.A_FILE; file <= FILES.H_FILE; file++) {
					let sq = FILE_RANK_TO_SQUARE(file, rank);
					square64_to_square120[sq_64] = sq;
					square120_to_square64[sq] = sq_64;
					sq_64++;
				}
			}
		}
		function initialize_pawns() {
			for (let c = 0; c < 3; c++) {
				board.pawns[c] = {
					ranks: [0, 0, 0, 0, 0, 0, 0, 0],
					files: [0, 0, 0, 0, 0, 0, 0, 0],
				};
			}
		}
		function initialize_hash_key() {
			for (let flag = 0; flag < 16; flag++) {
				for (let i = 0; i < 4; i++) {
					if ((flag & (1 << i)) !== 0)
						castle64_hash[flag] ^= random64_poly[random_castle + i];
				}
			}

			for (let j = 0; j < 120; j++) castle_permission[j] = 0xf;
			castle_permission[SQUARES.E1] &= ~CASTLING.WHITE_CASTLE_OO;
			castle_permission[SQUARES.H1] &= ~CASTLING.WHITE_CASTLE_OO;

			castle_permission[SQUARES.E1] &= ~CASTLING.WHITE_CASTLE_OOO;
			castle_permission[SQUARES.A1] &= ~CASTLING.WHITE_CASTLE_OOO;

			castle_permission[SQUARES.E8] &= ~CASTLING.BLACK_CASTLE_OO;
			castle_permission[SQUARES.H8] &= ~CASTLING.BLACK_CASTLE_OO;

			castle_permission[SQUARES.E8] &= ~CASTLING.BLACK_CASTLE_OOO;
			castle_permission[SQUARES.A8] &= ~CASTLING.BLACK_CASTLE_OOO;
		}

		function initialize() {
			initialize_square120_to_square64();
			initialize_pawns();
			initialize_hash_key();
			initialize_files_rank_array();
		}

		/*****************************************************************************
		 * UTILITY
		 ****************************************************************************/
		function square_to_algebraic(square) {
			let file = "a".charCodeAt(0) + files_board[square];
			let rank = "1".charCodeAt(0) + ranks_board[square];
			return String.fromCharCode(file) + String.fromCharCode(rank);
		}

		function clear() {
			for (let i = 0; i < BOARD_SQUARE_NUM; i++) {
				board.pieces[i] = SQUARES.OFF_BOARD;
			}
			for (let i = 0; i < 64; i++) {
				board.pieces[square_120(i)] = PIECES.EMPTY;
			}
			for (let i = 0; i < 2; i++) {
				board.number_big_pieces[i] = 0;
				board.number_major_pieces[i] = 0;
				board.number_minor_pieces[i] = 0;
				board.material_mg[i] = 0;
				board.material_eg[i] = 0;
			}
			for (let i = 0; i < 3; i++) {
				for (let j = 0; j < 8; j++) {
					board.pawns[i].files[j] = 0;
					board.pawns[i].ranks[j] = 0;
				}
			}

			for (let i = 0; i < 13; i++) {
				board.number_pieces[i] = 0;
			}
			board.kings[COLORS.BLACK] = board.kings[COLORS.WHITE] =
				SQUARES.OFF_SQUARE;
			board.turn = COLORS.BOTH;
			board.enpassant = SQUARES.OFF_SQUARE;
			board.half_moves = 0;
			board.ply = 0;
			board.full_moves = 1;
			board.history_ply = 0;
			board.castling_right = 0;
			board.current_polyglot_key = 0n;
		}
		function load(fen) {
			let rank = RANKS.EIGHTH_RANK;
			let file = FILES.A_FILE;
			let n = fen.length;
			let piece = 0;
			let count = 0;
			let square_64_ = 0;
			let square_120_ = 0;
			let i = 0;
			if (n === 0) return { valid: false, error: "Empty fen provided" };

			clear();
			while (rank >= RANKS.FIRST_RANK && i < n) {
				count = 1;
				switch (fen[i]) {
					case "p":
						piece = PIECES.BLACKPAWN;
						break;
					case "r":
						piece = PIECES.BLACKROOK;
						break;
					case "n":
						piece = PIECES.BLACKKNIGHT;
						break;
					case "b":
						piece = PIECES.BLACKBISHOP;
						break;
					case "k":
						piece = PIECES.BLACKKING;
						break;
					case "q":
						piece = PIECES.BLACKQUEEN;
						break;
					case "Q":
						piece = PIECES.WHITEQUEEN;
						break;
					case "K":
						piece = PIECES.WHITEKING;
						break;
					case "N":
						piece = PIECES.WHITEKNIGHT;
						break;
					case "R":
						piece = PIECES.WHITEROOK;
						break;
					case "B":
						piece = PIECES.WHITEBISHOP;
						break;
					case "P":
						piece = PIECES.WHITEPAWN;
						break;

					case "1":
					case "2":
					case "3":
					case "4":
					case "5":
					case "6":
					case "7":
					case "8":
						piece = PIECES.EMPTY;
						count = fen[i].charCodeAt(0) - "0".charCodeAt(0);
						break;
					case "/":
					case " ":
						rank--;
						file = FILES.A_FILE;
						i++;
						continue;
					default:
						return { valid: false, error: "Illegal character " + fen[i] };
				}
				for (let j = 0; j < count; j++) {
					square_64_ = rank * 8 + file;
					square_120_ = square_120(square_64_);
					if (piece !== PIECES.EMPTY) {
						board.pieces[square_120_] = piece;
					}
					file++;
				}
				i++;
			}

			if (!(fen[i] === "w" || fen[i] === "b")) {
				return {
					valid: false,
					error: "Side to move is invalid. It should be w or b",
				};
			}
			board.turn = fen[i] === "w" ? COLORS.WHITE : COLORS.BLACK;
			i += 2;

			for (let j = 0; j < 4; j++) {
				if (fen[i] === " ") {
					break;
				}
				switch (fen[i]) {
					case "K":
						board.castling_right |= CASTLING.WHITE_CASTLE_OO;
						break;
					case "Q":
						board.castling_right |= CASTLING.WHITE_CASTLE_OOO;
						break;
					case "k":
						board.castling_right |= CASTLING.BLACK_CASTLE_OO;
						break;
					case "q":
						board.castling_right |= CASTLING.BLACK_CASTLE_OOO;
						break;
					default:
						break;
				}
				i++;
			}
			i++;

			if (fen[i] !== "-") {
				file = fen.charCodeAt(i) - "a".charCodeAt(0);
				rank = fen.charCodeAt(++i) - "1".charCodeAt(0);

				if (
					!(file >= FILES.A_FILE && file <= FILES.H_FILE) ||
					!(rank >= RANKS.FIRST_RANK && rank <= RANKS.EIGHTH_RANK)
				) {
					return { valid: false, error: "Invalid en-passant square" };
				}
				board.enpassant = FILE_RANK_TO_SQUARE(file, rank);
			}
			i++;
			let half = "";
			i++;
			while (fen[i] !== " ") {
				half += fen[i++];
			}
			i++;
			let half_move = parseInt(half);
			if (half_move < 0)
				return {
					valid: false,
					error: "Half move cannot be a negative integer",
				};

			let full = "";
			while (i < n) {
				full += fen[i++];
			}

			let full_move = parseInt(full);
			if (full_move < 1)
				return { valid: false, error: "Full move must be greater than 0" };

			board.half_moves = half_move;
			board.history_ply = 0;
			board.ply = 0;
			board.full_moves = full_move;
			board.current_polyglot_key = polyglot_key();
			update_list_material();
			return { valid: true, error: "no error!" };
		}

		function in_check() {
			return is_square_attacked(board.kings[board.turn], board.turn ^ 1);
		}
		function in_checkmate() {
			let check = in_check();
			let moves = legal_moves();
			return check && moves.length === 0;
		}

		/*****************************************************************************
		 * HASH
		 ****************************************************************************/

		//-- http://hgm.nubati.net/book_format.html
		const random64_poly = [
			BigInt("0x9D39247E33776D41"),
			BigInt("0x2AF7398005AAA5C7"),
			BigInt("0x44DB015024623547"),
			BigInt("0x9C15F73E62A76AE2"),
			BigInt("0x75834465489C0C89"),
			BigInt("0x3290AC3A203001BF"),
			BigInt("0x0FBBAD1F61042279"),
			BigInt("0xE83A908FF2FB60CA"),
			BigInt("0x0D7E765D58755C10"),
			BigInt("0x1A083822CEAFE02D"),
			BigInt("0x9605D5F0E25EC3B0"),
			BigInt("0xD021FF5CD13A2ED5"),
			BigInt("0x40BDF15D4A672E32"),
			BigInt("0x011355146FD56395"),
			BigInt("0x5DB4832046F3D9E5"),
			BigInt("0x239F8B2D7FF719CC"),
			BigInt("0x05D1A1AE85B49AA1"),
			BigInt("0x679F848F6E8FC971"),
			BigInt("0x7449BBFF801FED0B"),
			BigInt("0x7D11CDB1C3B7ADF0"),
			BigInt("0x82C7709E781EB7CC"),
			BigInt("0xF3218F1C9510786C"),
			BigInt("0x331478F3AF51BBE6"),
			BigInt("0x4BB38DE5E7219443"),
			BigInt("0xAA649C6EBCFD50FC"),
			BigInt("0x8DBD98A352AFD40B"),
			BigInt("0x87D2074B81D79217"),
			BigInt("0x19F3C751D3E92AE1"),
			BigInt("0xB4AB30F062B19ABF"),
			BigInt("0x7B0500AC42047AC4"),
			BigInt("0xC9452CA81A09D85D"),
			BigInt("0x24AA6C514DA27500"),
			BigInt("0x4C9F34427501B447"),
			BigInt("0x14A68FD73C910841"),
			BigInt("0xA71B9B83461CBD93"),
			BigInt("0x03488B95B0F1850F"),
			BigInt("0x637B2B34FF93C040"),
			BigInt("0x09D1BC9A3DD90A94"),
			BigInt("0x3575668334A1DD3B"),
			BigInt("0x735E2B97A4C45A23"),
			BigInt("0x18727070F1BD400B"),
			BigInt("0x1FCBACD259BF02E7"),
			BigInt("0xD310A7C2CE9B6555"),
			BigInt("0xBF983FE0FE5D8244"),
			BigInt("0x9F74D14F7454A824"),
			BigInt("0x51EBDC4AB9BA3035"),
			BigInt("0x5C82C505DB9AB0FA"),
			BigInt("0xFCF7FE8A3430B241"),
			BigInt("0x3253A729B9BA3DDE"),
			BigInt("0x8C74C368081B3075"),
			BigInt("0xB9BC6C87167C33E7"),
			BigInt("0x7EF48F2B83024E20"),
			BigInt("0x11D505D4C351BD7F"),
			BigInt("0x6568FCA92C76A243"),
			BigInt("0x4DE0B0F40F32A7B8"),
			BigInt("0x96D693460CC37E5D"),
			BigInt("0x42E240CB63689F2F"),
			BigInt("0x6D2BDCDAE2919661"),
			BigInt("0x42880B0236E4D951"),
			BigInt("0x5F0F4A5898171BB6"),
			BigInt("0x39F890F579F92F88"),
			BigInt("0x93C5B5F47356388B"),
			BigInt("0x63DC359D8D231B78"),
			BigInt("0xEC16CA8AEA98AD76"),
			BigInt("0x5355F900C2A82DC7"),
			BigInt("0x07FB9F855A997142"),
			BigInt("0x5093417AA8A7ED5E"),
			BigInt("0x7BCBC38DA25A7F3C"),
			BigInt("0x19FC8A768CF4B6D4"),
			BigInt("0x637A7780DECFC0D9"),
			BigInt("0x8249A47AEE0E41F7"),
			BigInt("0x79AD695501E7D1E8"),
			BigInt("0x14ACBAF4777D5776"),
			BigInt("0xF145B6BECCDEA195"),
			BigInt("0xDABF2AC8201752FC"),
			BigInt("0x24C3C94DF9C8D3F6"),
			BigInt("0xBB6E2924F03912EA"),
			BigInt("0x0CE26C0B95C980D9"),
			BigInt("0xA49CD132BFBF7CC4"),
			BigInt("0xE99D662AF4243939"),
			BigInt("0x27E6AD7891165C3F"),
			BigInt("0x8535F040B9744FF1"),
			BigInt("0x54B3F4FA5F40D873"),
			BigInt("0x72B12C32127FED2B"),
			BigInt("0xEE954D3C7B411F47"),
			BigInt("0x9A85AC909A24EAA1"),
			BigInt("0x70AC4CD9F04F21F5"),
			BigInt("0xF9B89D3E99A075C2"),
			BigInt("0x87B3E2B2B5C907B1"),
			BigInt("0xA366E5B8C54F48B8"),
			BigInt("0xAE4A9346CC3F7CF2"),
			BigInt("0x1920C04D47267BBD"),
			BigInt("0x87BF02C6B49E2AE9"),
			BigInt("0x092237AC237F3859"),
			BigInt("0xFF07F64EF8ED14D0"),
			BigInt("0x8DE8DCA9F03CC54E"),
			BigInt("0x9C1633264DB49C89"),
			BigInt("0xB3F22C3D0B0B38ED"),
			BigInt("0x390E5FB44D01144B"),
			BigInt("0x5BFEA5B4712768E9"),
			BigInt("0x1E1032911FA78984"),
			BigInt("0x9A74ACB964E78CB3"),
			BigInt("0x4F80F7A035DAFB04"),
			BigInt("0x6304D09A0B3738C4"),
			BigInt("0x2171E64683023A08"),
			BigInt("0x5B9B63EB9CEFF80C"),
			BigInt("0x506AACF489889342"),
			BigInt("0x1881AFC9A3A701D6"),
			BigInt("0x6503080440750644"),
			BigInt("0xDFD395339CDBF4A7"),
			BigInt("0xEF927DBCF00C20F2"),
			BigInt("0x7B32F7D1E03680EC"),
			BigInt("0xB9FD7620E7316243"),
			BigInt("0x05A7E8A57DB91B77"),
			BigInt("0xB5889C6E15630A75"),
			BigInt("0x4A750A09CE9573F7"),
			BigInt("0xCF464CEC899A2F8A"),
			BigInt("0xF538639CE705B824"),
			BigInt("0x3C79A0FF5580EF7F"),
			BigInt("0xEDE6C87F8477609D"),
			BigInt("0x799E81F05BC93F31"),
			BigInt("0x86536B8CF3428A8C"),
			BigInt("0x97D7374C60087B73"),
			BigInt("0xA246637CFF328532"),
			BigInt("0x043FCAE60CC0EBA0"),
			BigInt("0x920E449535DD359E"),
			BigInt("0x70EB093B15B290CC"),
			BigInt("0x73A1921916591CBD"),
			BigInt("0x56436C9FE1A1AA8D"),
			BigInt("0xEFAC4B70633B8F81"),
			BigInt("0xBB215798D45DF7AF"),
			BigInt("0x45F20042F24F1768"),
			BigInt("0x930F80F4E8EB7462"),
			BigInt("0xFF6712FFCFD75EA1"),
			BigInt("0xAE623FD67468AA70"),
			BigInt("0xDD2C5BC84BC8D8FC"),
			BigInt("0x7EED120D54CF2DD9"),
			BigInt("0x22FE545401165F1C"),
			BigInt("0xC91800E98FB99929"),
			BigInt("0x808BD68E6AC10365"),
			BigInt("0xDEC468145B7605F6"),
			BigInt("0x1BEDE3A3AEF53302"),
			BigInt("0x43539603D6C55602"),
			BigInt("0xAA969B5C691CCB7A"),
			BigInt("0xA87832D392EFEE56"),
			BigInt("0x65942C7B3C7E11AE"),
			BigInt("0xDED2D633CAD004F6"),
			BigInt("0x21F08570F420E565"),
			BigInt("0xB415938D7DA94E3C"),
			BigInt("0x91B859E59ECB6350"),
			BigInt("0x10CFF333E0ED804A"),
			BigInt("0x28AED140BE0BB7DD"),
			BigInt("0xC5CC1D89724FA456"),
			BigInt("0x5648F680F11A2741"),
			BigInt("0x2D255069F0B7DAB3"),
			BigInt("0x9BC5A38EF729ABD4"),
			BigInt("0xEF2F054308F6A2BC"),
			BigInt("0xAF2042F5CC5C2858"),
			BigInt("0x480412BAB7F5BE2A"),
			BigInt("0xAEF3AF4A563DFE43"),
			BigInt("0x19AFE59AE451497F"),
			BigInt("0x52593803DFF1E840"),
			BigInt("0xF4F076E65F2CE6F0"),
			BigInt("0x11379625747D5AF3"),
			BigInt("0xBCE5D2248682C115"),
			BigInt("0x9DA4243DE836994F"),
			BigInt("0x066F70B33FE09017"),
			BigInt("0x4DC4DE189B671A1C"),
			BigInt("0x51039AB7712457C3"),
			BigInt("0xC07A3F80C31FB4B4"),
			BigInt("0xB46EE9C5E64A6E7C"),
			BigInt("0xB3819A42ABE61C87"),
			BigInt("0x21A007933A522A20"),
			BigInt("0x2DF16F761598AA4F"),
			BigInt("0x763C4A1371B368FD"),
			BigInt("0xF793C46702E086A0"),
			BigInt("0xD7288E012AEB8D31"),
			BigInt("0xDE336A2A4BC1C44B"),
			BigInt("0x0BF692B38D079F23"),
			BigInt("0x2C604A7A177326B3"),
			BigInt("0x4850E73E03EB6064"),
			BigInt("0xCFC447F1E53C8E1B"),
			BigInt("0xB05CA3F564268D99"),
			BigInt("0x9AE182C8BC9474E8"),
			BigInt("0xA4FC4BD4FC5558CA"),
			BigInt("0xE755178D58FC4E76"),
			BigInt("0x69B97DB1A4C03DFE"),
			BigInt("0xF9B5B7C4ACC67C96"),
			BigInt("0xFC6A82D64B8655FB"),
			BigInt("0x9C684CB6C4D24417"),
			BigInt("0x8EC97D2917456ED0"),
			BigInt("0x6703DF9D2924E97E"),
			BigInt("0xC547F57E42A7444E"),
			BigInt("0x78E37644E7CAD29E"),
			BigInt("0xFE9A44E9362F05FA"),
			BigInt("0x08BD35CC38336615"),
			BigInt("0x9315E5EB3A129ACE"),
			BigInt("0x94061B871E04DF75"),
			BigInt("0xDF1D9F9D784BA010"),
			BigInt("0x3BBA57B68871B59D"),
			BigInt("0xD2B7ADEEDED1F73F"),
			BigInt("0xF7A255D83BC373F8"),
			BigInt("0xD7F4F2448C0CEB81"),
			BigInt("0xD95BE88CD210FFA7"),
			BigInt("0x336F52F8FF4728E7"),
			BigInt("0xA74049DAC312AC71"),
			BigInt("0xA2F61BB6E437FDB5"),
			BigInt("0x4F2A5CB07F6A35B3"),
			BigInt("0x87D380BDA5BF7859"),
			BigInt("0x16B9F7E06C453A21"),
			BigInt("0x7BA2484C8A0FD54E"),
			BigInt("0xF3A678CAD9A2E38C"),
			BigInt("0x39B0BF7DDE437BA2"),
			BigInt("0xFCAF55C1BF8A4424"),
			BigInt("0x18FCF680573FA594"),
			BigInt("0x4C0563B89F495AC3"),
			BigInt("0x40E087931A00930D"),
			BigInt("0x8CFFA9412EB642C1"),
			BigInt("0x68CA39053261169F"),
			BigInt("0x7A1EE967D27579E2"),
			BigInt("0x9D1D60E5076F5B6F"),
			BigInt("0x3810E399B6F65BA2"),
			BigInt("0x32095B6D4AB5F9B1"),
			BigInt("0x35CAB62109DD038A"),
			BigInt("0xA90B24499FCFAFB1"),
			BigInt("0x77A225A07CC2C6BD"),
			BigInt("0x513E5E634C70E331"),
			BigInt("0x4361C0CA3F692F12"),
			BigInt("0xD941ACA44B20A45B"),
			BigInt("0x528F7C8602C5807B"),
			BigInt("0x52AB92BEB9613989"),
			BigInt("0x9D1DFA2EFC557F73"),
			BigInt("0x722FF175F572C348"),
			BigInt("0x1D1260A51107FE97"),
			BigInt("0x7A249A57EC0C9BA2"),
			BigInt("0x04208FE9E8F7F2D6"),
			BigInt("0x5A110C6058B920A0"),
			BigInt("0x0CD9A497658A5698"),
			BigInt("0x56FD23C8F9715A4C"),
			BigInt("0x284C847B9D887AAE"),
			BigInt("0x04FEABFBBDB619CB"),
			BigInt("0x742E1E651C60BA83"),
			BigInt("0x9A9632E65904AD3C"),
			BigInt("0x881B82A13B51B9E2"),
			BigInt("0x506E6744CD974924"),
			BigInt("0xB0183DB56FFC6A79"),
			BigInt("0x0ED9B915C66ED37E"),
			BigInt("0x5E11E86D5873D484"),
			BigInt("0xF678647E3519AC6E"),
			BigInt("0x1B85D488D0F20CC5"),
			BigInt("0xDAB9FE6525D89021"),
			BigInt("0x0D151D86ADB73615"),
			BigInt("0xA865A54EDCC0F019"),
			BigInt("0x93C42566AEF98FFB"),
			BigInt("0x99E7AFEABE000731"),
			BigInt("0x48CBFF086DDF285A"),
			BigInt("0x7F9B6AF1EBF78BAF"),
			BigInt("0x58627E1A149BBA21"),
			BigInt("0x2CD16E2ABD791E33"),
			BigInt("0xD363EFF5F0977996"),
			BigInt("0x0CE2A38C344A6EED"),
			BigInt("0x1A804AADB9CFA741"),
			BigInt("0x907F30421D78C5DE"),
			BigInt("0x501F65EDB3034D07"),
			BigInt("0x37624AE5A48FA6E9"),
			BigInt("0x957BAF61700CFF4E"),
			BigInt("0x3A6C27934E31188A"),
			BigInt("0xD49503536ABCA345"),
			BigInt("0x088E049589C432E0"),
			BigInt("0xF943AEE7FEBF21B8"),
			BigInt("0x6C3B8E3E336139D3"),
			BigInt("0x364F6FFA464EE52E"),
			BigInt("0xD60F6DCEDC314222"),
			BigInt("0x56963B0DCA418FC0"),
			BigInt("0x16F50EDF91E513AF"),
			BigInt("0xEF1955914B609F93"),
			BigInt("0x565601C0364E3228"),
			BigInt("0xECB53939887E8175"),
			BigInt("0xBAC7A9A18531294B"),
			BigInt("0xB344C470397BBA52"),
			BigInt("0x65D34954DAF3CEBD"),
			BigInt("0xB4B81B3FA97511E2"),
			BigInt("0xB422061193D6F6A7"),
			BigInt("0x071582401C38434D"),
			BigInt("0x7A13F18BBEDC4FF5"),
			BigInt("0xBC4097B116C524D2"),
			BigInt("0x59B97885E2F2EA28"),
			BigInt("0x99170A5DC3115544"),
			BigInt("0x6F423357E7C6A9F9"),
			BigInt("0x325928EE6E6F8794"),
			BigInt("0xD0E4366228B03343"),
			BigInt("0x565C31F7DE89EA27"),
			BigInt("0x30F5611484119414"),
			BigInt("0xD873DB391292ED4F"),
			BigInt("0x7BD94E1D8E17DEBC"),
			BigInt("0xC7D9F16864A76E94"),
			BigInt("0x947AE053EE56E63C"),
			BigInt("0xC8C93882F9475F5F"),
			BigInt("0x3A9BF55BA91F81CA"),
			BigInt("0xD9A11FBB3D9808E4"),
			BigInt("0x0FD22063EDC29FCA"),
			BigInt("0xB3F256D8ACA0B0B9"),
			BigInt("0xB03031A8B4516E84"),
			BigInt("0x35DD37D5871448AF"),
			BigInt("0xE9F6082B05542E4E"),
			BigInt("0xEBFAFA33D7254B59"),
			BigInt("0x9255ABB50D532280"),
			BigInt("0xB9AB4CE57F2D34F3"),
			BigInt("0x693501D628297551"),
			BigInt("0xC62C58F97DD949BF"),
			BigInt("0xCD454F8F19C5126A"),
			BigInt("0xBBE83F4ECC2BDECB"),
			BigInt("0xDC842B7E2819E230"),
			BigInt("0xBA89142E007503B8"),
			BigInt("0xA3BC941D0A5061CB"),
			BigInt("0xE9F6760E32CD8021"),
			BigInt("0x09C7E552BC76492F"),
			BigInt("0x852F54934DA55CC9"),
			BigInt("0x8107FCCF064FCF56"),
			BigInt("0x098954D51FFF6580"),
			BigInt("0x23B70EDB1955C4BF"),
			BigInt("0xC330DE426430F69D"),
			BigInt("0x4715ED43E8A45C0A"),
			BigInt("0xA8D7E4DAB780A08D"),
			BigInt("0x0572B974F03CE0BB"),
			BigInt("0xB57D2E985E1419C7"),
			BigInt("0xE8D9ECBE2CF3D73F"),
			BigInt("0x2FE4B17170E59750"),
			BigInt("0x11317BA87905E790"),
			BigInt("0x7FBF21EC8A1F45EC"),
			BigInt("0x1725CABFCB045B00"),
			BigInt("0x964E915CD5E2B207"),
			BigInt("0x3E2B8BCBF016D66D"),
			BigInt("0xBE7444E39328A0AC"),
			BigInt("0xF85B2B4FBCDE44B7"),
			BigInt("0x49353FEA39BA63B1"),
			BigInt("0x1DD01AAFCD53486A"),
			BigInt("0x1FCA8A92FD719F85"),
			BigInt("0xFC7C95D827357AFA"),
			BigInt("0x18A6A990C8B35EBD"),
			BigInt("0xCCCB7005C6B9C28D"),
			BigInt("0x3BDBB92C43B17F26"),
			BigInt("0xAA70B5B4F89695A2"),
			BigInt("0xE94C39A54A98307F"),
			BigInt("0xB7A0B174CFF6F36E"),
			BigInt("0xD4DBA84729AF48AD"),
			BigInt("0x2E18BC1AD9704A68"),
			BigInt("0x2DE0966DAF2F8B1C"),
			BigInt("0xB9C11D5B1E43A07E"),
			BigInt("0x64972D68DEE33360"),
			BigInt("0x94628D38D0C20584"),
			BigInt("0xDBC0D2B6AB90A559"),
			BigInt("0xD2733C4335C6A72F"),
			BigInt("0x7E75D99D94A70F4D"),
			BigInt("0x6CED1983376FA72B"),
			BigInt("0x97FCAACBF030BC24"),
			BigInt("0x7B77497B32503B12"),
			BigInt("0x8547EDDFB81CCB94"),
			BigInt("0x79999CDFF70902CB"),
			BigInt("0xCFFE1939438E9B24"),
			BigInt("0x829626E3892D95D7"),
			BigInt("0x92FAE24291F2B3F1"),
			BigInt("0x63E22C147B9C3403"),
			BigInt("0xC678B6D860284A1C"),
			BigInt("0x5873888850659AE7"),
			BigInt("0x0981DCD296A8736D"),
			BigInt("0x9F65789A6509A440"),
			BigInt("0x9FF38FED72E9052F"),
			BigInt("0xE479EE5B9930578C"),
			BigInt("0xE7F28ECD2D49EECD"),
			BigInt("0x56C074A581EA17FE"),
			BigInt("0x5544F7D774B14AEF"),
			BigInt("0x7B3F0195FC6F290F"),
			BigInt("0x12153635B2C0CF57"),
			BigInt("0x7F5126DBBA5E0CA7"),
			BigInt("0x7A76956C3EAFB413"),
			BigInt("0x3D5774A11D31AB39"),
			BigInt("0x8A1B083821F40CB4"),
			BigInt("0x7B4A38E32537DF62"),
			BigInt("0x950113646D1D6E03"),
			BigInt("0x4DA8979A0041E8A9"),
			BigInt("0x3BC36E078F7515D7"),
			BigInt("0x5D0A12F27AD310D1"),
			BigInt("0x7F9D1A2E1EBE1327"),
			BigInt("0xDA3A361B1C5157B1"),
			BigInt("0xDCDD7D20903D0C25"),
			BigInt("0x36833336D068F707"),
			BigInt("0xCE68341F79893389"),
			BigInt("0xAB9090168DD05F34"),
			BigInt("0x43954B3252DC25E5"),
			BigInt("0xB438C2B67F98E5E9"),
			BigInt("0x10DCD78E3851A492"),
			BigInt("0xDBC27AB5447822BF"),
			BigInt("0x9B3CDB65F82CA382"),
			BigInt("0xB67B7896167B4C84"),
			BigInt("0xBFCED1B0048EAC50"),
			BigInt("0xA9119B60369FFEBD"),
			BigInt("0x1FFF7AC80904BF45"),
			BigInt("0xAC12FB171817EEE7"),
			BigInt("0xAF08DA9177DDA93D"),
			BigInt("0x1B0CAB936E65C744"),
			BigInt("0xB559EB1D04E5E932"),
			BigInt("0xC37B45B3F8D6F2BA"),
			BigInt("0xC3A9DC228CAAC9E9"),
			BigInt("0xF3B8B6675A6507FF"),
			BigInt("0x9FC477DE4ED681DA"),
			BigInt("0x67378D8ECCEF96CB"),
			BigInt("0x6DD856D94D259236"),
			BigInt("0xA319CE15B0B4DB31"),
			BigInt("0x073973751F12DD5E"),
			BigInt("0x8A8E849EB32781A5"),
			BigInt("0xE1925C71285279F5"),
			BigInt("0x74C04BF1790C0EFE"),
			BigInt("0x4DDA48153C94938A"),
			BigInt("0x9D266D6A1CC0542C"),
			BigInt("0x7440FB816508C4FE"),
			BigInt("0x13328503DF48229F"),
			BigInt("0xD6BF7BAEE43CAC40"),
			BigInt("0x4838D65F6EF6748F"),
			BigInt("0x1E152328F3318DEA"),
			BigInt("0x8F8419A348F296BF"),
			BigInt("0x72C8834A5957B511"),
			BigInt("0xD7A023A73260B45C"),
			BigInt("0x94EBC8ABCFB56DAE"),
			BigInt("0x9FC10D0F989993E0"),
			BigInt("0xDE68A2355B93CAE6"),
			BigInt("0xA44CFE79AE538BBE"),
			BigInt("0x9D1D84FCCE371425"),
			BigInt("0x51D2B1AB2DDFB636"),
			BigInt("0x2FD7E4B9E72CD38C"),
			BigInt("0x65CA5B96B7552210"),
			BigInt("0xDD69A0D8AB3B546D"),
			BigInt("0x604D51B25FBF70E2"),
			BigInt("0x73AA8A564FB7AC9E"),
			BigInt("0x1A8C1E992B941148"),
			BigInt("0xAAC40A2703D9BEA0"),
			BigInt("0x764DBEAE7FA4F3A6"),
			BigInt("0x1E99B96E70A9BE8B"),
			BigInt("0x2C5E9DEB57EF4743"),
			BigInt("0x3A938FEE32D29981"),
			BigInt("0x26E6DB8FFDF5ADFE"),
			BigInt("0x469356C504EC9F9D"),
			BigInt("0xC8763C5B08D1908C"),
			BigInt("0x3F6C6AF859D80055"),
			BigInt("0x7F7CC39420A3A545"),
			BigInt("0x9BFB227EBDF4C5CE"),
			BigInt("0x89039D79D6FC5C5C"),
			BigInt("0x8FE88B57305E2AB6"),
			BigInt("0xA09E8C8C35AB96DE"),
			BigInt("0xFA7E393983325753"),
			BigInt("0xD6B6D0ECC617C699"),
			BigInt("0xDFEA21EA9E7557E3"),
			BigInt("0xB67C1FA481680AF8"),
			BigInt("0xCA1E3785A9E724E5"),
			BigInt("0x1CFC8BED0D681639"),
			BigInt("0xD18D8549D140CAEA"),
			BigInt("0x4ED0FE7E9DC91335"),
			BigInt("0xE4DBF0634473F5D2"),
			BigInt("0x1761F93A44D5AEFE"),
			BigInt("0x53898E4C3910DA55"),
			BigInt("0x734DE8181F6EC39A"),
			BigInt("0x2680B122BAA28D97"),
			BigInt("0x298AF231C85BAFAB"),
			BigInt("0x7983EED3740847D5"),
			BigInt("0x66C1A2A1A60CD889"),
			BigInt("0x9E17E49642A3E4C1"),
			BigInt("0xEDB454E7BADC0805"),
			BigInt("0x50B704CAB602C329"),
			BigInt("0x4CC317FB9CDDD023"),
			BigInt("0x66B4835D9EAFEA22"),
			BigInt("0x219B97E26FFC81BD"),
			BigInt("0x261E4E4C0A333A9D"),
			BigInt("0x1FE2CCA76517DB90"),
			BigInt("0xD7504DFA8816EDBB"),
			BigInt("0xB9571FA04DC089C8"),
			BigInt("0x1DDC0325259B27DE"),
			BigInt("0xCF3F4688801EB9AA"),
			BigInt("0xF4F5D05C10CAB243"),
			BigInt("0x38B6525C21A42B0E"),
			BigInt("0x36F60E2BA4FA6800"),
			BigInt("0xEB3593803173E0CE"),
			BigInt("0x9C4CD6257C5A3603"),
			BigInt("0xAF0C317D32ADAA8A"),
			BigInt("0x258E5A80C7204C4B"),
			BigInt("0x8B889D624D44885D"),
			BigInt("0xF4D14597E660F855"),
			BigInt("0xD4347F66EC8941C3"),
			BigInt("0xE699ED85B0DFB40D"),
			BigInt("0x2472F6207C2D0484"),
			BigInt("0xC2A1E7B5B459AEB5"),
			BigInt("0xAB4F6451CC1D45EC"),
			BigInt("0x63767572AE3D6174"),
			BigInt("0xA59E0BD101731A28"),
			BigInt("0x116D0016CB948F09"),
			BigInt("0x2CF9C8CA052F6E9F"),
			BigInt("0x0B090A7560A968E3"),
			BigInt("0xABEEDDB2DDE06FF1"),
			BigInt("0x58EFC10B06A2068D"),
			BigInt("0xC6E57A78FBD986E0"),
			BigInt("0x2EAB8CA63CE802D7"),
			BigInt("0x14A195640116F336"),
			BigInt("0x7C0828DD624EC390"),
			BigInt("0xD74BBE77E6116AC7"),
			BigInt("0x804456AF10F5FB53"),
			BigInt("0xEBE9EA2ADF4321C7"),
			BigInt("0x03219A39EE587A30"),
			BigInt("0x49787FEF17AF9924"),
			BigInt("0xA1E9300CD8520548"),
			BigInt("0x5B45E522E4B1B4EF"),
			BigInt("0xB49C3B3995091A36"),
			BigInt("0xD4490AD526F14431"),
			BigInt("0x12A8F216AF9418C2"),
			BigInt("0x001F837CC7350524"),
			BigInt("0x1877B51E57A764D5"),
			BigInt("0xA2853B80F17F58EE"),
			BigInt("0x993E1DE72D36D310"),
			BigInt("0xB3598080CE64A656"),
			BigInt("0x252F59CF0D9F04BB"),
			BigInt("0xD23C8E176D113600"),
			BigInt("0x1BDA0492E7E4586E"),
			BigInt("0x21E0BD5026C619BF"),
			BigInt("0x3B097ADAF088F94E"),
			BigInt("0x8D14DEDB30BE846E"),
			BigInt("0xF95CFFA23AF5F6F4"),
			BigInt("0x3871700761B3F743"),
			BigInt("0xCA672B91E9E4FA16"),
			BigInt("0x64C8E531BFF53B55"),
			BigInt("0x241260ED4AD1E87D"),
			BigInt("0x106C09B972D2E822"),
			BigInt("0x7FBA195410E5CA30"),
			BigInt("0x7884D9BC6CB569D8"),
			BigInt("0x0647DFEDCD894A29"),
			BigInt("0x63573FF03E224774"),
			BigInt("0x4FC8E9560F91B123"),
			BigInt("0x1DB956E450275779"),
			BigInt("0xB8D91274B9E9D4FB"),
			BigInt("0xA2EBEE47E2FBFCE1"),
			BigInt("0xD9F1F30CCD97FB09"),
			BigInt("0xEFED53D75FD64E6B"),
			BigInt("0x2E6D02C36017F67F"),
			BigInt("0xA9AA4D20DB084E9B"),
			BigInt("0xB64BE8D8B25396C1"),
			BigInt("0x70CB6AF7C2D5BCF0"),
			BigInt("0x98F076A4F7A2322E"),
			BigInt("0xBF84470805E69B5F"),
			BigInt("0x94C3251F06F90CF3"),
			BigInt("0x3E003E616A6591E9"),
			BigInt("0xB925A6CD0421AFF3"),
			BigInt("0x61BDD1307C66E300"),
			BigInt("0xBF8D5108E27E0D48"),
			BigInt("0x240AB57A8B888B20"),
			BigInt("0xFC87614BAF287E07"),
			BigInt("0xEF02CDD06FFDB432"),
			BigInt("0xA1082C0466DF6C0A"),
			BigInt("0x8215E577001332C8"),
			BigInt("0xD39BB9C3A48DB6CF"),
			BigInt("0x2738259634305C14"),
			BigInt("0x61CF4F94C97DF93D"),
			BigInt("0x1B6BACA2AE4E125B"),
			BigInt("0x758F450C88572E0B"),
			BigInt("0x959F587D507A8359"),
			BigInt("0xB063E962E045F54D"),
			BigInt("0x60E8ED72C0DFF5D1"),
			BigInt("0x7B64978555326F9F"),
			BigInt("0xFD080D236DA814BA"),
			BigInt("0x8C90FD9B083F4558"),
			BigInt("0x106F72FE81E2C590"),
			BigInt("0x7976033A39F7D952"),
			BigInt("0xA4EC0132764CA04B"),
			BigInt("0x733EA705FAE4FA77"),
			BigInt("0xB4D8F77BC3E56167"),
			BigInt("0x9E21F4F903B33FD9"),
			BigInt("0x9D765E419FB69F6D"),
			BigInt("0xD30C088BA61EA5EF"),
			BigInt("0x5D94337FBFAF7F5B"),
			BigInt("0x1A4E4822EB4D7A59"),
			BigInt("0x6FFE73E81B637FB3"),
			BigInt("0xDDF957BC36D8B9CA"),
			BigInt("0x64D0E29EEA8838B3"),
			BigInt("0x08DD9BDFD96B9F63"),
			BigInt("0x087E79E5A57D1D13"),
			BigInt("0xE328E230E3E2B3FB"),
			BigInt("0x1C2559E30F0946BE"),
			BigInt("0x720BF5F26F4D2EAA"),
			BigInt("0xB0774D261CC609DB"),
			BigInt("0x443F64EC5A371195"),
			BigInt("0x4112CF68649A260E"),
			BigInt("0xD813F2FAB7F5C5CA"),
			BigInt("0x660D3257380841EE"),
			BigInt("0x59AC2C7873F910A3"),
			BigInt("0xE846963877671A17"),
			BigInt("0x93B633ABFA3469F8"),
			BigInt("0xC0C0F5A60EF4CDCF"),
			BigInt("0xCAF21ECD4377B28C"),
			BigInt("0x57277707199B8175"),
			BigInt("0x506C11B9D90E8B1D"),
			BigInt("0xD83CC2687A19255F"),
			BigInt("0x4A29C6465A314CD1"),
			BigInt("0xED2DF21216235097"),
			BigInt("0xB5635C95FF7296E2"),
			BigInt("0x22AF003AB672E811"),
			BigInt("0x52E762596BF68235"),
			BigInt("0x9AEBA33AC6ECC6B0"),
			BigInt("0x944F6DE09134DFB6"),
			BigInt("0x6C47BEC883A7DE39"),
			BigInt("0x6AD047C430A12104"),
			BigInt("0xA5B1CFDBA0AB4067"),
			BigInt("0x7C45D833AFF07862"),
			BigInt("0x5092EF950A16DA0B"),
			BigInt("0x9338E69C052B8E7B"),
			BigInt("0x455A4B4CFE30E3F5"),
			BigInt("0x6B02E63195AD0CF8"),
			BigInt("0x6B17B224BAD6BF27"),
			BigInt("0xD1E0CCD25BB9C169"),
			BigInt("0xDE0C89A556B9AE70"),
			BigInt("0x50065E535A213CF6"),
			BigInt("0x9C1169FA2777B874"),
			BigInt("0x78EDEFD694AF1EED"),
			BigInt("0x6DC93D9526A50E68"),
			BigInt("0xEE97F453F06791ED"),
			BigInt("0x32AB0EDB696703D3"),
			BigInt("0x3A6853C7E70757A7"),
			BigInt("0x31865CED6120F37D"),
			BigInt("0x67FEF95D92607890"),
			BigInt("0x1F2B1D1F15F6DC9C"),
			BigInt("0xB69E38A8965C6B65"),
			BigInt("0xAA9119FF184CCCF4"),
			BigInt("0xF43C732873F24C13"),
			BigInt("0xFB4A3D794A9A80D2"),
			BigInt("0x3550C2321FD6109C"),
			BigInt("0x371F77E76BB8417E"),
			BigInt("0x6BFA9AAE5EC05779"),
			BigInt("0xCD04F3FF001A4778"),
			BigInt("0xE3273522064480CA"),
			BigInt("0x9F91508BFFCFC14A"),
			BigInt("0x049A7F41061A9E60"),
			BigInt("0xFCB6BE43A9F2FE9B"),
			BigInt("0x08DE8A1C7797DA9B"),
			BigInt("0x8F9887E6078735A1"),
			BigInt("0xB5B4071DBFC73A66"),
			BigInt("0x230E343DFBA08D33"),
			BigInt("0x43ED7F5A0FAE657D"),
			BigInt("0x3A88A0FBBCB05C63"),
			BigInt("0x21874B8B4D2DBC4F"),
			BigInt("0x1BDEA12E35F6A8C9"),
			BigInt("0x53C065C6C8E63528"),
			BigInt("0xE34A1D250E7A8D6B"),
			BigInt("0xD6B04D3B7651DD7E"),
			BigInt("0x5E90277E7CB39E2D"),
			BigInt("0x2C046F22062DC67D"),
			BigInt("0xB10BB459132D0A26"),
			BigInt("0x3FA9DDFB67E2F199"),
			BigInt("0x0E09B88E1914F7AF"),
			BigInt("0x10E8B35AF3EEAB37"),
			BigInt("0x9EEDECA8E272B933"),
			BigInt("0xD4C718BC4AE8AE5F"),
			BigInt("0x81536D601170FC20"),
			BigInt("0x91B534F885818A06"),
			BigInt("0xEC8177F83F900978"),
			BigInt("0x190E714FADA5156E"),
			BigInt("0xB592BF39B0364963"),
			BigInt("0x89C350C893AE7DC1"),
			BigInt("0xAC042E70F8B383F2"),
			BigInt("0xB49B52E587A1EE60"),
			BigInt("0xFB152FE3FF26DA89"),
			BigInt("0x3E666E6F69AE2C15"),
			BigInt("0x3B544EBE544C19F9"),
			BigInt("0xE805A1E290CF2456"),
			BigInt("0x24B33C9D7ED25117"),
			BigInt("0xE74733427B72F0C1"),
			BigInt("0x0A804D18B7097475"),
			BigInt("0x57E3306D881EDB4F"),
			BigInt("0x4AE7D6A36EB5DBCB"),
			BigInt("0x2D8D5432157064C8"),
			BigInt("0xD1E649DE1E7F268B"),
			BigInt("0x8A328A1CEDFE552C"),
			BigInt("0x07A3AEC79624C7DA"),
			BigInt("0x84547DDC3E203C94"),
			BigInt("0x990A98FD5071D263"),
			BigInt("0x1A4FF12616EEFC89"),
			BigInt("0xF6F7FD1431714200"),
			BigInt("0x30C05B1BA332F41C"),
			BigInt("0x8D2636B81555A786"),
			BigInt("0x46C9FEB55D120902"),
			BigInt("0xCCEC0A73B49C9921"),
			BigInt("0x4E9D2827355FC492"),
			BigInt("0x19EBB029435DCB0F"),
			BigInt("0x4659D2B743848A2C"),
			BigInt("0x963EF2C96B33BE31"),
			BigInt("0x74F85198B05A2E7D"),
			BigInt("0x5A0F544DD2B1FB18"),
			BigInt("0x03727073C2E134B1"),
			BigInt("0xC7F6AA2DE59AEA61"),
			BigInt("0x352787BAA0D7C22F"),
			BigInt("0x9853EAB63B5E0B35"),
			BigInt("0xABBDCDD7ED5C0860"),
			BigInt("0xCF05DAF5AC8D77B0"),
			BigInt("0x49CAD48CEBF4A71E"),
			BigInt("0x7A4C10EC2158C4A6"),
			BigInt("0xD9E92AA246BF719E"),
			BigInt("0x13AE978D09FE5557"),
			BigInt("0x730499AF921549FF"),
			BigInt("0x4E4B705B92903BA4"),
			BigInt("0xFF577222C14F0A3A"),
			BigInt("0x55B6344CF97AAFAE"),
			BigInt("0xB862225B055B6960"),
			BigInt("0xCAC09AFBDDD2CDB4"),
			BigInt("0xDAF8E9829FE96B5F"),
			BigInt("0xB5FDFC5D3132C498"),
			BigInt("0x310CB380DB6F7503"),
			BigInt("0xE87FBB46217A360E"),
			BigInt("0x2102AE466EBB1148"),
			BigInt("0xF8549E1A3AA5E00D"),
			BigInt("0x07A69AFDCC42261A"),
			BigInt("0xC4C118BFE78FEAAE"),
			BigInt("0xF9F4892ED96BD438"),
			BigInt("0x1AF3DBE25D8F45DA"),
			BigInt("0xF5B4B0B0D2DEEEB4"),
			BigInt("0x962ACEEFA82E1C84"),
			BigInt("0x046E3ECAAF453CE9"),
			BigInt("0xF05D129681949A4C"),
			BigInt("0x964781CE734B3C84"),
			BigInt("0x9C2ED44081CE5FBD"),
			BigInt("0x522E23F3925E319E"),
			BigInt("0x177E00F9FC32F791"),
			BigInt("0x2BC60A63A6F3B3F2"),
			BigInt("0x222BBFAE61725606"),
			BigInt("0x486289DDCC3D6780"),
			BigInt("0x7DC7785B8EFDFC80"),
			BigInt("0x8AF38731C02BA980"),
			BigInt("0x1FAB64EA29A2DDF7"),
			BigInt("0xE4D9429322CD065A"),
			BigInt("0x9DA058C67844F20C"),
			BigInt("0x24C0E332B70019B0"),
			BigInt("0x233003B5A6CFE6AD"),
			BigInt("0xD586BD01C5C217F6"),
			BigInt("0x5E5637885F29BC2B"),
			BigInt("0x7EBA726D8C94094B"),
			BigInt("0x0A56A5F0BFE39272"),
			BigInt("0xD79476A84EE20D06"),
			BigInt("0x9E4C1269BAA4BF37"),
			BigInt("0x17EFEE45B0DEE640"),
			BigInt("0x1D95B0A5FCF90BC6"),
			BigInt("0x93CBE0B699C2585D"),
			BigInt("0x65FA4F227A2B6D79"),
			BigInt("0xD5F9E858292504D5"),
			BigInt("0xC2B5A03F71471A6F"),
			BigInt("0x59300222B4561E00"),
			BigInt("0xCE2F8642CA0712DC"),
			BigInt("0x7CA9723FBB2E8988"),
			BigInt("0x2785338347F2BA08"),
			BigInt("0xC61BB3A141E50E8C"),
			BigInt("0x150F361DAB9DEC26"),
			BigInt("0x9F6A419D382595F4"),
			BigInt("0x64A53DC924FE7AC9"),
			BigInt("0x142DE49FFF7A7C3D"),
			BigInt("0x0C335248857FA9E7"),
			BigInt("0x0A9C32D5EAE45305"),
			BigInt("0xE6C42178C4BBB92E"),
			BigInt("0x71F1CE2490D20B07"),
			BigInt("0xF1BCC3D275AFE51A"),
			BigInt("0xE728E8C83C334074"),
			BigInt("0x96FBF83A12884624"),
			BigInt("0x81A1549FD6573DA5"),
			BigInt("0x5FA7867CAF35E149"),
			BigInt("0x56986E2EF3ED091B"),
			BigInt("0x917F1DD5F8886C61"),
			BigInt("0xD20D8C88C8FFE65F"),
			BigInt("0x31D71DCE64B2C310"),
			BigInt("0xF165B587DF898190"),
			BigInt("0xA57E6339DD2CF3A0"),
			BigInt("0x1EF6E6DBB1961EC9"),
			BigInt("0x70CC73D90BC26E24"),
			BigInt("0xE21A6B35DF0C3AD7"),
			BigInt("0x003A93D8B2806962"),
			BigInt("0x1C99DED33CB890A1"),
			BigInt("0xCF3145DE0ADD4289"),
			BigInt("0xD0E4427A5514FB72"),
			BigInt("0x77C621CC9FB3A483"),
			BigInt("0x67A34DAC4356550B"),
			BigInt("0xF8D626AAAF278509"),
		];

		const random_piece = 0;
		const random_castle = 768;
		const random_enpass = 772;
		const random_turn = 780;

		function pawn_cp() {
			let sqWithPawn = 0;
			let targetPce =
				board.turn === COLORS.WHITE ? PIECES.WHITEPAWN : PIECES.BLACKPAWN;
			if (board.enpassant !== SQUARES.OFF_SQUARE) {
				if (board.turn === COLORS.WHITE) {
					sqWithPawn = board.enpassant - 10;
				} else {
					sqWithPawn = board.enpassant + 10;
				}

				if (board.pieces[sqWithPawn + 1] === targetPce) {
					return true;
				} else if (board.pieces[sqWithPawn - 1] === targetPce) {
					return true;
				}
			}
			return false;
		}

		function polyglot_key() {
			let sq,
				rank = 0,
				file = 0;
			let final_key = 0n,
				piece = PIECES.EMPTY,
				poly_piece = 0;

			for (sq = 0; sq < BOARD_SQUARE_NUM; ++sq) {
				piece = board.pieces[sq];
				if (SQUARE_ON_BOARD(sq) && piece !== PIECES.EMPTY) {
					poly_piece = get_poly_piece[piece];
					rank = ranks_board[sq];
					file = files_board[sq];
					final_key ^=
						random64_poly[random_piece + 64 * poly_piece + 8 * rank + file];
				}
			}

			// castling
			if (board.castling_right & CASTLING.WHITE_CASTLE_OO)
				final_key ^= random64_poly[random_castle + 0];
			if (board.castling_right & CASTLING.WHITE_CASTLE_OOO)
				final_key ^= random64_poly[random_castle + 1];
			if (board.castling_right & CASTLING.BLACK_CASTLE_OO)
				final_key ^= random64_poly[random_castle + 2];
			if (board.castling_right & CASTLING.BLACK_CASTLE_OOO)
				final_key ^= random64_poly[random_castle + 3];

			// enpassant
			if (pawn_cp()) {
				file = files_board[board.enpassant];
				final_key ^= random64_poly[random_enpass + file];
			}

			if (board.turn === COLORS.WHITE) {
				final_key ^= random64_poly[random_turn];
			}
			return final_key;
		}
		function update_list_material() {
			for (let i = 0; i < BOARD_SQUARE_NUM; i++) {
				let square = i;
				let piece = board.pieces[i];
				if (piece !== SQUARES.OFF_BOARD && piece !== PIECES.EMPTY) {
					let color = get_color_piece[piece];

					if (is_big_piece[piece]) board.number_big_pieces[color]++;
					if (is_major_piece[piece]) board.number_major_pieces[color]++;
					if (is_minor_piece[piece]) board.number_minor_pieces[color]++;

					board.material_mg[color] += get_value_piece[PHASE.MG][piece];
					board.material_eg[color] += get_value_piece[PHASE.EG][piece];
					board.piece_list[PIECE_INDEX(piece, board.number_pieces[piece])] =
						square;
					board.number_pieces[piece]++;

					if (piece === PIECES.WHITEKING) board.kings[COLORS.WHITE] = square;
					if (piece === PIECES.BLACKKING) board.kings[COLORS.BLACK] = square;

					//-- set pawns
					if (piece === PIECES.WHITEPAWN) {
						SET_BIT(COLORS.WHITE, square);
						SET_BIT(COLORS.BOTH, square);
					} else if (piece === PIECES.BLACKPAWN) {
						SET_BIT(COLORS.BLACK, square);
						SET_BIT(COLORS.BOTH, square);
					}
				}
			}
		}

		/*****************************************************************************
		 * ATTACK
		 ****************************************************************************/
		const knight_direction = [-8, -19, -21, -12, 8, 19, 21, 12];
		const rook_direction = [-1, -10, 1, 10];
		const bishop_direction = [-9, -11, 11, 9];
		const king_direction = [-1, -10, 1, 10, -9, -11, 11, 9];

		function pinned_direction(color, sq) {
			let pce = board.pieces[sq];
			let tmp_sq, tmp_pce;
			if (pce === PIECES.EMPTY) return 0;
			let sign = (color === COLORS.WHITE) ^ is_white_piece[pce] ? -1 : 1;
			let king_sq = board.kings[color];
			let king_r = ranks_board[king_sq];
			let king_f = files_board[king_sq];

			let pce_r = ranks_board[sq];
			let pce_f = files_board[sq];

			if (sq === king_sq) return 0;
			function look(dir, rtn, pce_checker) {
				let seen = false;
				tmp_sq = king_sq + dir;
				while (SQUARE_ON_BOARD(tmp_sq)) {
					tmp_pce = board.pieces[tmp_sq];
					if (tmp_pce !== PIECES.EMPTY) {
						if (seen) {
							if (
								pce_checker[tmp_pce] &&
								(color === COLORS.WHITE) ^ is_white_piece[tmp_pce]
							)
								return sign * rtn;
							break;
						} else {
							if (sq === tmp_sq) {
								seen = true;
							} else return 0;
						}
					}
					tmp_sq += dir;
				}
				return 0;
			}
			//-- horizontal return 1
			if (king_r === pce_r) {
				return look(pce_f > king_f ? 1 : -1, 1, is_rook_or_queen);
			}
			//-- vertical return 3
			else if (king_f === pce_f) {
				return look(pce_r > king_r ? 10 : -10, 3, is_rook_or_queen);
			}
			//-- top left to bottom right return 2
			else if (
				(king_f > pce_f && king_r < pce_r) ||
				(king_f < pce_f && king_r > pce_r)
			) {
				return look(pce_f > king_f ? -9 : 9, 2, is_bishop_or_queen);
			} else {
				//-- top-right to bottom-left return 4
				return look(pce_f > king_f ? 11 : -11, 4, is_bishop_or_queen);
			}
		}
		function pinned(color, sq) {
			if (board.pieces[sq] === PIECES.EMPTY) return 0;
			return pinned_direction(color, sq) > 0 ? 1 : 0;
		}
		function walker(color, tmp_sq, dir, mj_checker, mn_checker, t_sq = 1000) {
			let pce, is_pinned;
			while (SQUARE_ON_BOARD(tmp_sq)) {
				pce = board.pieces[tmp_sq];
				is_pinned = pinned(color, tmp_sq);
				if (pce === PIECES.EMPTY) {
					tmp_sq += dir;
					continue;
				} else if (!mj_checker[pce] || is_pinned || pinned(color ^ 1, tmp_sq)) {
					break;
				} else if (
					mn_checker[pce] &&
					!((color === COLORS.WHITE) ^ is_white_piece[pce])
				) {
					return t_sq === 1000 ? !is_pinned : !is_pinned && tmp_sq === t_sq;
				}
				tmp_sq += dir;
			}
			return 0;
		}
		function slide_attack(color, sq, mj_pce_check, pce_check) {
			let v = 0;
			let tmp_sq, i;
			for (i = 0; i < 4; i++) {
				tmp_sq = sq + rook_direction[i];
				v += walker(color, tmp_sq, rook_direction[i], mj_pce_check, pce_check);
			}
			return v;
		}
		const DIR = {
			//-- white pov
			UP: 0,
			DOWN: 1,
			LEFT: 2,
			RIGHT: 3,
			UP_LEFT: 4,
			UP_RIGHT: 5,
			DOWN_LEFT: 6,
			DOWN_RIGHT: 7,
			SAME: 8,
		};
		function get_direction(from, to) {
			let from_r = ranks_board[from];
			let from_f = files_board[from];
			let to_f = files_board[to];
			let to_r = ranks_board[to];
			if (from === to) return DIR.SAME;
			else if (from_r === to_r) return from_f > to_f ? DIR.LEFT : DIR.RIGHT;
			else if (from_f === to_f) return from_r > to_r ? DIR.DOWN : DIR.UP;
			else if (from_r > to_r)
				return from_f > to_f ? DIR.DOWN_LEFT : DIR.DOWN_RIGHT;
			return from_f > to_f ? DIR.UP_LEFT : DIR.UP_RIGHT;
		}
		function same_diagonal(a, b) {
			return (
				Math.abs(files_board[a] - files_board[b]) ===
				Math.abs(ranks_board[a] - ranks_board[b])
			);
		}
		function diagonal_attack(color, sq, mj_pce_checker, pce_checker) {
			let v = 0;
			let tmp_sq, i;
			for (i = 0; i < 8; i++) {
				tmp_sq = sq + bishop_direction[i];
				v += walker(
					color,
					tmp_sq,
					bishop_direction[i],
					mj_pce_checker,
					pce_checker,
				);
			}
			return v;
		}

		function bishop_xray_attack(
			color,
			sq,
			b_sq = SQUARES.OFF_BOARD,
			xray = true,
		) {
			let mj = xray ? is_bishop_or_queen : is_color_bishop[color];
			if (b_sq !== SQUARES.OFF_BOARD) {
				//-- determine direction
				let b =
					color === COLORS.WHITE ? PIECES.WHITEBISHOP : PIECES.BLACKBISHOP;
				if (b !== board.pieces[b_sq]) return 0;
				let dir = get_direction(sq, b_sq);
				if (dir >= DIR.UP_LEFT && dir < DIR.SAME) {
					let dir_tmp = [9, 11, -11, -9][dir - 4];
					return same_diagonal(sq, b_sq)
						? walker(color, sq + dir_tmp, dir_tmp, mj, is_bishop, b_sq)
						: 0;
				}
				return 0;
			}
			return diagonal_attack(color, sq, mj, is_bishop);
		}
		function rook_xray_attack(
			color,
			sq,
			r_sq = SQUARES.OFF_BOARD,
			xray = true,
		) {
			let mj = xray ? is_rook_or_queen : is_color_rook[color];
			if (r_sq !== SQUARES.OFF_BOARD) {
				let r = color === COLORS.WHITE ? PIECES.WHITEROOK : PIECES.BLACKROOK;
				if (r !== board.pieces[r_sq]) return 0;
				let dir = get_direction(sq, r_sq);
				if (dir < DIR.UP_LEFT) {
					let dir_tmp = [10, -10, -1, 1][dir];
					return walker(color, sq + dir_tmp, dir_tmp, mj, is_rook, r_sq);
				}
				return 0;
			}
			return slide_attack(color, sq, mj, is_rook);
		}
		function queen_attack(color, sq, q_sq = SQUARES.OFF_BOARD) {
			if (q_sq !== SQUARES.OFF_BOARD) {
				//-- determine direction
				if (!is_color_queen[color][board.pieces[q_sq]]) return 0;
				let dir = get_direction(sq, q_sq);
				let dir_tmp;
				if (dir >= DIR.UP_LEFT && dir < DIR.SAME) {
					dir_tmp = [9, 11, -11, -9][dir - 4];
					if (!same_diagonal(sq, q_sq)) return 0;
				} else dir_tmp = [10, -10, -1, 1][dir];
				return walker(
					color,
					sq + dir_tmp,
					dir_tmp,
					is_color_queen[color],
					is_queen,
					q_sq,
				);
			}
			let v = 0;
			v += slide_attack(color, sq, is_color_queen[color], is_queen);
			v += diagonal_attack(color, sq, is_color_queen[color], is_queen);
			return v;
		}

		function knight_attack(color, sq, kn_sq = SQUARES.OFF_BOARD) {
			if (kn_sq !== SQUARES.OFF_BOARD && !is_knight[board.pieces[kn_sq]])
				return 0;
			let v = 0;
			let pce, tmp_sq, i, is_pinned;
			for (i = 0; i < 8; i++) {
				tmp_sq = sq + knight_direction[i];
				pce = board.pieces[tmp_sq];
				is_pinned = pinned(color, tmp_sq);
				if (SQUARE_ON_BOARD(tmp_sq)) {
					if (kn_sq !== SQUARES.OFF_BOARD) {
						if (tmp_sq === kn_sq) return !is_pinned;
					} else {
						if (is_knight[pce] && get_color_piece[pce] === color) {
							v += is_pinned ? 0 : 1;
						}
					}
				}
			}
			return kn_sq === SQUARES.OFF_BOARD ? v : 0;
		}

		function attack(color, square) {
			let v = 0;
			v += pawn_attack(color, square);
			v += king_attack(color, square);
			v += knight_attack(color, square);
			v += bishop_xray_attack(color, square);
			v += rook_xray_attack(color, square);
			v += queen_attack(color, square);
			return v;
		}
		function pawn_attack(color, sq, p_sq = SQUARES.OFF_BOARD) {
			let v = 0;
			let pce = color === COLORS.WHITE ? PIECES.WHITEPAWN : PIECES.BLACKPAWN;
			let sg = color === COLORS.WHITE ? -1 : 1;
			if (p_sq !== SQUARES.OFF_BOARD) {
				if (pce !== board.pieces[p_sq]) return 0;
				return p_sq === sq + sg * 11 || p_sq === sq + sg * 9;
			}
			if (board.pieces[sq + sg * 11] === pce) v++;
			if (board.pieces[sq + sg * 9] === pce) v++;
			return v;
		}
		function king_attack(color, sq, k_sq = SQUARES.OFF_BOARD) {
			let tmp_sq, i, pce;
			let v = 0;
			let k = color === COLORS.WHITE ? PIECES.WHITEKING : PIECES.BLACKKING;
			if (k_sq !== SQUARES.OFF_BOARD && k !== board.pieces[k_sq]) return 0;
			for (i = 0; i < 8; i++) {
				tmp_sq = sq + king_direction[i];
				pce = board.pieces[tmp_sq];
				if (SQUARE_ON_BOARD(tmp_sq)) {
					if (tmp_sq === k_sq || k === pce) return ++v;
				}
			}
			return 0;
		}

		function is_square_attacked(square, turn) {
			let piece, direction, tmp_square;
			// pawns
			if (turn === COLORS.WHITE) {
				if (
					board.pieces[square - 11] === PIECES.WHITEPAWN ||
					board.pieces[square - 9] === PIECES.WHITEPAWN
				) {
					return true;
				}
			} else {
				if (
					board.pieces[square + 11] === PIECES.BLACKPAWN ||
					board.pieces[square + 9] === PIECES.BLACKPAWN
				) {
					return true;
				}
			}
			//knight and king
			for (let i = 0; i < 8; i++) {
				// check knight
				piece = board.pieces[square + knight_direction[i]];
				if (
					piece !== SQUARES.OFF_BOARD &&
					is_knight[piece] &&
					get_color_piece[piece] === turn
				) {
					return true;
				}
				// check king
				piece = board.pieces[square + king_direction[i]];
				if (
					piece !== SQUARES.OFF_BOARD &&
					is_king[piece] &&
					get_color_piece[piece] === turn
				) {
					return true;
				}
			}

			for (let v = 0; v < 2; v++) {
				let direction_, is_piece;
				if (v === 0) {
					//rooks and queen
					direction_ = rook_direction;
					is_piece = is_rook_or_queen;
				} else {
					direction_ = bishop_direction;
					is_piece = is_bishop_or_queen;
				}
				for (let i = 0; i < 4; i++) {
					direction = direction_[i];
					tmp_square = square + direction;
					piece = board.pieces[tmp_square];
					while (piece !== SQUARES.OFF_BOARD) {
						if (piece !== PIECES.EMPTY) {
							if (is_piece[piece] && get_color_piece[piece] === turn) {
								return true;
							}
							break;
						}
						tmp_square += direction;
						piece = board.pieces[tmp_square];
					}
				}
			}
			return false;
		}

		/*****************************************************************************
		 * MOVE GENERATION
		 ****************************************************************************/
		//-- MACROS
		/**
		 * @return {number}
		 */
		function FROM_SQUARE(move) {
			return move & 0x7f;
		}

		/**
		 * @return {number}
		 */
		function TO_SQUARE(move) {
			return (move >> 7) & 0x7f;
		}

		/**
		 * @return {number}
		 */
		function CAPTURED(move) {
			return (move >> 14) & 0xf;
		}

		/**
		 * @return {number}
		 */
		function PROMOTED(move) {
			return (move >> 20) & 0xf;
		}

		/**
		 * @return {boolean}
		 */
		function SQUARE_ON_BOARD(sq) {
			return files_board[sq] !== SQUARES.OFF_BOARD;
		}

		/**
		 * @return {number}
		 */
		function MOVE(from, to, cap, prom, flag) {
			return from | (to << 7) | (cap << 14) | (prom << 20) | flag;
		}

		//-- constants
		const MOVE_FLAG = {
			ENPASS: 0x40000,
			PAWN_START: 0x80000,
			CASTLE: 0x1000000,
			CAPTURED: 0x7c000,
			PROMOTED: 0xf00000,
		};
		const NO_MOVE = 0;
		const CAPTURE_BONUS = 1000000;
		const number_directions = [0, 0, 4, 8, 4, 8, 8, 0, 4, 8, 4, 8, 8];
		const slider = [
			PIECES.WHITEBISHOP,
			PIECES.WHITEROOK,
			PIECES.WHITEQUEEN,
			-1,
			PIECES.BLACKBISHOP,
			PIECES.BLACKROOK,
			PIECES.BLACKQUEEN,
			-1,
		];
		const nonslider = [
			PIECES.WHITEKNIGHT,
			PIECES.WHITEKING,
			-1,
			PIECES.BLACKKNIGHT,
			PIECES.BLACKKING,
			-1,
		];
		const pieces_directions = [
			[0, 0, 0, 0, 0, 0, 0],
			[0, 0, 0, 0, 0, 0, 0],
			[-9, -11, 11, 9, 0, 0, 0, 0],
			[-8, -19, -21, -12, 8, 19, 21, 12],
			[-1, -10, 1, 10, 0, 0, 0, 0],
			[-1, -10, 1, 10, -9, -11, 11, 9],
			[-1, -10, 1, 10, -9, -11, 11, 9],
			[0, 0, 0, 0, 0, 0, 0],
			[-9, -11, 11, 9, 0, 0, 0, 0],
			[-8, -19, -21, -12, 8, 19, 21, 12],
			[-1, -10, 1, 10, 0, 0, 0, 0],
			[-1, -10, 1, 10, -9, -11, 11, 9],
			[-1, -10, 1, 10, -9, -11, 11, 9],
		];

		function add_quiet_move(move, moves) {
			moves.push({ move: move, score: 0 });
		}
		function add_capture_move(move, moves) {
			moves.push({ move: move, score: 0 });
		}
		function add_enpassant_move(move, moves) {
			let score = 105 + CAPTURE_BONUS;
			moves.push({ move: move, score: score });
		}
		function add_white_pawn_capture_move(from, to, cap, moves) {
			if (ranks_board[from] === RANKS.SEVENTH_RANK) {
				add_capture_move(MOVE(from, to, cap, PIECES.WHITEQUEEN, 0), moves);
				add_capture_move(MOVE(from, to, cap, PIECES.WHITEROOK, 0), moves);
				add_capture_move(MOVE(from, to, cap, PIECES.WHITEBISHOP, 0), moves);
				add_capture_move(MOVE(from, to, cap, PIECES.WHITEKNIGHT, 0), moves);
			} else {
				add_capture_move(MOVE(from, to, cap, PIECES.EMPTY, 0), moves);
			}
		}
		function add_white_pawn_move(from, to, moves) {
			if (ranks_board[from] === RANKS.SEVENTH_RANK) {
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.WHITEQUEEN, 0),
					moves,
				);
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.WHITEROOK, 0),
					moves,
				);
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.WHITEBISHOP, 0),
					moves,
				);
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.WHITEKNIGHT, 0),
					moves,
				);
			} else {
				add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0), moves);
			}
		}
		function add_black_pawn_capture_move(from, to, cap, moves) {
			if (ranks_board[from] === RANKS.SECOND_RANK) {
				add_capture_move(MOVE(from, to, cap, PIECES.BLACKQUEEN, 0), moves);
				add_capture_move(MOVE(from, to, cap, PIECES.BLACKROOK, 0), moves);
				add_capture_move(MOVE(from, to, cap, PIECES.BLACKBISHOP, 0), moves);
				add_capture_move(MOVE(from, to, cap, PIECES.BLACKKNIGHT, 0), moves);
			} else {
				add_capture_move(MOVE(from, to, cap, PIECES.EMPTY, 0), moves);
			}
		}
		function add_black_pawn_move(from, to, moves) {
			if (ranks_board[from] === RANKS.SECOND_RANK) {
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.BLACKQUEEN, 0),
					moves,
				);
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.BLACKROOK, 0),
					moves,
				);
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.BLACKBISHOP, 0),
					moves,
				);
				add_quiet_move(
					MOVE(from, to, PIECES.EMPTY, PIECES.BLACKKNIGHT, 0),
					moves,
				);
			} else {
				add_quiet_move(MOVE(from, to, PIECES.EMPTY, PIECES.EMPTY, 0), moves);
			}
		}
		function generate_moves(only_capture = false, square = null) {
			let moves = [];
			let turn = board.turn;
			if (turn === COLORS.WHITE) {
				//-- generate white pawn moves
				for (let p = 0; p < board.number_pieces[PIECES.WHITEPAWN]; p++) {
					let sq = board.piece_list[PIECE_INDEX(PIECES.WHITEPAWN, p)];
					if (square === null || square === sq) {
						//-- forward move
						if (board.pieces[sq + 10] === PIECES.EMPTY && !only_capture) {
							add_white_pawn_move(sq, sq + 10, moves);

							if (
								ranks_board[sq] === RANKS.SECOND_RANK &&
								board.pieces[sq + 20] === PIECES.EMPTY
							) {
								add_quiet_move(
									MOVE(
										sq,
										sq + 20,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.PAWN_START,
									),
									moves,
								);
							}
						}
						//-- capture move
						if (
							SQUARE_ON_BOARD(sq + 9) &&
							get_color_piece[board.pieces[sq + 9]] === COLORS.BLACK
						) {
							add_white_pawn_capture_move(
								sq,
								sq + 9,
								board.pieces[sq + 9],
								moves,
							);
						}
						if (
							SQUARE_ON_BOARD(sq + 11) &&
							get_color_piece[board.pieces[sq + 11]] === COLORS.BLACK
						) {
							add_white_pawn_capture_move(
								sq,
								sq + 11,
								board.pieces[sq + 11],
								moves,
							);
						}

						if (board.enpassant !== SQUARES.OFF_SQUARE) {
							if (sq + 9 === board.enpassant) {
								add_enpassant_move(
									MOVE(
										sq,
										sq + 9,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.ENPASS,
									),
									moves,
								);
							}
							if (sq + 11 === board.enpassant) {
								add_enpassant_move(
									MOVE(
										sq,
										sq + 11,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.ENPASS,
									),
									moves,
								);
							}
						}
					}
				}

				//-- castling
				if (square === null || square === board.kings[COLORS.WHITE]) {
					if (
						(board.castling_right & CASTLING.WHITE_CASTLE_OO) !== 0 &&
						!only_capture
					) {
						if (
							board.pieces[SQUARES.F1] === PIECES.EMPTY &&
							board.pieces[SQUARES.G1] === PIECES.EMPTY
						) {
							if (
								!is_square_attacked(SQUARES.E1, COLORS.BLACK) &&
								!is_square_attacked(SQUARES.F1, COLORS.BLACK)
							) {
								add_quiet_move(
									MOVE(
										SQUARES.E1,
										SQUARES.G1,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.CASTLE,
									),
									moves,
								);
							}
						}
					}
					if (
						(board.castling_right & CASTLING.WHITE_CASTLE_OOO) !== 0 &&
						!only_capture
					) {
						if (
							board.pieces[SQUARES.D1] === PIECES.EMPTY &&
							board.pieces[SQUARES.C1] === PIECES.EMPTY &&
							board.pieces[SQUARES.B1] === PIECES.EMPTY
						) {
							if (
								!is_square_attacked(SQUARES.E1, COLORS.BLACK) &&
								!is_square_attacked(SQUARES.D1, COLORS.BLACK)
							) {
								add_quiet_move(
									MOVE(
										SQUARES.E1,
										SQUARES.C1,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.CASTLE,
									),
									moves,
								);
							}
						}
					}
				}
			} else {
				//generate black pawn moves
				for (let p = 0; p < board.number_pieces[PIECES.BLACKPAWN]; p++) {
					let sq = board.piece_list[PIECE_INDEX(PIECES.BLACKPAWN, p)];
					if (square === null || square === sq) {
						//-- forward move
						if (board.pieces[sq - 10] === PIECES.EMPTY && !only_capture) {
							add_black_pawn_move(sq, sq - 10, moves);
							if (
								ranks_board[sq] === RANKS.SEVENTH_RANK &&
								board.pieces[sq - 20] === PIECES.EMPTY
							) {
								add_quiet_move(
									MOVE(
										sq,
										sq - 20,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.PAWN_START,
									),
									moves,
								);
							}
						}
						//-- capture move
						if (
							SQUARE_ON_BOARD(sq - 9) &&
							get_color_piece[board.pieces[sq - 9]] === COLORS.WHITE
						) {
							add_black_pawn_capture_move(
								sq,
								sq - 9,
								board.pieces[sq - 9],
								moves,
							);
						}
						if (
							SQUARE_ON_BOARD(sq - 11) &&
							get_color_piece[board.pieces[sq - 11]] === COLORS.WHITE
						) {
							add_black_pawn_capture_move(
								sq,
								sq - 11,
								board.pieces[sq - 11],
								moves,
							);
						}

						if (board.enpassant !== SQUARES.OFF_SQUARE) {
							if (sq - 9 === board.enpassant) {
								add_enpassant_move(
									MOVE(
										sq,
										sq - 9,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.ENPASS,
									),
									moves,
								);
							}
							if (sq - 11 === board.enpassant) {
								add_enpassant_move(
									MOVE(
										sq,
										sq - 11,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.ENPASS,
									),
									moves,
								);
							}
						}
					}
				}

				//-- castling
				if (square === null || square === board.kings[COLORS.BLACK]) {
					if (
						(board.castling_right & CASTLING.BLACK_CASTLE_OO) !== 0 &&
						!only_capture
					) {
						if (
							board.pieces[SQUARES.F8] === PIECES.EMPTY &&
							board.pieces[SQUARES.G8] === PIECES.EMPTY
						) {
							if (
								!is_square_attacked(SQUARES.E8, COLORS.WHITE) &&
								!is_square_attacked(SQUARES.F8, COLORS.WHITE)
							) {
								add_quiet_move(
									MOVE(
										SQUARES.E8,
										SQUARES.G8,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.CASTLE,
									),
									moves,
								);
							}
						}
					}
					if (
						(board.castling_right & CASTLING.BLACK_CASTLE_OOO) !== 0 &&
						!only_capture
					) {
						if (
							board.pieces[SQUARES.D8] === PIECES.EMPTY &&
							board.pieces[SQUARES.C8] === PIECES.EMPTY &&
							board.pieces[SQUARES.B8] === PIECES.EMPTY
						) {
							if (
								!is_square_attacked(SQUARES.E8, COLORS.WHITE) &&
								!is_square_attacked(SQUARES.D8, COLORS.WHITE)
							) {
								add_quiet_move(
									MOVE(
										SQUARES.E8,
										SQUARES.C8,
										PIECES.EMPTY,
										PIECES.EMPTY,
										MOVE_FLAG.CASTLE,
									),
									moves,
								);
							}
						}
					}
				}
			}

			let i = turn * 4;
			let p = slider[i++];
			while (p !== -1) {
				for (let pceNum = 0; pceNum < board.number_pieces[p]; ++pceNum) {
					let sq = board.piece_list[PIECE_INDEX(p, pceNum)];
					if (square === null || square === sq) {
						if (SQUARE_ON_BOARD(sq)) {
							for (let i = 0; i < number_directions[p]; i++) {
								let dir = pieces_directions[p][i];
								let to_square = sq + dir;
								while (SQUARE_ON_BOARD(to_square)) {
									if (board.pieces[to_square] !== PIECES.EMPTY) {
										if (
											get_color_piece[board.pieces[to_square]] ===
											(turn ^ 1)
										) {
											add_capture_move(
												MOVE(
													sq,
													to_square,
													board.pieces[to_square],
													PIECES.EMPTY,
													0,
												),
												moves,
											);
										}
										break;
									}
									if (!only_capture) {
										add_quiet_move(
											MOVE(sq, to_square, PIECES.EMPTY, PIECES.EMPTY, 0),
											moves,
										);
									}
									to_square += dir;
								}
							}
						}
					}
				}
				p = slider[i++];
			}

			i = turn * 3;
			p = nonslider[i++];
			while (p !== -1) {
				for (let pceNum = 0; pceNum < board.number_pieces[p]; ++pceNum) {
					let sq = board.piece_list[PIECE_INDEX(p, pceNum)];
					if (square === null || square === sq) {
						if (SQUARE_ON_BOARD(sq)) {
							for (let i = 0; i < number_directions[p]; i++) {
								let dir = pieces_directions[p][i];
								let to_square = sq + dir;

								if (!SQUARE_ON_BOARD(to_square)) {
									continue;
								}
								if (board.pieces[to_square] !== PIECES.EMPTY) {
									if (get_color_piece[board.pieces[to_square]] === (turn ^ 1)) {
										add_capture_move(
											MOVE(
												sq,
												to_square,
												board.pieces[to_square],
												PIECES.EMPTY,
												0,
											),
											moves,
										);
									}
									continue;
								}
								if (!only_capture) {
									add_quiet_move(
										MOVE(sq, to_square, PIECES.EMPTY, PIECES.EMPTY, 0),
										moves,
									);
								}
							}
						}
					}
				}
				p = nonslider[i++];
			}
			return moves;
		}

		function legal_moves(capture = false, square = null) {
			let moves_t_move = generate_moves(capture, square);
			let rlt = [];
			for (let i = 0; i < moves_t_move.length; i++) {
				let tmp_move = moves_t_move[i].move;
				if (!make_move(tmp_move, false)) {
					continue;
				}
				rlt.push(moves_t_move[i]);
				take_move();
			}
			return rlt;
		}

		function disambiguator(move) {
			let diamb = "";

			let moves = generate_moves();

			let from = FROM_SQUARE(move);
			let to = TO_SQUARE(move);
			let piece = board.pieces[from];

			let ambiguities = 0;
			let same_rank = 0;
			let same_file = 0;

			let i, tmp_move, tmp_from, tmp_to, tmp_piece;

			for (i = 0; i < moves.length; ++i) {
				tmp_move = moves[i].move;
				tmp_from = FROM_SQUARE(tmp_move);
				tmp_to = TO_SQUARE(tmp_move);
				tmp_piece = board.pieces[tmp_from];

				//-- http://cfajohnson.com/chess/SAN/
				if (piece === tmp_piece && from !== tmp_from && to === tmp_to) {
					ambiguities++;
					if (ranks_board[from] === ranks_board[tmp_from]) same_rank++;
					if (files_board[from] === files_board[tmp_from]) same_file++;
				}
			}
			if (ambiguities > 0) {
				/*
             * Examples:
                a. There are two knights, on the squares g1 and e1, and one of them
                   moves to the square f3: either Ngf3 or Nef3, as the case may be.
                b. There are two knights, on the squares g5 and g1, and one of them
                   moves to the square f3: either N5f3 or N1f3, as the case may be.
                c. There are two knights, on the squares h2 and d4, and one of them
                   moves to the square f3: either Nhf3 or Ndf3, as the case may be.
                d. If a capture takes place on the square f3, the notation of the
                   previous examples is still applicable, but an x may be inserted: 1)
                   either Ngxf3 or Nexf3, 2) either N5xf3 or N1xf3, 3) either Nhxf3 or
                  Ndxf3, as the case may be.
             */
				if (same_rank > 0 && same_file > 0) {
					diamb += square_to_algebraic(FROM_SQUARE(move));
				} else if (same_file > 0) {
					diamb += square_to_algebraic(from).charAt(1);
				} else {
					diamb += square_to_algebraic(from).charAt(0);
				}
			}
			return diamb;
		}
		function move_to_san(move, verbose = true) {
			let san = "";
			let from = FROM_SQUARE(move);
			let to = TO_SQUARE(move);

			if (SQUARE_ON_BOARD(from) && SQUARE_ON_BOARD(to)) {
				if ((move & MOVE_FLAG.CASTLE) !== 0) {
					//--castling move
					switch (to) {
						case SQUARES.C1:
							san = "O-O-O";
							break;
						case SQUARES.C8:
							san = "O-O-O";
							break;
						case SQUARES.G1:
							san = "O-O";
							break;
						case SQUARES.G8:
							san = "O-O";
							break;
						default:
							break;
					}
				} else {
					let diam = disambiguator(move);
					if (!is_pawn[board.pieces[from]]) {
						san += piece_to_ascii[board.pieces[from]].toUpperCase();
						san += diam;
					}
					if ((move & (MOVE_FLAG.CAPTURED | MOVE_FLAG.ENPASS)) !== 0) {
						if (is_pawn[board.pieces[from]]) {
							san += String.fromCharCode("a".charCodeAt(0) + files_board[from]);
						}
						san += "x";
					}
					san += square_to_algebraic(to);
					if ((move & MOVE_FLAG.PROMOTED) !== 0) {
						san += "=";
						san += piece_to_ascii[PROMOTED(move)].toLowerCase();
					}
				}
				if (verbose) {
					let check = false;
					if (make_move(move, false)) {
						check = in_check();
						if (in_checkmate()) {
							san += "#";
						} else if (check) {
							san += "+";
						}
						take_move();
					}
					if (!check && (move & MOVE_FLAG.ENPASS) !== 0) {
						san += " e.p.";
					}
				}
			}
			return san;
		}
		function parse_move(move, verbose) {
			if (move === NO_MOVE) return null;
			let rlt;
			let from = FROM_SQUARE(move);
			let to = TO_SQUARE(move);

			if (verbose) {
				rlt = {};
				rlt.from = square_to_algebraic(from);
				rlt.to = square_to_algebraic(to);
				rlt.color = "wb-"[board.turn];
				rlt.pieces = piece_to_ascii[board.pieces[from]].toLowerCase();
				if (
					(move & MOVE_FLAG.CAPTURED) !== 0 &&
					(move & MOVE_FLAG.PROMOTED) !== 0
				) {
					rlt.flag = "pc";
					rlt.captured = piece_to_ascii[CAPTURED(move)].toLowerCase();
					rlt.promoted = piece_to_ascii[PROMOTED(move)].toLowerCase();
				} else if ((move & MOVE_FLAG.CAPTURED) !== 0) {
					rlt.flag = "c";
					rlt.captured = piece_to_ascii[CAPTURED(move)].toLowerCase();
				} else if ((move & MOVE_FLAG.PROMOTED) !== 0) {
					rlt.flag = "p";
					rlt.promoted = piece_to_ascii[PROMOTED(move)].toLowerCase();
				} else if ((move & MOVE_FLAG.ENPASS) !== 0) {
					rlt.flag = "e";
				} else if ((move & MOVE_FLAG.CASTLE) !== 0) {
					if (to === SQUARES.G8 || to === SQUARES.G1) {
						rlt.flag = "k";
					} else {
						rlt.flag = "q";
					}
				} else if ((move & MOVE_FLAG.PAWN_START) !== 0) {
					rlt.flag = "b";
				} else {
					rlt.flag = "n";
				}
				rlt.san = move_to_san(move, true);
			} else {
				rlt = "";
				let file_from = files_board[from];
				let rank_from = ranks_board[from];

				let file_to = files_board[to];
				let rank_to = ranks_board[to];

				let promoted = PROMOTED(move);
				rlt +=
					String.fromCharCode("a".charCodeAt(0) + file_from) +
					String.fromCharCode("1".charCodeAt(0) + rank_from) +
					String.fromCharCode("a".charCodeAt(0) + file_to) +
					String.fromCharCode("1".charCodeAt(0) + rank_to);
				if (promoted) {
					let tmp = "q";
					if (is_knight[promoted]) {
						tmp = "n";
					} else if (
						is_rook_or_queen[promoted] &&
						!is_bishop_or_queen[promoted]
					) {
						tmp = "r";
					} else if (
						!is_rook_or_queen[promoted] &&
						is_bishop_or_queen[promoted]
					) {
						tmp = "b";
					}
					rlt += tmp;
				}
			}
			return rlt;
		}

		/*****************************************************************************
		 * MOVE MAKE
		 ****************************************************************************/
		function clear_pieces(sq) {
			if (SQUARE_ON_BOARD(sq)) {
				let pce = board.pieces[sq];
				let col = get_color_piece[pce];
				let index;
				let t_pceNum = -1;

				board.pieces[sq] = PIECES.EMPTY;

				board.material_mg[col] -= get_value_piece[PHASE.MG][pce];
				board.material_eg[col] -= get_value_piece[PHASE.EG][pce];

				if (is_big_piece[pce]) {
					board.number_big_pieces[col]--;
					if (is_major_piece[pce]) {
						board.number_major_pieces[col]--;
					} else {
						board.number_minor_pieces[col]--;
					}
				} else {
					CLEAR_BIT(col, sq);
					CLEAR_BIT(COLORS.BOTH, sq);
				}

				for (index = 0; index < board.number_pieces[pce]; ++index) {
					if (board.piece_list[PIECE_INDEX(pce, index)] === sq) {
						t_pceNum = index;
						break;
					}
				}

				board.number_pieces[pce]--;
				board.piece_list[PIECE_INDEX(pce, t_pceNum)] =
					board.piece_list[PIECE_INDEX(pce, board.number_pieces[pce])];
				board.current_polyglot_key ^=
					random64_poly[
						random_piece + get_poly_piece[pce] * 64 + square_64(sq)
					];
			}
		}
		function add_piece(sq, pce) {
			if (SQUARE_ON_BOARD(sq)) {
				let col = get_color_piece[pce];
				let poly_piece = get_poly_piece[pce];

				board.pieces[sq] = pce;

				if (is_big_piece[pce]) {
					board.number_big_pieces[col]++;
					if (is_major_piece[pce]) {
						board.number_major_pieces[col]++;
					} else {
						board.number_minor_pieces[col]++;
					}
				} else {
					SET_BIT(col, sq);
					SET_BIT(COLORS.BOTH, sq);
				}

				board.material_eg[col] += get_value_piece[PHASE.EG][pce];
				board.material_mg[col] += get_value_piece[PHASE.MG][pce];

				board.piece_list[PIECE_INDEX(pce, board.number_pieces[pce]++)] = sq;
				board.current_polyglot_key ^=
					random64_poly[random_piece + poly_piece * 64 + square_64(sq)];
			}
		}
		function move_piece(from, to) {
			let rcd = false;
			if (SQUARE_ON_BOARD(from) && SQUARE_ON_BOARD(to)) {
				let pce = board.pieces[from];
				let col = get_color_piece[pce];

				board.pieces[from] = PIECES.EMPTY;
				board.pieces[to] = pce;

				if (!is_big_piece[pce]) {
					// -- clear
					CLEAR_BIT(col, from);
					CLEAR_BIT(COLORS.BOTH, from);
					//-- set
					SET_BIT(col, to);
					SET_BIT(COLORS.BOTH, to);
				}

				for (let index = 0; index < board.number_pieces[pce]; ++index) {
					if (board.piece_list[PIECE_INDEX(pce, index)] === from) {
						board.piece_list[PIECE_INDEX(pce, index)] = to;
						rcd = true;
						break;
					}
				}

				let pce_ind = random_piece + get_poly_piece[pce] * 64;
				board.current_polyglot_key ^=
					random64_poly[pce_ind + square_64(from)] ^
					random64_poly[pce_ind + square_64(to)];
			}
			return rcd;
		}
		function take_move() {
			if (board.history_ply === 0) return null;
			board.history_ply--;
			board.ply--;
			board.full_moves -= board.turn === COLORS.WHITE ? 1 : 0;

			let move = board.history[board.history_ply].move;
			let from = FROM_SQUARE(move);
			let to = TO_SQUARE(move);
			let summary = board.history[board.history_ply].summary;

			board.turn ^= 1;

			if ((MOVE_FLAG.ENPASS & move) !== 0) {
				if (board.turn === COLORS.WHITE) {
					add_piece(to - 10, PIECES.BLACKPAWN);
				} else {
					add_piece(to + 10, PIECES.WHITEPAWN);
				}
			} else if ((MOVE_FLAG.CASTLE & move) !== 0) {
				switch (to) {
					case SQUARES.C1:
						move_piece(SQUARES.D1, SQUARES.A1);
						break;
					case SQUARES.C8:
						move_piece(SQUARES.D8, SQUARES.A8);
						break;
					case SQUARES.G1:
						move_piece(SQUARES.F1, SQUARES.H1);
						break;
					case SQUARES.G8:
						move_piece(SQUARES.F8, SQUARES.H8);
						break;
					default:
						break;
				}
			}
			move_piece(to, from);

			if (is_king[board.pieces[from]]) {
				board.kings[board.turn] = from;
			}

			let captured = CAPTURED(move);
			if (captured !== PIECES.EMPTY) {
				add_piece(to, captured);
			}

			if (PROMOTED(move) !== PIECES.EMPTY) {
				clear_pieces(from);
				add_piece(
					from,
					get_color_piece[PROMOTED(move)] === COLORS.WHITE
						? PIECES.WHITEPAWN
						: PIECES.BLACKPAWN,
				);
			}

			board.current_polyglot_key =
				board.history[board.history_ply].current_polyglot_key; //Hack
			board.turn = board.history[board.history_ply].turn;
			board.castling_right = board.history[board.history_ply].castling_right;
			board.half_moves = board.history[board.history_ply].half_moves;
			board.enpassant = board.history[board.history_ply].enpassant;
			board.turn = board.history[board.history_ply].turn;
			board.material_eg = board.history[board.history_ply].material_eg;
			board.material_mg = board.history[board.history_ply].material_mg;

			return summary;
		}
		function make_move(move, summary = true) {
			if (move === NO_MOVE) return false;
			let from = FROM_SQUARE(move);
			let to = TO_SQUARE(move);

			let me = board.turn;
			let opp = me ^ 1;

			// initialise undo
			let undo = {};
			undo.current_polyglot_key = board.current_polyglot_key;

			undo.turn = board.turn;
			undo.move = move;

			undo.half_moves = board.half_moves;
			undo.history_ply = board.history_ply;
			undo.ply = board.ply;

			undo.enpassant = board.enpassant;
			undo.castling_right = board.castling_right;
			undo.summary = summary ? parse_move(move, true) : "No Summary";
			undo.material_eg = board.material_eg;
			undo.material_mg = board.material_mg;

			// update board
			board.turn = opp;
			board.current_polyglot_key ^= random64_poly[random_turn];

			let old_right = board.castling_right;
			let new_right =
				old_right & castle_permission[from] & castle_permission[to];

			board.castling_right = new_right;
			board.current_polyglot_key ^= castle64_hash[old_right ^ new_right]; //hack

			if (board.enpassant !== SQUARES.OFF_SQUARE) {
				board.current_polyglot_key ^=
					random64_poly[random_enpass + files_board[board.enpassant]];
				board.enpassant = SQUARES.OFF_SQUARE;
			}

			board.history[board.history_ply] = undo;
			board.history_ply++;
			board.ply++;
			board.full_moves += me === COLORS.BLACK ? 1 : 0;

			if (is_pawn[board.pieces[from]]) {
				board.half_moves = 0;
				if ((move & MOVE_FLAG.ENPASS) !== 0) {
					if (me === COLORS.WHITE) {
						clear_pieces(to - 10);
					} else {
						clear_pieces(to + 10);
					}
				} else if ((move & MOVE_FLAG.PAWN_START) !== 0) {
					if (
						(SQUARE_ON_BOARD(to - 1) &&
							is_color_pawn[opp][board.pieces[to - 1]]) ||
						(SQUARE_ON_BOARD(to + 1) &&
							is_color_pawn[opp][board.pieces[to + 1]])
					) {
						if (me === COLORS.WHITE) {
							board.enpassant = from + 10;
						} else {
							board.enpassant = from - 10;
						}
						board.current_polyglot_key ^=
							random64_poly[random_enpass + files_board[board.enpassant]];
					}
				}
			} else if ((move & MOVE_FLAG.CASTLE) !== 0) {
				switch (to) {
					case SQUARES.C1:
						move_piece(SQUARES.A1, SQUARES.D1);
						break;
					case SQUARES.C8:
						move_piece(SQUARES.A8, SQUARES.D8);
						break;
					case SQUARES.G1:
						move_piece(SQUARES.H1, SQUARES.F1);
						break;
					case SQUARES.G8:
						move_piece(SQUARES.H8, SQUARES.F8);
						break;
					default:
						board.current_polyglot_key = undo.current_polyglot_key;
						return false;
				}
			}

			let captured = CAPTURED(move);
			board.half_moves++;
			if (captured !== PIECES.EMPTY) {
				clear_pieces(to);
				board.half_moves = 0;
			}

			move_piece(from, to);

			let prPce = PROMOTED(move);
			if (prPce !== PIECES.EMPTY) {
				clear_pieces(to);
				add_piece(to, prPce);
			}

			if (is_king[board.pieces[to]]) {
				board.kings[me] = to;
			}

			if (is_square_attacked(board.kings[me], opp)) {
				take_move();
				return false;
			}
			return true;
		}

		/*****************************************************************************
		 * EVALUATION
		 ****************************************************************************/
		const flip = [
			56, 57, 58, 59, 60, 61, 62, 63, 48, 49, 50, 51, 52, 53, 54, 55, 40, 41,
			42, 43, 44, 45, 46, 47, 32, 33, 34, 35, 36, 37, 38, 39, 24, 25, 26, 27,
			28, 29, 30, 31, 16, 17, 18, 19, 20, 21, 22, 23, 8, 9, 10, 11, 12, 13, 14,
			15, 0, 1, 2, 3, 4, 5, 6, 7,
		];
		class eval_t {
			constructor() {
				this.psqt = [0, 0];
				this.imbalance = [0, 0];
				this.pawns = [0, 0];
				this.pieces = [0, 0];
				this.piece_value = [0, 0];
				this.mobility = [0, 0];
				this.threat = [0, 0];
				this.passed = [0, 0];
				this.space = [0, 0];
				this.king = [0, 0];
			}
		}
		const PHASE = {
			MG: 0,
			EG: 1,
		};
		const pawn_psqt = [
			[
				0, 0, 0, 0, 0, 0, 0, 0, 3, 3, 10, 19, 16, 19, 7, -5, -9, -15, 11, 15,
				32, 22, 5, -22, -8, -23, 6, 20, 40, 17, 4, -12, 13, 0, -13, 1, 11, -2,
				-13, 5, -5, -12, -7, 22, -8, -5, -15, -18, -7, 7, -3, -13, 5, -16, 10,
				-8, 0, 0, 0, 0, 0, 0, 0, 0,
			],
			[
				0, 0, 0, 0, 0, 0, 0, 0, -10, -6, 10, 0, 14, 7, -5, -19, -10, -10, -10,
				4, 4, 3, -6, -4, 6, -2, -8, -4, -13, -12, -10, -9, 9, 4, 3, -12, -12,
				-6, 13, 8, 28, 20, 21, 28, 30, 7, 6, 13, 0, -11, 12, 21, 25, 19, 4, 7,
				0, 0, 0, 0, 0, 0, 0, 0,
			],
		];
		const bishop_psqt = [
			[
				-53, -5, -8, -23, -23, -8, -5, -53, -15, 8, 19, 4, 4, 19, 8, -15, -7,
				21, -5, 17, 17, -5, 21, -7, -5, 11, 25, 39, 39, 25, 11, -5, -12, 29, 22,
				31, 31, 22, 29, -12, -16, 6, 1, 11, 11, 1, 6, -16, -17, -14, 5, 0, 0, 5,
				-14, -17, -48, 1, -14, -23, -23, -14, 1, -48,
			],
			[
				-57, -30, -37, -12, -12, -37, -30, -57, -37, -13, -17, 1, 1, -17, -13,
				-37, -16, -1, -2, 10, 10, -2, -1, -16, -20, -6, 0, 17, 17, 0, -6, -20,
				-17, -1, -14, 15, 15, -14, -1, -17, -30, 6, 4, 6, 6, 4, 6, -30, -31,
				-20, -1, 1, 1, -1, -20, -31, -46, -42, -37, -24, -24, -37, -42, -46,
			],
		];
		const knight_psqt = [
			[
				-175, -92, -74, -73, -73, -74, -92, -175, -77, -41, -27, -15, -15, -27,
				-41, -77, -61, -17, 6, 12, 12, 6, -17, -61, -35, 8, 40, 49, 49, 40, 8,
				-35, -34, 13, 44, 51, 51, 44, 13, -34, -9, 22, 58, 53, 53, 58, 22, -9,
				-67, -27, 4, 37, 37, 4, -27, -67, -201, -83, -56, -26, -26, -56, -83,
				-201,
			],
			[
				-96, -65, -49, -21, -21, -49, -65, -96, -67, -54, -18, 8, 8, -18, -54,
				-67, -40, -27, -8, 29, 29, -8, -27, -40, -35, -2, 13, 28, 28, 13, -2,
				-35, -45, -16, 9, 39, 39, 9, -16, -45, -51, -44, -16, 17, 17, -16, -44,
				-51, -69, -50, -51, 12, 12, -51, -50, -69, -100, -88, -56, -17, -17,
				-56, -88, -100,
			],
		];
		const rook_psqt = [
			[
				-31, -20, -14, -5, -5, -14, -20, -31, -21, -13, -8, 6, 6, -8, -13, -21,
				-25, -11, -1, 3, 3, -1, -11, -25, -13, -5, -4, -6, -6, -4, -5, -13, -27,
				-15, -4, 3, 3, -4, -15, -27, -22, -2, 6, 12, 12, 6, -2, -22, -2, 12, 16,
				18, 18, 16, 12, -2, -17, -19, -1, 9, 9, -1, -19, -17,
			],
			[
				-9, -13, -10, -9, -9, -10, -13, -9, -12, -9, -1, -2, -2, -1, -9, -12, 6,
				-8, -2, -6, -6, -2, -8, 6, -6, 1, -9, 7, 7, -9, 1, -6, -5, 8, 7, -6, -6,
				7, 8, -5, 6, 1, -7, 10, 10, -7, 1, 6, 4, 5, 20, -5, -5, 20, 5, 4, 18, 0,
				19, 13, 13, 19, 0, 18,
			],
		];
		const queen_psqt = [
			[
				3, -5, -5, 4, 4, -5, -5, 3, -3, 5, 8, 12, 12, 8, 5, 3, -3, 6, 13, 7, 7,
				13, 6, -3, 4, 5, 9, 8, 8, 9, 5, 4, 0, 14, 12, 5, 5, 12, 14, 0, -4, 10,
				6, 8, 8, 6, 10, -4, -5, 6, 10, 8, 8, 10, 6, -5, -2, -2, 1, -2, -2, 1,
				-2, -2,
			],
			[
				-69, -57, -47, -26, -26, -47, -57, -69, -55, -31, -22, -4, -4, -22, -31,
				-55, -39, -18, -9, 3, 3, -9, -18, -39, -23, -3, 13, 24, 24, 13, -3, -23,
				-29, -6, 9, 21, 21, 9, -6, -29, -38, -18, -12, 1, 1, -12, -18, -38, -50,
				-27, -24, -8, -8, -24, -27, -50, -75, -52, -43, -36, -36, -43, -52, -75,
			],
		];
		const king_psqt = [
			[
				271, 327, 271, 198, 198, 271, 327, 271, 278, 303, 234, 179, 179, 234,
				303, 278, 195, 258, 169, 120, 120, 169, 258, 195, 164, 190, 138, 98, 98,
				138, 190, 164, 154, 179, 105, 70, 70, 105, 179, 154, 123, 145, 81, 31,
				31, 81, 145, 123, 88, 120, 65, 33, 33, 65, 120, 88, 59, 89, 45, -1, -1,
				45, 89, 59,
			],
			[
				1, 45, 85, 76, 76, 85, 45, 1, 53, 100, 133, 135, 135, 133, 100, 53, 88,
				130, 169, 175, 175, 169, 130, 88, 103, 156, 172, 172, 172, 172, 156,
				103, 96, 166, 199, 199, 199, 199, 166, 96, 92, 172, 184, 191, 191, 184,
				172, 92, 47, 121, 116, 131, 131, 116, 121, 47, 11, 59, 73, 78, 78, 73,
				59, 11,
			],
		];
		const mobility_bonus = [
			[
				[-62, -53, -12, -4, 3, 13, 22, 28, 33],
				[-48, -20, 16, 26, 38, 51, 55, 63, 63, 68, 81, 81, 91, 98],
				[-58, -27, -15, -10, -5, -2, 9, 16, 30, 29, 32, 38, 46, 48, 58],
				[
					-39, -21, 3, 3, 14, 22, 28, 41, 43, 48, 56, 60, 60, 66, 67, 70, 71,
					73, 79, 88, 88, 99, 102, 102, 106, 109, 113, 116,
				],
			],
			[
				[-81, -56, -30, -14, 8, 15, 23, 27, 33],
				[-59, -23, -3, 13, 24, 42, 54, 57, 65, 73, 78, 86, 88, 97],
				[-76, -18, 28, 55, 69, 82, 112, 118, 132, 142, 155, 165, 166, 169, 171],
				[
					-36, -15, 8, 18, 34, 54, 61, 73, 79, 92, 94, 104, 113, 120, 123, 126,
					133, 136, 140, 143, 148, 166, 170, 175, 184, 191, 206, 212,
				],
			],
		];
		// Polynomial material imbalance parameters
		const qo = [
			//            OUR PIECES
			// pair pawn knight bishop rook queen
			[1438], // Bishop pair
			[40, 38], // Pawn
			[32, 255, -62], // Knight      OUR PIECES
			[0, 104, 4, 0], // Bishop
			[-26, -2, 47, 105, -208], // Rook
			[-189, 24, 117, 133, -134, -6], // Queen
		];
		const qt = [
			//           THEIR PIECES
			// pair pawn knight bishop rook queen
			[0], // Bishop pair
			[36, 0], // Pawn
			[9, 63, 0], // Knight      OUR PIECES
			[59, 65, 42, 0], // Bishop
			[46, 39, 24, -24, 0], // Rook
			[97, 100, -42, 137, 268, 0], // Queen
		];
		function imbalance_total(rlt) {
			function imbalance(my_turn) {
				//-- stockfish evaluation guide
				let piece_count = [
					//piece_count[COLOR][PIECE_6]
					[
						board.number_pieces[PIECES.WHITEBISHOP] > 1,
						board.number_pieces[PIECES.WHITEPAWN],
						board.number_pieces[PIECES.WHITEKNIGHT],
						board.number_pieces[PIECES.WHITEBISHOP],
						board.number_pieces[PIECES.WHITEROOK],
						board.number_pieces[PIECES.WHITEQUEEN],
					],
					[
						board.number_pieces[PIECES.BLACKBISHOP] > 1,
						board.number_pieces[PIECES.BLACKPAWN],
						board.number_pieces[PIECES.BLACKKNIGHT],
						board.number_pieces[PIECES.BLACKBISHOP],
						board.number_pieces[PIECES.BLACKROOK],
						board.number_pieces[PIECES.BLACKQUEEN],
					],
				];

				let opp_turn = my_turn ^ 1;
				let bonus = 0;
				for (let j = 0; j <= 5; ++j) {
					if (!piece_count[my_turn][j]) continue;
					let v = 0;
					for (let i = 0; i <= j; ++i) {
						v +=
							qo[j][i] * piece_count[my_turn][i] +
							qt[j][i] * piece_count[opp_turn][i];
					}
					bonus += piece_count[my_turn][j] * v;
				}

				return bonus;
			}
			let v = imbalance(COLORS.WHITE) - imbalance(COLORS.BLACK);
			rlt.imbalance[PHASE.MG] += (v / 16) << 0;
			rlt.imbalance[PHASE.EG] += (v / 16) << 0;
		}
		function supported(color, sq) {
			let my_pawn = color * 6 + 1;
			let sg = color === COLORS.WHITE ? -1 : 1;
			let p = 0;
			if (SQUARE_ON_BOARD(sq + 9 * sq) && board.pieces[sq + 9 * sg] === my_pawn)
				p++;
			if (
				SQUARE_ON_BOARD(sq + 11 * sq) &&
				board.pieces[sq + 11 * sg] === my_pawn
			)
				p++;
			return p;
		}
		//-- penalties
		const isolated_pawn = [5, 15];
		const backward_pawn = [9, 24];
		const double_pawn = [11, 56];
		const weak_unopposed_pawn = [13, 27];
		const weak_lever_pawn = [0, 56];

		function phalanx(color, sq) {
			let my_pawn = color * 6 + 1;
			if (SQUARE_ON_BOARD(sq + 1) && board.pieces[sq + 1] === my_pawn) return 1;
			if (SQUARE_ON_BOARD(sq - 1) && board.pieces[sq - 1] === my_pawn) return 1;
			return 0;
		}
		function connected(color, sq) {
			return supported(color, sq) || phalanx(color, sq) ? 1 : 0;
		}
		function opposed(color, sq) {
			return +(board.pawns[color ^ 1].files[files_board[sq]] > 0);
		}
		function weak_unopposed(color, sq) {
			if (opposed(color, sq)) return 0;
			let p = 0;
			if (isolated(color, sq)) p++;
			else if (backward(color, sq)) p++;
			return p;
		}
		function backward(color, sq) {
			//--TODO optimize this function
			let opp_pawn = (color ^ 1) * 6 + 1;
			let dir = color === COLORS.WHITE ? -1 : 1;

			//--check it's behide
			let tmp_sq = sq;
			while (SQUARE_ON_BOARD(tmp_sq)) {
				if (phalanx(color, tmp_sq)) return 0;
				tmp_sq += 10 * dir;
			}
			if (
				(SQUARE_ON_BOARD(sq - 19 * dir) &&
					board.pieces[sq - 19 * dir] === opp_pawn) ||
				(SQUARE_ON_BOARD(sq - 21 * dir) &&
					board.pieces[sq - 21 * dir] === opp_pawn)
			)
				return 1;
			return 0;
		}
		function weak_lever(color, sq) {
			let opp_pawn = (color ^ 1) * 6 + 1;
			let sg = color === COLORS.WHITE ? 1 : -1;
			if (!supported(color, sq)) {
				if (
					SQUARE_ON_BOARD(sq + 9 * sq) &&
					board.pieces[sq + 9 * sg] !== opp_pawn
				)
					return 0;
				if (
					SQUARE_ON_BOARD(sq + 11 * sq) &&
					board.pieces[sq + 11 * sg] !== opp_pawn
				)
					return 0;
				return 1;
			}
			return 0;
		}
		function connected_bonus(color, sq) {
			let seed = [0, 7, 8, 12, 29, 48, 86];
			let op = opposed(color, sq);
			let ph = phalanx(color, sq);
			let su = supported(color, sq);
			let r = ranks_board[sq];
			if (r === RANKS.FIRST_RANK || r === RANKS.EIGHTH_RANK) return 0;
			r = color === COLORS.WHITE ? r : 7 - r;
			return seed[r] * (2 + ph - op) + 21 * su;
		}
		function isolated(color, sq) {
			let file = files_board[sq];
			if (file === FILES.A_FILE) return !board.pawns[color].files[FILES.B_FILE];
			else if (file === FILES.H_FILE)
				return !board.pawns[color].files[FILES.G_FILE];
			else
				return (
					!board.pawns[color].files[file + 1] &&
					!board.pawns[color].files[file - 1]
				);
		}
		function doubled(color, sq) {
			/*
         In Stockfish doubled pawn penalty is attached only for pawn which has another friendly
         pawn on square directly behind that pawn and is not supported
         */
			//return (board.pawns[color].files[files_board[sq]] > 1);
			let my_pawn = color * 6 + 1;
			let sg = color === COLORS.WHITE ? -1 : 1;
			if (board.pieces[sq + 10 * sg] !== my_pawn) return false;
			if (SQUARE_ON_BOARD(sq + 9 * sq) && board.pieces[sq + 9 * sg] === my_pawn)
				return false;
			return !(
				SQUARE_ON_BOARD(sq + 11 * sq) && board.pieces[sq + 11 * sg] === my_pawn
			);
		}

		let pawns_squares, central_blocked_pawns;

		function is_center(sq) {
			let file = files_board[sq];
			return (
				file === FILES.C_FILE ||
				file === FILES.D_FILE ||
				file === FILES.E_FILE ||
				file === FILES.F_FILE
			);
		}
		function rank(color, sq) {
			let r = ranks_board[sq];
			return color === COLORS.WHITE ? r + 1 : 8 - r;
		}
		function outpost_square(color, sq) {
			if (rank(color, sq) < 4 || rank(color, sq) > 6) return 0;
			if (supported(color, sq)) {
				let f = files_board[sq];
				if (
					(f === FILES.A_FILE || !board.pawns[color ^ 1].files[f - 1]) &&
					(f === FILES.H_FILE || !board.pawns[color ^ 1].files[f + 1])
				)
					return 1;
				let dir = color === COLORS.WHITE ? 10 : -10;
				let tmp_sq = sq + dir;
				let opp_pawn = (color ^ 1) * 6 + 1;
				while (SQUARE_ON_BOARD(tmp_sq)) {
					if (
						SQUARE_ON_BOARD(tmp_sq - 1) &&
						board.pieces[tmp_sq - 1] === opp_pawn
					)
						return 0;
					if (
						SQUARE_ON_BOARD(tmp_sq + 1) &&
						board.pieces[tmp_sq + 1] === opp_pawn
					)
						return 0;
					tmp_sq += dir;
				}
				return 1;
			}
			return 0;
		}
		function outpost(color, sq) {
			if (!outpost_square(color, sq)) return 0;
			return is_knight[board.pieces[sq]] || is_bishop[board.pieces[sq]];
		}

		//-- TODO  not very in efficient
		function reachable_outpost(color, kn_bi_sq) {
			if (
				!is_knight[board.pieces[kn_bi_sq]] &&
				!is_bishop[board.pieces[kn_bi_sq]]
			) {
				return 0;
			}
			if ((color === COLORS.WHITE) ^ is_white_piece[board.pieces[kn_bi_sq]])
				return 0;
			let f, r, sq, pce;
			for (r = RANKS.THIRD_RANK; r <= RANKS.SIXTH_RANK; r++) {
				for (f = FILES.A_FILE; f <= FILES.H_FILE; f++) {
					sq = FILE_RANK_TO_SQUARE(f, r);
					pce = board.pieces[sq];
					if (
						outpost_square(color, sq) &&
						((color === COLORS.WHITE) ^ is_white_piece[pce] ||
							pce === PIECES.EMPTY)
					) {
						if (
							(is_knight[board.pieces[kn_bi_sq]] &&
								knight_attack(color, sq, kn_bi_sq)) ||
							bishop_xray_attack(color, sq, kn_bi_sq)
						) {
							return supported(color, sq) ? 2 : 1;
						}
					}
				}
			}
			return 0;
		}
		function blockers_for_king(color, sq) {
			if (pinned_direction(color ^ 1, sq)) return 1;
			return 0;
		}
		function mobility_area(color, sq) {
			let k = color === COLORS.WHITE ? PIECES.WHITEKING : PIECES.BLACKKING;
			let q = color === COLORS.WHITE ? PIECES.WHITEQUEEN : PIECES.BLACKQUEEN;
			let p = color === COLORS.WHITE ? PIECES.WHITEPAWN : PIECES.BLACKPAWN;
			let dif = color === COLORS.WHITE ? 10 : -10;
			let sq_pce = board.pieces[sq];
			if (sq_pce === k || sq_pce === q) return 0;
			if (supported(color ^ 1, sq)) return 0;
			if (
				sq_pce === p &&
				(rank(color, sq) < 4 || board.pieces[sq + dif] !== PIECES.EMPTY)
			)
				return 0;
			if (blockers_for_king(color ^ 1, sq)) return 0;
			return 1;
		}

		//-- TODO VERY INEFFICIENT
		function mobility(color, sq) {
			let v = 0;
			let sq_tmp, r, f;
			let b = board.pieces[sq];
			if (
				((color === COLORS.WHITE) ^ is_white_piece[b]) !== 0 ||
				b === PIECES.EMPTY
			)
				return 0;
			if (!is_knight[b] && !is_bishop[b] && !is_rook_or_queen[b]) return 0;
			for (f = FILES.A_FILE; f <= FILES.H_FILE; f++) {
				for (r = RANKS.FIRST_RANK; r <= RANKS.EIGHTH_RANK; r++) {
					sq_tmp = FILE_RANK_TO_SQUARE(f, r);
					if (!mobility_area(color, sq_tmp)) continue;
					if (
						!is_color_queen[color][board.pieces[sq_tmp]] &&
						is_knight[b] &&
						knight_attack(color, sq_tmp, sq)
					)
						v++;
					if (
						!is_color_queen[color][board.pieces[sq_tmp]] &&
						is_bishop[b] &&
						bishop_xray_attack(color, sq_tmp, sq)
					)
						v++;
					if (is_rook[b] && rook_xray_attack(color, sq_tmp, sq)) v++;
					if (is_queen[b] && queen_attack(color, sq_tmp, sq)) v++;
				}
			}
			return v;
		}

		function pieces_total(rlt) {
			//-- bonus
			const outpost_t = [
				[0, 32, 30, 60],
				[0, 10, 21, 42],
			];
			const minor_behind_t = [18, 3];
			const bishop_pawn_t = [3, 7];
			const rook_queen_file_t = [7, 6];
			const rook_on_file_t = [
				[0, 21, 47],
				[0, 4, 25],
			];
			const trapped_rook_t = [52, 10];
			const weak_queen_t = [49, 15];
			const king_protection_t = [7, 8];
			const long_diagonal_bishop_t = 45;

			let queen_files = 0;

			//-- threats
			const hanging_t = [69, 36];
			const king_threat_t = [24, 89];
			const pawn_push_threat_t = [48, 39];
			function pawn_push_threat(color, sq) {
				if (board.pieces[sq] === PIECES.EMPTY) return 0;
				if (!((color === COLORS.WHITE) ^ is_white_piece[board.pieces[sq]]))
					return 0;
				if (is_color_pawn[color ^ 1][board.pieces[sq]]) return 0;

				let sg = color === COLORS.WHITE ? -1 : 1;
				let diff = [sg * 11, sg * 9];
				let dt;
				for (dt of diff) {
					if (
						SQUARE_ON_BOARD(sq + dt + sg * 10) &&
						is_color_pawn[color][board.pieces[sq + dt + sg * 10]] &&
						SQUARE_ON_BOARD(sq + dt) &&
						board.pieces[sq + dt] === PIECES.EMPTY &&
						(!SQUARE_ON_BOARD(sq + dt - sg * 10 - 1) ||
							(SQUARE_ON_BOARD(sq + dt - sg * 10 - 1) &&
								!is_color_pawn[color ^ 1][
									board.pieces[sq + dt - sg * 10 - 1]
								])) &&
						(!SQUARE_ON_BOARD(sq + dt - sg * 10 + 1) ||
							(SQUARE_ON_BOARD(sq + dt - sg * 10 + 1) &&
								!is_color_pawn[color ^ 1][
									board.pieces[sq + dt - sg * 10 + 1]
								])) &&
						SQUARE_ON_BOARD(sq + dt) &&
						(attack(color, sq + dt) || !attack(color ^ 1, sq + dt))
					) {
						return 1;
					}
					if (
						rank(color ^ 1, sq) === 4 &&
						is_color_pawn[color][board.pieces[sq + dt + sg * 20]] &&
						board.pieces[sq + dt + sg * 10] === PIECES.EMPTY &&
						board.pieces[sq + dt] === PIECES.EMPTY &&
						(!SQUARE_ON_BOARD(sq + dt - sg * 10 - 1) ||
							(SQUARE_ON_BOARD(sq + dt - sg * 10 - 1) &&
								!is_color_pawn[color ^ 1][
									board.pieces[sq + dt - sg * 10 - 1]
								])) &&
						(!SQUARE_ON_BOARD(sq + dt - sg * 10 + 1) ||
							(SQUARE_ON_BOARD(sq + dt - sg * 10 + 1) &&
								!is_color_pawn[color ^ 1][
									board.pieces[sq + dt - sg * 10 + 1]
								])) &&
						SQUARE_ON_BOARD(sq + dt) &&
						(attack(color, sq + dt) || !attack(color ^ 1, sq + dt))
					) {
						return 1;
					}
				}
				return 0;
			}
			function outpost_total(color, sq) {
				let pce = board.pieces[sq];
				if (!is_knight[pce] && !is_bishop[pce]) return 0;
				let reachable = 0;
				if (!outpost(color, sq)) {
					if (!is_knight[pce]) return 0;
					reachable = reachable_outpost(color, sq);
					if (!reachable) return 0;
					return 1;
				}
				if (get_color_piece[pce] === color) return is_knight[pce] ? 3 : 2;
				return 0;
			}
			function minor_behind_pawn(color, kn_bi_sq) {
				let pce = board.pieces[kn_bi_sq];
				if (!is_knight[pce] && !is_bishop[pce]) return 0;
				if (color === COLORS.WHITE)
					return (
						is_white_piece[pce] &&
						SQUARE_ON_BOARD(kn_bi_sq + 10) &&
						is_pawn[board.pieces[kn_bi_sq + 10]]
					);
				return (
					!is_white_piece[pce] &&
					SQUARE_ON_BOARD(kn_bi_sq - 10) &&
					is_pawn[board.pieces[kn_bi_sq - 10]]
				);
			}
			function bishop_pawns(color, sq) {
				return (
					pawns_squares[color][square_color(sq)] *
					(1 + central_blocked_pawns[color])
				);
			}
			function rook_on_file(color, sq) {
				if (!is_color_rook[color][board.pieces[sq]]) return 0;
				let file = files_board[sq];
				if (board.pawns[color].files[file] !== 0) return 0;
				if (board.pawns[COLORS.BOTH].files[file] === 0) return 2; //-- opened file
				return 1; //-- semi open
			}

			function trapped_rook(color, sq) {
				if (!is_color_rook[color][board.pieces[sq]]) return 0;
				if (rook_on_file(color, sq)) return 0;
				if (mobility(color, sq) > 3) return 0;
				let k = color === COLORS.WHITE ? PIECES.WHITEKING : PIECES.BLACKKING;
				let s = board.piece_list[PIECE_INDEX(k, 0)];
				return files_board[s] < 4 === files_board[sq] < files_board[s];
			}

			function weak_queen(color, sq) {
				if (!is_color_queen[color][board.pieces[sq]]) return 0;

				let sq_pce, i, dir_tmp;
				let o_r = color === COLORS.WHITE ? PIECES.BLACKROOK : PIECES.WHITEROOK;
				let o_b =
					color === COLORS.WHITE ? PIECES.BLACKBISHOP : PIECES.WHITEBISHOP;

				function relative_pin_or_discover(from, to, dir) {
					let seen = false;
					while (SQUARE_ON_BOARD(from) && from !== to) {
						if (board.pieces[from] === PIECES.EMPTY) {
							from += dir;
							continue;
						} else {
							if (!seen) {
								from += dir;
								seen = true;
							} else return 0;
						}
					}
					return seen && from === to;
				}

				//-- bishop pin or discovery
				for (i = 0; i < board.number_pieces[o_b]; i++) {
					sq_pce = board.piece_list[PIECE_INDEX(o_b, i)];
					let dir = get_direction(sq_pce, sq);
					if (dir >= DIR.UP_LEFT && dir < DIR.SAME) {
						dir_tmp = [9, 11, -11, -9][dir - 4];
						if (same_diagonal(sq, sq_pce)) {
							if (relative_pin_or_discover(sq_pce + dir_tmp, sq, dir_tmp))
								return 1;
						}
					}
				}

				//-- rook
				for (i = 0; i < board.number_pieces[o_r]; i++) {
					sq_pce = board.piece_list[PIECE_INDEX(o_r, i)];
					let dir = get_direction(sq_pce, sq);
					if (dir < DIR.UP_LEFT) {
						dir_tmp = [10, -10, -1, 1][dir];
						if (relative_pin_or_discover(sq_pce + dir_tmp, sq, dir_tmp))
							return 1;
					}
				}
				return 0;
			}
			function king_protector(color, sq) {
				if (
					!is_color_bishop[color][board.pieces[sq]] &&
					!is_color_knight[color][board.pieces[sq]]
				)
					return 0;
				let k = color === COLORS.WHITE ? PIECES.WHITEKING : PIECES.BLACKKING;
				let k_s = board.piece_list[PIECE_INDEX(k, 0)];
				let f_df = Math.abs(files_board[sq] - files_board[k_s]);
				let r_df = Math.abs(ranks_board[sq] - ranks_board[k_s]);
				return Math.max(f_df, r_df);
			}
			function long_diagonal_bishop(color, sq) {
				if (!is_color_bishop[color][board.pieces[sq]]) return 0;
				if (
					files_board[sq] - ranks_board[sq] !== 0 &&
					files_board[sq] - (7 - ranks_board[sq]) !== 0
				)
					return 0;
				if (Math.min(files_board[sq], 7 - files_board[sq]) > 2) return 0; // center-squares
				let c_sq = square_color(sq) === COLORS.BLACK ? SQUARES.E5 : SQUARES.E4;
				let dir = get_direction(sq, c_sq);
				let dir_tmp = [9, 11, -11, -9][dir - 4];
				let to_sq;
				switch (dir) {
					case DIR.UP_RIGHT:
						to_sq = SQUARES.E5;
						break;
					case DIR.UP_LEFT:
						to_sq = SQUARES.D5;
						break;
					case DIR.DOWN_LEFT:
						to_sq = SQUARES.D4;
						break;
					case DIR.DOWN_RIGHT:
						to_sq = SQUARES.E4;
						break;
					default:
						return 0;
				}
				let tmp_sq = sq + dir_tmp;
				while (tmp_sq !== to_sq) {
					if (
						board.pieces[tmp_sq] !== PIECES.EMPTY &&
						!is_big_piece[board.pieces[tmp_sq]]
					)
						return 0;
					tmp_sq += dir_tmp;
				}
				return 1;
			}
			//-- reset
			pawns_squares = [
				//-- central_pawns[COLORS][COLORS]
				[0, 0],
				[0, 0],
			];
			central_blocked_pawns = [
				//-- blocked_pawns[COLORS]
				0, 0,
			];

			function pawns(color) {
				let i, sq;
				let my_pawn = color * 6 + 1;
				let v = new eval_t();
				for (i = 0; i < board.number_pieces[my_pawn]; i++) {
					sq = board.piece_list[PIECE_INDEX(my_pawn, i)];
					//-- pawns squares
					pawns_squares[color][square_color(sq)]++;
					//-- psqt
					if (color === COLORS.WHITE) {
						v.psqt[PHASE.EG] += pawn_psqt[PHASE.EG][square_64(sq)];
						v.psqt[PHASE.MG] += pawn_psqt[PHASE.MG][square_64(sq)];
						//-- blocked central pawns
						if (
							is_center(sq) &&
							SQUARE_ON_BOARD(sq + 10) &&
							board.pieces[sq + 10] !== PIECES.EMPTY
						) {
							central_blocked_pawns[COLORS.WHITE]++;
						}
					} else {
						v.psqt[PHASE.EG] += pawn_psqt[PHASE.EG][flip[square_64(sq)]];
						v.psqt[PHASE.MG] += pawn_psqt[PHASE.MG][flip[square_64(sq)]];
						//-- blocked central pawns
						if (
							is_center(sq) &&
							SQUARE_ON_BOARD(sq - 10) &&
							board.pieces[sq - 10] !== PIECES.EMPTY
						) {
							central_blocked_pawns[COLORS.BLACK]++;
						}
					}
					//-- bonus
					if (isolated(color, sq)) {
						v.pawns[PHASE.MG] -= isolated_pawn[PHASE.MG];
						v.pawns[PHASE.EG] -= isolated_pawn[PHASE.EG];
					} else if (backward(color, sq)) {
						v.pawns[PHASE.MG] -= backward_pawn[PHASE.MG];
						v.pawns[PHASE.EG] -= backward_pawn[PHASE.EG];
					}
					if (doubled(color, sq)) {
						v.pawns[PHASE.MG] -= double_pawn[PHASE.MG];
						v.pawns[PHASE.EG] -= double_pawn[PHASE.EG];
					}
					if (connected(color, sq)) {
						let cb = connected_bonus(color, sq);
						v.pawns[PHASE.MG] += cb;
						let r =
							color === COLORS.WHITE
								? ranks_board[sq] + 1
								: 8 - ranks_board[sq];
						v.pawns[PHASE.EG] += ((cb * (r - 3)) / 4) << 0;
					}
					if (weak_unopposed(color, sq)) {
						v.pawns[PHASE.MG] -= weak_unopposed_pawn[PHASE.MG];
						v.pawns[PHASE.EG] -= weak_unopposed_pawn[PHASE.EG];
					}
					if (weak_lever(color, sq)) {
						v.pawns[PHASE.MG] -= weak_lever_pawn[PHASE.MG];
						v.pawns[PHASE.EG] -= weak_lever_pawn[PHASE.EG];
					}
					/*** Threats ***/
					// -- hanging
					let hg = 0; //hanging(color^1, sq);
					v.threat[PHASE.MG] += hanging_t[PHASE.MG] * hg;
					v.threat[PHASE.EG] += hanging_t[PHASE.EG] * hg;

					//-- king threat
					let kt = 0; //king_threat(color^1, sq);
					v.threat[PHASE.MG] += king_threat_t[PHASE.MG] * kt;
					v.threat[PHASE.EG] += king_threat_t[PHASE.EG] * kt;

					//-- pawn_push_threat
					let ppt = pawn_push_threat(color ^ 1, sq);
					v.threat[PHASE.MG] += pawn_push_threat_t[PHASE.MG] * ppt;
					v.threat[PHASE.EG] += pawn_push_threat_t[PHASE.EG] * ppt;
				}
				return v;
			}
			function queen(color) {
				let sq, pce, i;
				let v = new eval_t();
				//-- queen
				pce = color === COLORS.WHITE ? PIECES.WHITEQUEEN : PIECES.BLACKQUEEN;
				for (i = 0; i < board.number_pieces[pce]; i++) {
					sq = board.piece_list[PIECE_INDEX(pce, i)];
					queen_files |= 1 << files_board[sq];
					//-- psqt
					if (color === COLORS.WHITE) {
						v.psqt[PHASE.EG] += queen_psqt[PHASE.EG][square_64(sq)];
						v.psqt[PHASE.MG] += queen_psqt[PHASE.MG][square_64(sq)];
					} else {
						v.psqt[PHASE.EG] += queen_psqt[PHASE.EG][flip[square_64(sq)]];
						v.psqt[PHASE.MG] += queen_psqt[PHASE.MG][flip[square_64(sq)]];
					}

					//-- weak queen
					let wq = weak_queen(color, sq);
					v.pieces[PHASE.EG] -= weak_queen_t[PHASE.EG] * wq;
					v.pieces[PHASE.MG] -= weak_queen_t[PHASE.MG] * wq;

					//-- mobility
					let mb = mobility(color, sq);
					v.mobility[PHASE.EG] += mobility_bonus[PHASE.EG][3][mb];
					v.mobility[PHASE.MG] += mobility_bonus[PHASE.MG][3][mb];

					/*** Threats ***/
					// -- hanging
					let hg = 0; //hanging(color^1, sq);
					v.threat[PHASE.MG] += hanging_t[PHASE.MG] * hg;
					v.threat[PHASE.EG] += hanging_t[PHASE.EG] * hg;

					//-- king threat
					let kt = 0; //king_threat(color^1, sq);
					v.threat[PHASE.MG] += king_threat_t[PHASE.MG] * kt;
					v.threat[PHASE.EG] += king_threat_t[PHASE.EG] * kt;

					//-- pawn_push_threat
					let ppt = pawn_push_threat(color ^ 1, sq);
					v.threat[PHASE.MG] += pawn_push_threat_t[PHASE.MG] * ppt;
					v.threat[PHASE.EG] += pawn_push_threat_t[PHASE.EG] * ppt;
				}
				return v;
			}
			function pieces(color) {
				let sq, pce, i;
				let v = new eval_t();

				//-- knight
				pce = color === COLORS.WHITE ? PIECES.WHITEKNIGHT : PIECES.BLACKKNIGHT;
				for (i = 0; i < board.number_pieces[pce]; i++) {
					sq = board.piece_list[PIECE_INDEX(pce, i)];
					//-- psqt
					if (color === COLORS.WHITE) {
						v.psqt[PHASE.EG] += knight_psqt[PHASE.EG][square_64(sq)];
						v.psqt[PHASE.MG] += knight_psqt[PHASE.MG][square_64(sq)];
					} else {
						v.psqt[PHASE.EG] += knight_psqt[PHASE.EG][flip[square_64(sq)]];
						v.psqt[PHASE.MG] += knight_psqt[PHASE.MG][flip[square_64(sq)]];
					}
					//-- outpost
					let opt = outpost_total(color, sq);
					v.pieces[PHASE.EG] += outpost_t[PHASE.EG][opt];
					v.pieces[PHASE.MG] += outpost_t[PHASE.MG][opt];

					//--minor behind
					let mbp = minor_behind_pawn(color, sq);
					v.pieces[PHASE.EG] += minor_behind_t[PHASE.EG] * mbp;
					v.pieces[PHASE.MG] += minor_behind_t[PHASE.MG] * mbp;

					//-- king protector
					let kp = king_protector(color, sq);
					v.pieces[PHASE.EG] -= king_protection_t[PHASE.EG] * kp;
					v.pieces[PHASE.MG] -= king_protection_t[PHASE.MG] * kp;

					//-- mobility
					let mb = mobility(color, sq);
					v.mobility[PHASE.EG] += mobility_bonus[PHASE.EG][0][mb];
					v.mobility[PHASE.MG] += mobility_bonus[PHASE.MG][0][mb];

					/*** Threats ***/
					// -- hanging
					let hg = 0; //hanging(color^1, sq);
					v.threat[PHASE.MG] += hanging_t[PHASE.MG] * hg;
					v.threat[PHASE.EG] += hanging_t[PHASE.EG] * hg;

					//-- king threat
					let kt = 0; //king_threat(color^1, sq);
					v.threat[PHASE.MG] += king_threat_t[PHASE.MG] * kt;
					v.threat[PHASE.EG] += king_threat_t[PHASE.EG] * kt;

					//-- pawn_push_threat
					let ppt = pawn_push_threat(color ^ 1, sq);
					v.threat[PHASE.MG] += pawn_push_threat_t[PHASE.MG] * ppt;
					v.threat[PHASE.EG] += pawn_push_threat_t[PHASE.EG] * ppt;
				}

				//-- bishop
				pce = color === COLORS.WHITE ? PIECES.WHITEBISHOP : PIECES.BLACKBISHOP;
				for (i = 0; i < board.number_pieces[pce]; i++) {
					sq = board.piece_list[PIECE_INDEX(pce, i)];
					//-- psqt
					if (color === COLORS.WHITE) {
						v.psqt[PHASE.EG] += bishop_psqt[PHASE.EG][square_64(sq)];
						v.psqt[PHASE.MG] += bishop_psqt[PHASE.MG][square_64(sq)];
					} else {
						v.psqt[PHASE.EG] += bishop_psqt[PHASE.EG][flip[square_64(sq)]];
						v.psqt[PHASE.MG] += bishop_psqt[PHASE.MG][flip[square_64(sq)]];
					}

					//-- outpost
					let opt = outpost_total(color, sq);
					v.pieces[PHASE.EG] += outpost_t[PHASE.EG][opt];
					v.pieces[PHASE.MG] += outpost_t[PHASE.MG][opt];

					//--minor behind
					let mbp = minor_behind_pawn(color, sq);
					v.pieces[PHASE.EG] += minor_behind_t[PHASE.EG] * mbp;
					v.pieces[PHASE.MG] += minor_behind_t[PHASE.MG] * mbp;

					//-- bishop pawns
					let bsp = bishop_pawns(color, sq);
					v.pieces[PHASE.EG] -= bishop_pawn_t[PHASE.EG] * bsp;
					v.pieces[PHASE.MG] -= bishop_pawn_t[PHASE.MG] * bsp;

					//-- king protector
					let kp = king_protector(color, sq);
					v.pieces[PHASE.EG] -= king_protection_t[PHASE.EG] * kp;
					v.pieces[PHASE.MG] -= king_protection_t[PHASE.MG] * kp;

					//-- bishop in long diagonal
					v.pieces[PHASE.MG] +=
						long_diagonal_bishop_t * long_diagonal_bishop(color, sq);

					//-- mobility
					let mb = mobility(color, sq);
					v.mobility[PHASE.EG] += mobility_bonus[PHASE.EG][1][mb];
					v.mobility[PHASE.MG] += mobility_bonus[PHASE.MG][1][mb];

					/*** Threats ***/
					// -- hanging
					let hg = 0; //hanging(color^1, sq);
					v.threat[PHASE.MG] += hanging_t[PHASE.MG] * hg;
					v.threat[PHASE.EG] += hanging_t[PHASE.EG] * hg;

					//-- king threat
					let kt = 0; //king_threat(color^1, sq);
					v.threat[PHASE.MG] += king_threat_t[PHASE.MG] * kt;
					v.threat[PHASE.EG] += king_threat_t[PHASE.EG] * kt;

					//-- pawn_push_threat
					let ppt = pawn_push_threat(color ^ 1, sq);
					v.threat[PHASE.MG] += pawn_push_threat_t[PHASE.MG] * ppt;
					v.threat[PHASE.EG] += pawn_push_threat_t[PHASE.EG] * ppt;
				}

				//-- rook
				pce = color === COLORS.WHITE ? PIECES.WHITEROOK : PIECES.BLACKROOK;
				for (i = 0; i < board.number_pieces[pce]; i++) {
					sq = board.piece_list[PIECE_INDEX(pce, i)];
					//-- psqt
					if (color === COLORS.WHITE) {
						v.psqt[PHASE.EG] += rook_psqt[PHASE.EG][square_64(sq)];
						v.psqt[PHASE.MG] += rook_psqt[PHASE.MG][square_64(sq)];
					} else {
						v.psqt[PHASE.EG] += rook_psqt[PHASE.EG][flip[square_64(sq)]];
						v.psqt[PHASE.MG] += rook_psqt[PHASE.MG][flip[square_64(sq)]];
					}

					//--  rook on queen file
					let csb = queen_files & (1 << files_board[sq]) ? 1 : 0;
					v.pieces[PHASE.EG] += rook_queen_file_t[PHASE.EG] * csb;
					v.pieces[PHASE.MG] += rook_queen_file_t[PHASE.MG] * csb;

					//-- rook on open or semi open file
					let ind = rook_on_file(color, sq);
					v.pieces[PHASE.EG] += rook_on_file_t[PHASE.EG][ind];
					v.pieces[PHASE.MG] += rook_on_file_t[PHASE.MG][ind];

					//-- trapped rook
					let tr = trapped_rook(color, sq);
					let c;
					if (color === COLORS.WHITE) {
						c =
							board.castling_right & CASTLING.WHITE_CASTLE_OOO ||
							board.castling_right & CASTLING.WHITE_CASTLE_OO
								? 1
								: 2;
					} else {
						c =
							board.castling_right & CASTLING.BLACK_CASTLE_OO ||
							board.castling_right & CASTLING.BLACK_CASTLE_OOO
								? 1
								: 2;
					}
					v.pieces[PHASE.EG] -= tr * trapped_rook_t[PHASE.EG] * c;
					v.pieces[PHASE.MG] -= tr * trapped_rook_t[PHASE.MG] * c;

					//-- mobility
					let mb = mobility(color, sq);
					v.mobility[PHASE.EG] += mobility_bonus[PHASE.EG][2][mb];
					v.mobility[PHASE.MG] += mobility_bonus[PHASE.MG][2][mb];

					/*** Threats ***/
					// -- hanging
					let hg = 0; //hanging(color^1, sq);
					v.threat[PHASE.MG] += hanging_t[PHASE.MG] * hg;
					v.threat[PHASE.EG] += hanging_t[PHASE.EG] * hg;

					//-- king threat
					let kt = 0; //king_threat(color^1, sq);
					v.threat[PHASE.MG] += king_threat_t[PHASE.MG] * kt;
					v.threat[PHASE.EG] += king_threat_t[PHASE.EG] * kt;

					//-- pawn_push_threat
					let ppt = pawn_push_threat(color ^ 1, sq);
					v.threat[PHASE.MG] += pawn_push_threat_t[PHASE.MG] * ppt;
					v.threat[PHASE.EG] += pawn_push_threat_t[PHASE.EG] * ppt;
				}

				//-- king
				pce = color === COLORS.WHITE ? PIECES.WHITEKING : PIECES.BLACKKING;
				for (i = 0; i < board.number_pieces[pce]; i++) {
					sq = board.piece_list[PIECE_INDEX(pce, i)];
					//-- psqt
					if (color === COLORS.WHITE) {
						v.psqt[PHASE.EG] += king_psqt[PHASE.EG][square_64(sq)];
						v.psqt[PHASE.MG] += king_psqt[PHASE.MG][square_64(sq)];
					} else {
						v.psqt[PHASE.EG] += king_psqt[PHASE.EG][flip[square_64(sq)]];
						v.psqt[PHASE.MG] += king_psqt[PHASE.MG][flip[square_64(sq)]];
					}
					/*** Threats ***/
					// -- hanging
					let hg = 0; //hanging(color^1, sq);
					v.threat[PHASE.MG] += hanging_t[PHASE.MG] * hg;
					v.threat[PHASE.EG] += hanging_t[PHASE.EG] * hg;

					//-- king threat
					let kt = 0; //king_threat(color^1, sq);
					v.threat[PHASE.MG] += king_threat_t[PHASE.MG] * kt;
					v.threat[PHASE.EG] += king_threat_t[PHASE.EG] * kt;

					//-- pawn_push_threat
					let ppt = pawn_push_threat(color ^ 1, sq);
					v.threat[PHASE.MG] += pawn_push_threat_t[PHASE.MG] * ppt;
					v.threat[PHASE.EG] += pawn_push_threat_t[PHASE.EG] * ppt;
				}

				return v;
			}
			queen_files = 0;
			let white_q = queen(COLORS.WHITE);
			let black_q = queen(COLORS.BLACK);
			let white_p = pieces(COLORS.WHITE);
			let black_p = pieces(COLORS.BLACK);
			let white_pp = pawns(COLORS.WHITE);
			let black_pp = pawns(COLORS.BLACK);

			rlt.pawns[PHASE.MG] +=
				white_pp.pawns[PHASE.MG] - black_pp.pawns[PHASE.MG];
			rlt.pawns[PHASE.EG] +=
				white_pp.pawns[PHASE.EG] - black_pp.pawns[PHASE.EG];

			rlt.mobility[PHASE.MG] +=
				white_q.mobility[PHASE.MG] +
				white_p.mobility[PHASE.MG] -
				black_q.mobility[PHASE.MG] -
				black_p.mobility[PHASE.MG];
			rlt.mobility[PHASE.EG] +=
				white_q.mobility[PHASE.EG] +
				white_p.mobility[PHASE.EG] -
				black_q.mobility[PHASE.EG] -
				black_p.mobility[PHASE.EG];

			rlt.psqt[PHASE.MG] +=
				white_pp.psqt[PHASE.MG] +
				white_q.psqt[PHASE.MG] +
				white_p.psqt[PHASE.MG] -
				black_pp.psqt[PHASE.MG] -
				black_q.psqt[PHASE.MG] -
				black_p.psqt[PHASE.MG];
			rlt.psqt[PHASE.EG] +=
				white_pp.psqt[PHASE.EG] +
				white_q.psqt[PHASE.EG] +
				white_p.psqt[PHASE.EG] -
				black_pp.psqt[PHASE.EG] -
				black_q.psqt[PHASE.EG] -
				black_p.psqt[PHASE.EG];

			rlt.pieces[PHASE.MG] +=
				white_q.pieces[PHASE.MG] +
				white_p.pieces[PHASE.MG] -
				black_q.pieces[PHASE.MG] -
				black_p.pieces[PHASE.MG];
			rlt.pieces[PHASE.EG] +=
				white_q.pieces[PHASE.EG] +
				white_p.pieces[PHASE.EG] -
				black_q.pieces[PHASE.EG] -
				black_p.pieces[PHASE.EG];

			rlt.threat[PHASE.MG] +=
				black_pp.threat[PHASE.MG] +
				black_q.threat[PHASE.MG] +
				black_p.threat[PHASE.MG] -
				(white_pp.threat[PHASE.MG] +
					white_q.threat[PHASE.MG] +
					white_p.threat[PHASE.MG]);
			rlt.threat[PHASE.EG] +=
				black_pp.threat[PHASE.EG] +
				black_q.threat[PHASE.EG] +
				black_p.threat[PHASE.EG] -
				(white_pp.threat[PHASE.EG] +
					white_q.threat[PHASE.EG] +
					white_p.threat[PHASE.EG]);
		}

		function game_evaluation() {
			let rlt = new eval_t();
			rlt.piece_value[PHASE.MG] +=
				board.material_mg[COLORS.WHITE] - board.material_mg[COLORS.BLACK];
			rlt.piece_value[PHASE.EG] =
				board.material_eg[COLORS.WHITE] - board.material_eg[COLORS.BLACK];
			imbalance_total(rlt);
			pieces_total(rlt);

			function sum_score(phase) {
				let total =
					rlt.psqt[phase] +
					rlt.imbalance[phase] +
					rlt.pawns[phase] +
					rlt.pieces[phase] +
					rlt.piece_value[phase] +
					rlt.mobility[phase] +
					rlt.threat[phase] +
					rlt.passed[phase] +
					rlt.space[phase] +
					rlt.king[phase];
				return total;
			}
			let total_score = [0, 0];
			total_score[PHASE.MG] = sum_score(PHASE.MG);
			total_score[PHASE.EG] = sum_score(PHASE.EG);

			return total_score;
		}
		function opposite_bishops() {
			return (
				board.number_pieces[PIECES.WHITEBISHOP] === 1 &&
				board.number_pieces[PIECES.BLACKBISHOP] === 1 &&
				square_color(board.piece_list[PIECE_INDEX(PIECES.WHITEBISHOP, 0)]) !==
					square_color(board.piece_list[PIECE_INDEX(PIECES.BLACKBISHOP, 0)])
			);
		}
		function scale_factor(eg) {
			//--white point of view
			let sf = 64;
			let pos_w = eg > 0 ? board.turn : board.turn ^ 1;
			let pos_b = eg > 0 ? board.turn ^ 1 : board.turn;

			let pc_white =
				board.number_pieces[
					pos_w === COLORS.WHITE ? PIECES.WHITEPAWN : PIECES.BLACKPAWN
				];
			let pc_black =
				board.number_pieces[
					pos_b === COLORS.WHITE ? PIECES.WHITEPAWN : PIECES.BLACKPAWN
				];
			let npm_white =
				board.material_mg[pos_w] -
				get_value_piece[PHASE.MG][PIECES.WHITEKING] -
				get_value_piece[PHASE.MG][pos_w] * pc_white;
			let npm_black =
				board.material_mg[pos_b] -
				get_value_piece[PHASE.MG][PIECES.BLACKKING] -
				get_value_piece[PHASE.MG][pos_b] * pc_black;

			let bishopValueMg = get_value_piece[PHASE.MG][PIECES.WHITEBISHOP];
			let rookValueMg = get_value_piece[PHASE.MG][PIECES.WHITEROOK];
			if (pc_white === 0 && npm_white - npm_black <= bishopValueMg)
				sf = npm_white < rookValueMg ? 0 : npm_black <= bishopValueMg ? 4 : 14;
			if (sf === 64) {
				let ob = +opposite_bishops();
				if (ob && npm_white === bishopValueMg && npm_black === bishopValueMg) {
					sf = 22;
				} else {
					sf = Math.min(sf, 36 + (ob ? 2 : 7) * pc_white);
				}
				let rule50 = board.half_moves;
				sf = Math.max(0, sf - (((rule50 - 12) / 4) << 0));
			}
			return sf;
		}
		function phase() {
			//-- assume middle game and white perspective
			let mg_limit = 15258;
			let eg_limit = 3915;
			let npm_white =
				board.material_mg[COLORS.WHITE] -
				get_value_piece[PHASE.MG][PIECES.WHITEKING] -
				get_value_piece[PHASE.MG][PIECES.WHITEPAWN] *
					board.number_pieces[PIECES.WHITEPAWN];
			let npm_black =
				board.material_mg[COLORS.BLACK] -
				get_value_piece[PHASE.MG][PIECES.BLACKKING] -
				get_value_piece[PHASE.MG][PIECES.BLACKPAWN] *
					board.number_pieces[PIECES.BLACKPAWN];
			let npm = npm_black + npm_white;
			npm = Math.max(eg_limit, Math.min(npm, mg_limit));
			return (((npm - eg_limit) * 128) / (mg_limit - eg_limit)) << 0;
		}

		function main_evaluate() {
			//-- https://hxim.github.io/Stockfish-Evaluation-Guide/
			let game_eval = game_evaluation();
			let mg = game_eval[PHASE.MG],
				eg = game_eval[PHASE.EG];
			let p = phase();
			let tempo = 0;
			if (options.addTempo) {
				tempo = 28 * (board.turn === COLORS.WHITE ? 1 : -1);
			}
			eg *= scale_factor(eg) / 64;
			return (((mg * p + ((eg * (128 - p)) << 0)) / 128) << 0) + tempo;
		}

		/*****************************************************************************
		 * start engine and initialize
		 ****************************************************************************/
		initialize();

		/***************************************************************************
		 * PUBLIC API
		 **************************************************************************/
		return {
			evaluate: (fen) => {
				load(fen);
				return main_evaluate();
			},
		};
	};

	if (window.LiChessTools) LiChessTools.Evaluator = Raccoon;
})();
