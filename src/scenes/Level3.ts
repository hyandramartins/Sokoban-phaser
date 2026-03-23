import Game from './Game'

export default class Level3 extends Game {
    constructor() {
        super('level3') 
    }

    create() {
        this.levelData = [
            [100, 100, 100, 100, 100],
            [100, 52, 0, 7, 100], 
            [100, 0, 8, 0, 100],
            [100, 0, 0, 0, 100],
            [100, 100, 100, 100, 100]
        ]
    this.nextLevelName = 'teste'
        super.create() 
    }
}