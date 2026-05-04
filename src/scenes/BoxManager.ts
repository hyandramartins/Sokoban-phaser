import Phaser from 'phaser'
import * as Colors from '../boxesAndTargets/Colors'
import Level from './Level'
import TargetManager from './TargetManager'

type BoxData = {
    box: Phaser.GameObjects.Sprite
    color: number
}

export default class BoxManager {

    private boxesByColor: { [key: number]: Phaser.GameObjects.Sprite[] } = {}

    constructor(
        private scene: Phaser.Scene,
        private layer: Phaser.Tilemaps.TilemapLayer,
        private level: Level,
        private targets: TargetManager
    ) {
        const boxColors = [
            Colors.BoxOrange,
            Colors.BoxRed,
            Colors.BoxBlue,
            Colors.BoxGreen,
            Colors.BoxGrey
        ]

        boxColors.forEach(color => {
            this.boxesByColor[color] =
                this.layer.createFromTiles(color, 0, {
                    key: 'tiles',
                    frame: color
                }) as Phaser.GameObjects.Sprite[]
        })
    }

    // Verifica se existe caixa em uma posição
    getBoxDataAt(x: number, y: number): BoxData | undefined {
        const keys = Object.keys(this.boxesByColor)

        for (let i = 0; i < keys.length; i++) {
            const color = Number(keys[i])

            const box = this.boxesByColor[color].find(box => {
                return box.getBounds().contains(x, y)
            })

            if (box) {
                return {
                    box,
                    color
                }
            }
        }

        return undefined
    }

    // Tenta empurrar uma caixa
    tryPushBox(boxData: BoxData, dx: number, dy: number): boolean {
        const box = boxData.box

        const nextX = box.x + dx
        const nextY = box.y + dy

        // colisão com parede
        if (this.level.hasWallAt(nextX, nextY)) return false

        // colisão com outra caixa
        if (this.getBoxDataAt(nextX, nextY)) return false

        // saiu do alvo
        if (this.targets.isOnTarget(box.x, box.y, boxData.color)) {
            this.targets.updateTargetState(
                box.x,
                box.y,
                boxData.color,
                -1
            )
        }

        // mover caixa
        this.scene.tweens.add({
            targets: box,
            x: nextX,
            y: nextY,
            duration: 500,
            onComplete: () => {

                // entrou no alvo
                if (this.targets.isOnTarget(box.x, box.y, boxData.color)) {
                    this.targets.updateTargetState(
                        box.x,
                        box.y,
                        boxData.color,
                        1
                    )
                }
            }
        })

        return true
    }
}