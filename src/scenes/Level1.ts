import Game from './Game'

export default class Level1 extends Game {
    constructor() {
        super('level1');
    }

    create() {
        //mapa da segunda fase
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

        this.nextLevelName = 'level2'

   
        super.create() 
    }
}
