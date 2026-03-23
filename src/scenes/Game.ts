import Phaser from 'phaser'
import * as Colors from '../boxesAndTargets/Colors'
import { boxColorToTargetColor } from '../utils/ColorTarget'

export default class Game extends Phaser.Scene {

    private player?: Phaser.GameObjects.Sprite
    //private blueBoxes?: Phaser.GameObjects.Sprite[] = []
    private layer?: Phaser.Tilemaps.TilemapLayer

    private targetsConveredByColor: { [key: number]: number } = {} //caixa e qtde de alvos daquela cor que estão preenchidos
    private boxesByColor: { [key: number]: Phaser.GameObjects.Sprite[] } = {} //caixas e suas cores

    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    protected levelData: number[][] = []
    protected nextLevelName: string = ''

    constructor(key: string = 'teste') {
        super(key) 
        console.log(`Scene ${key} criada`)
    }

    preload() {
        this.load.spritesheet('tiles', '/assets/sokoban_tilesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })

    }

    create() {

        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys()
        }
        /*
        const floorLevel = [
            [90, 90, 90, 90, 90, 90, 90, 90],
            [90, 90, 90, 90, 90, 90, 90, 90],
            [90, 90, 90, 90, 90, 90, 90, 90],
            [90, 90, 90, 90, 90, 90, 90, 90],
            [90, 90, 90, 90, 90, 90, 90, 90],
            [90, 90, 90, 90, 90, 90, 90, 90],
            [90, 90, 90, 90, 90, 90, 90, 90],
            [90, 90, 90, 90, 90, 90, 90, 90]
        ];

        //Criar o mapa de dados do chão
        const floorMap = this.make.tilemap({
            data: floorLevel,
            tileWidth: 64,
            tileHeight: 64
        });
        const floorTileset = floorMap.addTilesetImage('tiles')

        //Criar a camada (ela nasce no Depth 0 por padrão)

        if (!floorTileset) {
            throw new Error("Tileset não encontrado")
        }
        const floorLayer = floorMap.createLayer(0, floorTileset, 0, 0);

        //Mudar a profundidade para -1 (atrás de tudo)
        if (floorLayer) {
            floorLayer.setDepth(-1);
        }
            */

        /*
        const level = [
            [100, 100, 100, 100, 100, 100, 100, 100],
            [100, 0, 0, 0, 0, 0, 52, 100],
            [100, 6, 7, 8, 9, 10, 0, 100],
            [100, 25, 38, 51, 64, 77, 0, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 100, 100, 100, 100, 100, 100, 100],
        ]

        const map = this.make.tilemap({
            data: level,
            tileWidth: 64,
            tileHeight: 64
        })
            */

        if (this.levelData.length === 0) {
            this.levelData = [
                [100, 100, 100, 100, 100, 100, 100, 100],
                [100, 0, 0, 0, 0, 0, 52, 100],
                [100, 6, 7, 8, 9, 10, 0, 100],
                [100, 25, 38, 51, 64, 77, 0, 100],
                [100, 0, 0, 0, 0, 0, 0, 100],
                [100, 0, 0, 0, 0, 0, 0, 100],
                [100, 0, 0, 0, 0, 0, 0, 100],
                [100, 100, 100, 100, 100, 100, 100, 100],
            ]
        }

        const map = this.make.tilemap({
            data: this.levelData,
            tileWidth: 64,
            tileHeight: 64
        })

        const tileset = map.addTilesetImage('tiles')

        if (!tileset) {
            throw new Error("Tileset não encontrado")
        }

        const layer = map.createLayer(0, tileset, 50, 50); //não ceita null
        if (!layer) throw new Error("Não foi possível criar a layer");
        this.layer = layer;

        this.player = this.layer?.createFromTiles(52, 0, { key: 'tiles', frame: 52 }).pop()

        //this.add.sprite(288, 224, 'tiles', 52)

        this.createPlayerAnims()

        //this.blueBoxes = this.layer?.createFromTiles(8, 0, { key: 'tiles', frame: 8 })
        this.extractBoxes(this.layer)

        //texto que serve de botão
        const nextButton = this.add.text(50, 50, 'Click --> proxima fase', {
            fontSize: '24px',
            color: '#000',          
            fontStyle: 'bold',
            backgroundColor: '#c70a0a',
            padding: { x: 10, y: 5 }
        })
        nextButton.setInteractive({ useHandCursor: true })

        // Quando clicar, para a cena atual e começa a próxima fase

        if (!this.nextLevelName) {
            this.nextLevelName = 'level2'
        }
        nextButton.on('pointerdown', () => {
            if (this.nextLevelName) {
                this.scene.start(this.nextLevelName)
            } else {
                console.log('Fim do jogo ou próxima fase não definida!')
            }
        })
    }

    update() {
        if (!this.cursors || !this.player) {
            return
        }

        const justLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left!)
        const justRight = Phaser.Input.Keyboard.JustDown(this.cursors.right!)
        const justUp = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        const justDown = Phaser.Input.Keyboard.JustDown(this.cursors.down!)

