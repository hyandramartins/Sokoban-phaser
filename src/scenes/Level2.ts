import Game from './Game'

export default class Level2 extends Game {
    constructor() {
        super('level2') 
    }

    create() {
        this.levelData = [
            [100, 100, 100, 100, 100],
            [100, 52, 0, 7, 100], 
            [100, 0, 8, 0, 100],
            [100, 0, 0, 0, 100],
            [100, 100, 100, 100, 100]
        ]
    this.nextLevelName = ''
        super.create() 
    }
}