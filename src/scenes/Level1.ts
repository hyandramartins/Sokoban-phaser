import Game from './Game'

export default class Level1 extends Game {
    constructor() {
        super('level1');
    }

    create() {

        this.levelData = [
            [98, 98, 98, 98, 98, 98, 98, 98],
            [98, 0, 0, 0, 0, 0, 0, 98],
            [98, 52, 0, 100, 7, 0, 0, 98],
            [98, 0, 0, 100, 0, 0, 38, 98],
            [98, 0, 0, 0, 0, 0, 0, 98],
            [98, 0, 0, 0, 100, 0, 0, 98],
            [98, 0, 0, 0, 0, 0, 0, 98],
            [98, 98, 98, 98, 98, 98, 98, 98],
        ]

        this.levelFloor = this.levelData.map(row =>
            row.map(() => 89)
        )

        this.nextLevelName = 'level2'


        super.create()
    }
}
