import Game from './Game'

export default class Level2 extends Game {
    constructor() {
        super('level2');
    }

    create() {
        //mapa da segunda fase
        this.levelData = [
            [100, 100, 100, 100, 100, 100],
            [100, 0, 0, 0, 0, 100],
            [100, 0, 0, 7, 0, 100],
            [100, 0, 52, 8, 0, 100], 
            [100, 100, 100, 100, 100, 100]
        ]

        this.nextLevelName = 'level3'

        //Chama o create da mãe, que agora usará o mapa acima
        super.create() 
    }
}