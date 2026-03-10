import Phaser from 'phaser'
import Game from './scenes/Game'

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
	scene: [Game]
}

export default new Phaser.Game(config) 