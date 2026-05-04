import Phaser from 'phaser'

export default class Level {
    private layer: Phaser.Tilemaps.TilemapLayer

    constructor(scene: Phaser.Scene, levelData: number[][]) {

        const map = scene.make.tilemap({
            data: levelData,
            tileWidth: 64,
            tileHeight: 64
        })

        const tileset = map.addTilesetImage('tiles')
        if (!tileset) {
            throw new Error("Tileset não encontrado")
        }

        const layer = map.createLayer(0, tileset, 50, 50)
        if (!layer) {
            throw new Error("Não foi possível criar a layer")
        }

        this.layer = layer
    }

    getLayer() {
        return this.layer
    }

    hasWallAt(x: number, y: number): boolean { // tem uma parede nessa posição?
        const tile = this.layer.getTileAtWorldXY(x, y)
        return tile?.index === 100 // se tile existir, pega o index e vê se é igual a 100 (que é o número do tile da parede) 
    }

    getTileAt(x: number, y: number) {
        return this.layer.getTileAtWorldXY(x, y)
    }
}