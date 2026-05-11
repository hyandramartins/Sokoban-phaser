import Phaser from 'phaser'
import BootScene from './scenes/BootScene'
import IntroScene from './scenes/IntroScene'
import Level1 from './scenes/Level1'
import Level2 from './scenes/Level2'
import ChallengeScene from './scenes/ChallengeScene'
// A importação do 'Game' foi removida, pois não estava a ser usada no array de cenas original.

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
    // A ordem importa: primeiro o clique, depois o vídeo, depois a primeira fase
    scene: [BootScene, IntroScene, Level1, Level2, ChallengeScene]
}

export default new Phaser.Game(config)