import Phaser from 'phaser'
import * as Colors from '../data/Colors'
import { boxColorToTargetColor } from '../utils/ColorTarget'
import Level from '../core/Level'
import BoxManager from '../entities/BoxManager'
import Player from '../entities/Player'
import TargetManager from '../entities/TargetManager'
import MovementController from '../core/MovementController'

export default class Game extends Phaser.Scene {

    //private layer?: Phaser.Tilemaps.TilemapLayer (não precisa mais dessa variável, porque a classe Level já tem a layer, então é só usar level.getLayer() para acessar a layer)
    private level!: Level
    private boxes!: BoxManager
    private player!: Player
    private targets!: TargetManager
    private movement!: MovementController

    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys
    protected levelData: number[][] = []
    protected levelFloor: number[][] = []
    protected nextLevelName: string = ''

    constructor(key: string = 'teste') { //key é o nome da cena, que é usado para referenciar ela (ex: para mudar de cena, a gente usa esse nome)
        super(key) // chama o construtor da classe pai (Phaser.Scene)
        console.log(`Scene ${key} criada`)
    }

    preload() {
        this.load.spritesheet('tiles', '/assets/sokoban_tilesheet.png', {
            frameWidth: 64,
            frameHeight: 64
        })

    }

    create() {
        if (!this.levelData || !this.levelFloor) {
            throw new Error("levelData ou levelFloor não definido na fase")
        }

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

        /*if (this.levelData.length === 0) {
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
        }*/

        this.level = new Level(this, this.levelData, this.levelFloor)
        const layer = this.level.getLayer()

        this.player = new Player(this, layer)

        this.targets = new TargetManager(layer)

        this.boxes = new BoxManager(
            this,
            layer,
            this.level,
            this.targets,
            () => {
                this.scene.start(this.nextLevelName)
            }
        )

        this.movement = new MovementController(
            this,
            this.player,
            this.level,
            this.boxes
        )

        //texto que serve de botão
        const nextButton = this.add.text(1, 50, '➜', {
            fontSize: '24px',
            color: '#000',
            fontStyle: 'bold',
            backgroundColor: '#3498db',
            padding: { x: 10, y: 5 }
        })
        nextButton.setInteractive({ useHandCursor: true })

        // Quando clicar, para a cena atual e começa a próxima fase

        nextButton.on('pointerdown', () => {
            if (this.nextLevelName) {
                this.scene.start(this.nextLevelName)
            }
        })
        const restartButton = this.add.text(1, 100, '↺', {
            fontSize: '24px',
            color: '#000',
            fontStyle: 'bold',
            backgroundColor: '#2ecc71',
            padding: { x: 10, y: 5 }
        });

        restartButton.setInteractive({ useHandCursor: true });

        restartButton.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    update() {
        if (!this.cursors) return

        const justLeft = Phaser.Input.Keyboard.JustDown(this.cursors.left!)
        const justRight = Phaser.Input.Keyboard.JustDown(this.cursors.right!)
        const justUp = Phaser.Input.Keyboard.JustDown(this.cursors.up!)
        const justDown = Phaser.Input.Keyboard.JustDown(this.cursors.down!)

        if (justLeft) this.movement.tryMove(-64, 0, 'left')
        else if (justRight) this.movement.tryMove(64, 0, 'right')
        else if (justUp) this.movement.tryMove(0, -64, 'up')
        else if (justDown) this.movement.tryMove(0, 64, 'down')
    }

}