        if (justLeft) {
            const nx = this.player.x - 64
            const ny = this.player.y

            //const box = this.getBoxAt(this.player.x - 64, this.player.y) //ver o que tem na posição para onde o player está indo por isso -64

            //console.dir(box)

            const baseTween = {
                x: '-=64',
                duration: 500
            }

            this.tweenMove(nx, ny, baseTween, () => {
                this.player?.anims.play('left', true)
            })

        }
        else if (justRight) {
            const nx = this.player.x + 64
            const ny = this.player.y

            const baseTween = {
                x: '+=64',
                duration: 500
            }

            this.tweenMove(nx, ny, baseTween, () => {
                this.player?.anims.play('right', true)
            })
        }
        else if (justUp) {
            const nx = this.player.x
            const ny = this.player.y - 64

            const baseTween = {
                y: '-=64',
                duration: 500
            }

            this.tweenMove(nx, ny, baseTween, () => {
                this.player?.anims.play('up', true)
            })
        }
        else if (justDown) {
            const nx = this.player.x
            const ny = this.player.y + 64

            const baseTween = {
                y: '+=64',
                duration: 500
            }

            this.tweenMove(nx, ny, baseTween, () => {
                this.player?.anims.play('down', true)
            })
        }
        /*else if(this.player?.anims.currentAnim){
            const key = this.player.anims.currentAnim?.key
            if(!key.startsWith('idle')){
                this.player.anims.play(`idle-${key}`, true)
            }
        }*/
    }

    private extractBoxes(layer: Phaser.Tilemaps.TilemapLayer) {
        const boxColors = [
            Colors.BoxOrange,
            Colors.BoxRed,
            Colors.BoxBlue,
            Colors.BoxGreen,
            Colors.BoxGrey
        ]

        boxColors.forEach(color => {
            this.boxesByColor[color] = this.layer?.createFromTiles(color, 0, { key: 'tiles', frame: color }) as Phaser.GameObjects.Sprite[]
        })
        console.dir(this.boxesByColor)
    }

    private hasWallAt(x: number, y: number) {
        if (!this.layer) {
            return undefined
        }
        const tile = this.layer.getTileAtWorldXY(x, y) //pega o tile que está na posição (x, y) no mundo.
        if (!tile) { // se não tiver tile nessa posição retorna false
            return false
        }
        return tile.index === 100 // tile 100 é uma parede, retorna true se for uma parede ou false caso contrário
    }

    private tweenMove(x: number, y: number, baseTween: any, onStart: () => void) {
        if (this.tweens.isTweening(this.player!)) { //se o player já estiver se movendo, não faz nada
            return
        }
        const hasWall = this.hasWallAt(x, y)

        if (hasWall) {
            return
        }

        const boxData = this.getBoxDataAt(x, y)
        if (boxData) {
            const box = boxData.box
            const boxColor = boxData.color
            const targetColor = boxColorToTargetColor(boxColor)

            const coveredTarget = this.hasTargetAt(box.x, box.y, targetColor) //verifica se a caixa que vai ser empurrada está em cima de um alvo, se sim, diminui a contagem de alvos preenchidos, porque a caixa vai sair de cima do alvo
            if (coveredTarget) {
                this.changeCountForColor(targetColor, -1)
            }

            this.tweens.add(Object.assign({}, baseTween, {
                targets: box,
                onComplete: () => {
                    const coveredTarget = this.hasTargetAt(box.x, box.y, targetColor)
                    //console.log(coveredTarget)
                    if (coveredTarget) {
                        this.changeCountForColor(targetColor, 1)
                    }
                    console.dir(this.targetsConveredByColor)
                }
            }))
        }

        this.tweens.add(Object.assign({}, baseTween, {
            targets: this.player,
            onStart,
            onComplete: () => {
                // força idle depois da animação
                this.stopPlayerAnimation()
            }
        }))
    }

    private hasTargetAt(x: number, y: number, tileIndex: number) {
        if (!this.layer) {
            return false
        }

        const tile = this.layer.getTileAtWorldXY(x, y)
        if (!tile) {
            return false
        }
        return tile.index === tileIndex
    }

    private changeCountForColor(color: number, change: number) {
        if (!(color in this.targetsConveredByColor)) { //se ainda não tem o id da caixa para cor, inicializa com 0
            this.targetsConveredByColor[color] = 0
        }
        this.targetsConveredByColor[color] += change
    }

    private stopPlayerAnimation() {
        if (!this.player) {
            return
        }
        const key = this.player.anims.currentAnim?.key
        if (!key?.startsWith('idle')) {
            this.player.anims.play(`idle-${key}`, true)
        }
    }

    private getBoxDataAt(x: number, y: number) {//existe uma caixa nessa posição? retorna a caixa
        const keys = Object.keys(this.boxesByColor) //pega as cores das caixas
        for (let i = 0; i < keys.length; i++) {
            const color = Number(keys[i])
            const box = this.boxesByColor[color].find(box => {
                const rect = box.getBounds()   //pega o retangulo da caixa
                return rect.contains(x, y)     // retorna true ou false --> o retangulo contém as coordenadas x e y?
            })

            if (!box) {
                continue
            }

            return {
                box,
                color: Number(color)
            }
        }

        return undefined
    }

    private createPlayerAnims() {
        this.anims.create({
            key: 'idle-down',
            frames: [{ key: 'tiles', frame: 52 }],
        })
        this.anims.create({
            key: 'idle-left',
            frames: [{ key: 'tiles', frame: 81 }],
        })
        this.anims.create({
            key: 'idle-right',
            frames: [{ key: 'tiles', frame: 78 }],
        })
        this.anims.create({
            key: 'idle-up',
            frames: [{ key: 'tiles', frame: 55 }],
        })

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 81, end: 83
            }),
            frameRate: 10, //10 frames por segundo
            repeat: -1 //quantas vezes a animação deve se repetir, -1 para infinito

        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 78, end: 80
            }),
            frameRate: 10,
            repeat: -1

        })

        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 55, end: 57
            }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('tiles', {
                start: 52, end: 54
            }),
            frameRate: 10,
            repeat: -1
        })
    }

}