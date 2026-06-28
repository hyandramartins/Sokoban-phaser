import Game from './Game'

export default class Level3 extends Game {
    constructor() {
        super('level3')
    }

    create() {
        this.levelData = [
            [97, 97, 97, 97, 97, 97, 97, 97],
            [97, 0, 0, 0, 0, 0, 0, 97],
            [97, 52, 100, 0, 100, 7, 0, 97],
            [97, 0, 0, 0, 38, 0, 51, 97],
            [97, 0, 100, 8, 100, 9, 64, 97],
            [97, 0, 0, 0, 0, 0, 0, 97],
            [97, 0, 0, 0, 0, 0, 0, 97],
            [97, 97, 97, 97, 97, 97, 97, 97],
        ]

        this.levelFloor = this.levelData.map(row =>
            row.map(() => 90)
        )

        // Aqui você coloca o nome exato que registrou no super() da cena do vídeo
        this.nextLevelName = 'trailer_final' 
        
        super.create()
    }
}