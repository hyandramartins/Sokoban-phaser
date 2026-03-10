import Phaser from 'phaser'

export default class Game extends Phaser.Scene {

    private player?: Phaser.GameObjects.Sprite
    private boxes?: Phaser.GameObjects.Sprite[] = []
    private layer?: Phaser.Tilemaps.TilemapLayer

    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys

    constructor() {
        console.log("scene criada")
        super('teste')
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

        const level = [
            [100, 100, 100, 100, 100, 100, 100, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 0, 0, 51, 8, 0, 52, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 100, 100, 100, 100, 100, 100, 100],
        ]

        const map = this.make.tilemap({
            data: level,
            tileWidth: 64,
            tileHeight: 64
        })

        const tileset = map.addTilesetImage('tiles')

        if (!tileset) {
            throw new Error("Tileset não encontrado")
        }
        
        const layer = map.createLayer(0, tileset, 0, 0); //não ceita null
        if (!layer) throw new Error("Não foi possível criar a layer");
        this.layer = layer;

        this.player = this.layer?.createFromTiles(52, 0, { key: 'tiles', frame: 52 }).pop()

        //this.add.sprite(288, 224, 'tiles', 52)

        this.createPlayerAnims()

        this.boxes = this.layer?.createFromTiles(8, 0, { key: 'tiles', frame: 8 })


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

    private hasWallAt(x: number, y: number) {
        if(!this.layer){
            return undefined
        }
        const tile = this.layer.getTileAtWorldXY(x, y) //pega o tile que está na posição (x, y) no mundo.
        if(!tile){ // se não tiver tile nessa posição retorna false
            return false
        }
        return tile.index === 100 // tile 100 é uma parede, retorna true se for uma parede ou false caso contrário
    }

    private tweenMove(x: number, y: number, baseTween: any, onStart: () => void) {
        if(this.tweens.isTweening(this.player!)){ //se o player já estiver se movendo, não faz nada
            return
        }
        const hasWall = this.hasWallAt(x, y)

        if(hasWall){
                return
        }

        const box = this.getBoxAt(x, y)
        if (box) {
            this.tweens.add(Object.assign({}, baseTween, { targets: box })) 
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

    private stopPlayerAnimation() {
        if (!this.player) {
            return
        }
        const key = this.player.anims.currentAnim?.key
        if (!key?.startsWith('idle')) {
            this.player.anims.play(`idle-${key}`, true)
        }
    }

    private getBoxAt(x: number, y: number) {//existe uma caixa nessa posição? retorna a caixa
        return this.boxes?.find(box => {   // retorna a caixa que tem o retangulo que contém as coordenadas x e y
            const rect = box.getBounds()   //pega o retangulo da caixa
            return rect.contains(x, y)     // retorna true ou false --> o retangulo contém as coordenadas x e y?
        })
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