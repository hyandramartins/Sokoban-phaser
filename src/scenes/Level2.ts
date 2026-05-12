import Game from './Game'

export default class Level2 extends Game {
    constructor() {
        super('level2')
    }

    create() {
        this.levelData = [
            [99, 99, 99, 99, 99, 99, 99, 99],
            [99, 0, 0, 99, 51, 0, 0, 99],
            [99, 52, 6, 99, 7, 0, 25, 99],
            [99, 0, 0, 0, 0, 0, 0, 99],
            [99, 0, 0, 0, 0, 0, 38, 99],
            [99, 0, 0, 8, 0, 0, 0, 99],
            [99, 0, 0, 99, 0, 0, 0, 99],
            [99, 99, 99, 99, 99, 99, 99, 99],
        ]

        this.levelFloor = this.levelData.map(row =>
            row.map(() => 88)
        )

        this.nextLevelName = 'level3'
        super.create()
    }
}