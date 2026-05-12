import Phaser from 'phaser'

export default class Level {
    private layer: Phaser.Tilemaps.TilemapLayer
    private floorLayer: Phaser.Tilemaps.TilemapLayer

    constructor(scene: Phaser.Scene, levelData: number[][], levelFloor: number[][]) {

        const map = scene.make.tilemap({
            data: levelData,
            tileWidth: 64,
            tileHeight: 64
        })

        const floorMap = scene.make.tilemap({
            data: levelFloor,
            tileWidth: 64,
            tileHeight: 64
        })

        const tileset = map.addTilesetImage('tiles')
        const floorTileset = floorMap.addTilesetImage('tiles')

        if (!tileset || !floorTileset) {
            throw new Error("Tileset não encontrado")
        }

        // chão

        const floorLayer = floorMap.createLayer(0, floorTileset, 50, 50);

        //Criar a camada (ela nasce no Depth 0 por padrão)

        if (!floorLayer) {
            throw new Error("Erro ao criar floorLayer")
        }

        //Mudar a profundidade para -1 (atrás de tudo)
        floorLayer.setDepth(-1);

        // paredes e outros objetos
        const layer = map.createLayer(0, tileset, 50, 50);

        if (!layer) {
            throw new Error("Erro ao criar layer")
        }

        this.floorLayer = floorLayer
        this.layer = layer

    }

    getLayer() {
        return this.layer
    }

    hasWallAt(x: number, y: number): boolean { // tem uma parede nessa posição?
        const tile = this.layer.getTileAtWorldXY(x, y)
        return (
            tile?.index === 100 ||
            tile?.index === 99 ||
            tile?.index === 98 ||
            tile?.index === 97
        )
    }

    getTileAt(x: number, y: number) {
        return this.layer.getTileAtWorldXY(x, y)
    }
}