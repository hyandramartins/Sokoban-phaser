import Phaser from 'phaser'
import Player from '../entities/Player'
import Level from './Level'
import BoxManager from '../entities/BoxManager'

export default class MovementController {

    constructor(
        private scene: Phaser.Scene,
        private player: Player,
        private level: Level,
        private boxes: BoxManager,
    ) { }

    private isMoving = false

    tryMove(dx: number, dy: number, anim: string) {

        if (this.isMoving) return // espera a animação de movimento atual terminar

        const nx = this.player.x + dx
        const ny = this.player.y + dy

        // parede bloqueia
        if (this.level.hasWallAt(nx, ny)) {
            return
        }

        // checa caixa
        const boxData = this.boxes.getBoxDataAt(nx, ny)

        if (boxData) {
            const moved = this.boxes.tryPushBox(boxData, dx, dy)
            if (!moved) return
        }
        this.isMoving = true
        // move player
        this.player.move(this.scene, dx, dy, anim, () => {
            this.isMoving = false // libera só quando terminar
        })

    }
}