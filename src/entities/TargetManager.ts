import Phaser from 'phaser'
import { boxColorToTargetColor } from '../utils/ColorTarget'

export default class TargetManager {

    private layer: Phaser.Tilemaps.TilemapLayer
    private coveredByColor: { [key: number]: number } = {}

    constructor(layer: Phaser.Tilemaps.TilemapLayer) {
        this.layer = layer
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
}