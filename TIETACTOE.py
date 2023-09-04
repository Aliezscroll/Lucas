from player import Human, Computer, GeniusComputer
import time


class TicTacToe:
	def __init__(self):
		self.board = [' ' for _ in range(9)]
		self.cur_winner = None

	def print_board(self):
		for row in [self.board[i * 3:(i + 1) * 3] for i in range(3)]:
			print('| ' + '|'.join(row) + ' |')

	def print_board_nums(self):
		for row in [[str(i) for i in range(j * 3, (j + 1) * 3)] for j in range(3)]:
			print('| ' + ' | '.join(row) + ' |')

	def available_move(self):
		return [i for i, spot in enumerate(self.board) if spot == ' ']

	def empty_square(self):
		return ' ' in self.board

	def num_empty_squares(self):
		return self.board.count(' ')

	def make_move(self, square, letter):
		if self.board[square] == ' ':
			self.board[square] = letter
			if self.winner(square, letter):
				self.cur_winner = letter
			return True
		return False

	def winner(self, square, letter):
		row_ind = square // 3
		row = self.board[row_ind * 3:(row_ind + 1) * 3]

		if all([s == letter for s in row]):
			return True
		col_ind = square % 3
		column = [self.board[col_ind + i * 3] for i in range(3)]
		# print('col', column)
		if all([s == letter for s in column]):
			return True
		if square % 2 == 0:
			diagonal1 = [self.board[i] for i in [0, 4, 8]]
			# print('diag1', diagonal1)
			if all([s == letter for s in diagonal1]):
				return True
			diagonal2 = [self.board[i] for i in [2, 4, 6]]
			# print('diag2', diagonal2)
			if all([s == letter for s in diagonal2]):
				return True
		return False


def play(game, x_player, o_player, print_game=True):
	if print_game:
		game.print_board_nums()
	letter = 'X'

	while game.empty_square():
		if letter == 'X':
			square = x_player.get_move(game)
		else:
			square = o_player.get_move(game)

		if game.make_move(square, letter):
			if print_game:
				print(f'{letter} moves to square {square}')
				game.print_board()
				print('')

			if game.cur_winner:
				if print_game:
					print(f'{letter} won!')
				return letter

			letter = 'O' if letter == 'X' else 'X'
		# time.sleep(0.8)
	if print_game:
		print('It\'s a tie!')


x_win = 0
O_win = 0
tie = 0
for _ in range(10):
	t = TicTacToe()
	x_player = Computer('X')
	o_player = GeniusComputer('O')
	res = play(t, x_player, o_player, print_game=False)

	if res == 'X':
		x_win += 1
	elif res == 'O':
		O_win += 1
	else:
		tie += 1
print(f'X_win {x_win},O_win {O_win}, tie_win {tie}')


import random


class Player:
	def __init__(self, letter):
		self.letter = letter

	def get_move(self, game):
		pass


class Human(Player):
	def __init__(self, letter):
		super().__init__(letter)

	def get_move(self, game):
		valid_square = False
		val = None

		while not valid_square:
			square = input(f'{self.letter} "s turn, input(0-8): ')
			try:
				val = int(square)
				if val not in game.available_move():
					raise ValueError
				valid_square = True
			except ValueError:
				print('Invalid val try another one')
		return val


class Computer(Player):
	def __init__(self, letter):
		super().__init__(letter)

	def get_move(self, game):
		square = random.choice(game.available_move())
		return square


class GeniusComputer(Player):
	def __init__(self, letter):
		super().__init__(letter)

	def get_move(self, game):
		if len(game.available_move()) == 9:
			square = random.choice(game.available_move())

		else:
			square = self.minimax(game, self.letter)['position']
		return square

	def minimax(self, state, player):
		max_player = self.letter
		other_player = 'O' if player == 'X' else 'X'

		if state.cur_winner == other_player:
			return {'position': None,
			        'score': 1 * (state.num_empty_squares() + 1) if other_player == max_player else -1 * (
					        state.num_empty_squares() + 1)}
		elif not state.empty_square():
			return {'position': None, 'score': 0}

		if player == max_player:
			best = {'position': None, 'score': float('-inf')}  # each score should maximize
		else:
			best = {'position': None, 'score': float('inf')}  # each score should minimize

		for possible_move in state.available_move():
			state.make_move(possible_move, player)
			sim = self.minimax(state, other_player)

			state.board[possible_move] = ' '
			state.cur_winner = None
			sim['position'] = possible_move

			if player == max_player:
				if sim['score'] > best['score']:
					best = sim
			else:
				if sim['score'] < best['score']:
					best = sim
		return best
