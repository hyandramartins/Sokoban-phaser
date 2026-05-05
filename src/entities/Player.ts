import Phaser from 'phaser'

export default class Player {

    private sprite: Phaser.GameObjects.Sprite

    constructor(
        scene: Phaser.Scene,
        layer: Phaser.Tilemaps.TilemapLayer
    ) {
        // transforma um tile do mapa em um Sprite (objeto do jogo)
        const player = layer.createFromTiles(52, 0, { key: 'tiles', frame: 52 }).pop()

        if (!player) {
            throw new Error("Player não criado")
        }

        this.sprite = player

        this.createAnims(scene)
    }

    getSprite() {
        return this.sprite
    }

    get x() {
        return this.sprite.x
    }

    get y() {
        return this.sprite.y
    }

    move(scene: Phaser.Scene, dx: number, dy: number, anim: string, afterMove?: () => void) {

        scene.tweens.add({
            targets: this.sprite,
            x: this.sprite.x + dx,
            y: this.sprite.y + dy,
            duration: 500,
            onStart: () => {
                this.sprite.anims.play(anim, true)
            },
            onComplete: () => {
                this.stopAnimation()
                afterMove?.() // libera movimento
            }
        })
    }

    stopAnimation() {
        const key = this.sprite.anims.currentAnim?.key

        if (!key?.startsWith('idle')) {
            this.sprite.anims.play(`idle-${key}`, true)
        }
    }

    private createAnims(scene: Phaser.Scene) {

        scene.anims.create({
            key: 'idle-down',
            frames: [{ key: 'tiles', frame: 52 }]
        })

        scene.anims.create({
            key: 'idle-left',
            frames: [{ key: 'tiles', frame: 81 }]
        })

        scene.anims.create({
            key: 'idle-right',
            frames: [{ key: 'tiles', frame: 78 }]
        })

        scene.anims.create({
            key: 'idle-up',
            frames: [{ key: 'tiles', frame: 55 }]
        })

        scene.anims.create({
            key: 'left',
            frames: scene.anims.generateFrameNumbers('tiles', {
                start: 81, end: 83
            }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'right',
            frames: scene.anims.generateFrameNumbers('tiles', {
                start: 78, end: 80
            }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'up',
            frames: scene.anims.generateFrameNumbers('tiles', {
                start: 55, end: 57
            }),
            frameRate: 10,
            repeat: -1
        })

        scene.anims.create({
            key: 'down',
            frames: scene.anims.generateFrameNumbers('tiles', {
                start: 52, end: 54
            }),
            frameRate: 10,
            repeat: -1
        })
    }
}