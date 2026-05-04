import Phaser from 'phaser'
import Game from './scenes/Game'
import Level1 from './scenes/Level1'
import Level2 from './scenes/Level2'

const config = {
	type: Phaser.AUTO,
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 800,
		height: 600
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { x: 0, y: 0 }
		}
	},
	scene: [Level1, Level2]
}

export default new Phaser.Game(config) 