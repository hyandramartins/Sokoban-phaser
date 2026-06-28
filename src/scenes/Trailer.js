import Phaser from 'phaser'

export default class Trailer extends Phaser.Scene {
    constructor() {
       
        super('trailer_final')
    }

    preload() {
       
        this.load.video('meuTrailer', '/assets/trailer_final.mp4')
    } 

    create() {
        const video = this.add.video(400, 300, 'meuTrailer')
        
        video.play(true)

        video.on('complete', () => {
            console.log('O vídeo acabou.')
        })
    }
}