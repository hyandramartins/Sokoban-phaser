import Phaser from 'phaser'
import { boxColorToTargetColor } from '../utils/ColorTarget'
import * as Colors from '../data/Colors'

export default class TargetManager {

    private layer: Phaser.Tilemaps.TilemapLayer
    private coveredByColor: { [key: number]: number } = {}
    private totalTargetsByColor: { [key: number]: number } = {}

    constructor(layer: Phaser.Tilemaps.TilemapLayer) {
        this.layer = layer

        const boxColors = [
            Colors.BoxOrange,
            Colors.BoxRed,
            Colors.BoxBlue,
            Colors.BoxGreen,
            Colors.BoxGrey
        ]

        this.layer.forEachTile(tile => {
            const index = tile.index

            for (let i = 0; i < boxColors.length; i++) {
                const targetColor = boxColorToTargetColor(boxColors[i])

                if (index === targetColor) {
                    if (!(targetColor in this.totalTargetsByColor)) {
                        this.totalTargetsByColor[targetColor] = 0
                    }

                    this.totalTargetsByColor[targetColor]++
                }
            }
        })

        console.log("Total de alvos:", this.totalTargetsByColor)
    }

    isOnTarget(x: number, y: number, boxColor: number): boolean {
        const targetColor = boxColorToTargetColor(boxColor)

        const tile = this.layer.getTileAtWorldXY(x, y)
        if (!tile) return false

        return tile.index === targetColor //o tile que está aqui é o alvo dessa cor?
    }

    updateTargetState(
        x: number,
        y: number,
        boxColor: number,
        change: number
    ) {
        const targetColor = boxColorToTargetColor(boxColor)

        if (!(targetColor in this.coveredByColor)) { // essa chave existe dentro desse objeto ?
            this.coveredByColor[targetColor] = 0
        }

        this.coveredByColor[targetColor] += change

        console.log(this.coveredByColor)
    }

    isCompleted(): boolean {
        const colors = Object.keys(this.totalTargetsByColor)

        for (let i = 0; i < colors.length; i++) {
            const color = Number(colors[i])

            const total = this.totalTargetsByColor[color]
            const covered = this.coveredByColor[color] || 0

            if (covered < total) {
                return false
            }
        }

        return true
    }
}