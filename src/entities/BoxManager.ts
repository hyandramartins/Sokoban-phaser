import Phaser from 'phaser'
import * as Colors from '../data/Colors'
import Level from '../core/Level'
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
        private targets: TargetManager,
        private onWin: () => void
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
            duration: 300,
            onComplete: () => {

                // Entrou no alvo
                if (this.targets.isOnTarget(box.x, box.y, boxData.color)) {
                    this.targets.updateTargetState(
                        box.x,
                        box.y,
                        boxData.color,
                        1
                    )
                }
                
                // VERIFICA SE TODAS AS CAIXAS ESTÃO NOS ALVOS
                if (this.targets.isCompleted()) {
                    console.log("TODAS CAIXAS NO ALVO! FASE CONCLUÍDA.")

                    // 1. Pausa o jogo atual
                    this.scene.scene.pause();
                    
                    // 2. Chama a cena do desafio e envia o nome da fase (para o desafio saber para onde voltar)
                    this.scene.scene.launch('ChallengeScene', { parentScene: this.scene.scene.key });

                    // 3. Fica à espera: quando o jogador acertar a conta e o desafio fechar, ele avança de fase
                    this.scene.events.once('resume', () => {
                        this.scene.time.delayedCall(300, () => {
                            this.onWin() 
                        })
                    })
                }
            }
        })

        return true
    }
}