import Game from './Game'

export default class Level2 extends Game {
    constructor() {
        super('level2')
    }

    create() {
        this.levelData = [
            [100, 100, 100, 100, 100, 100, 100, 100],
            [100, 0, 0, 0, 0, 0, 52, 100],
            [100, 0, 7, 0, 0, 10, 0, 100],
            [100, 0, 38, 0, 0, 77, 0, 100],
            [100, 0, 0, 38, 0, 0, 0, 100],
            [100, 0, 7, 0, 0, 0, 0, 100],
            [100, 0, 0, 0, 0, 0, 0, 100],
            [100, 100, 100, 100, 100, 100, 100, 100],
        ]
        this.nextLevelName = ''
        super.create()
    }
}