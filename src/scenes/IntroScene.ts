import Phaser from 'phaser';

export default class IntroScene extends Phaser.Scene {
    constructor() {
        super('IntroScene');
    }

    preload() {
        this.load.video('trailer', '/assets/trailer.mp4');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        const video = this.add.video(width / 2, height / 2, 'trailer');
        
        video.play();

        // Ouve o evento de 'play' para garantir que as dimensões do vídeo já foram carregadas
        video.on('play', () => {
            // Calcula a proporção necessária para caber na tela sem cortar nada
            const scaleX = width / video.width;
            const scaleY = height / video.height;
            const scale = Math.min(scaleX, scaleY);
            
            video.setScale(scale);
        });

        video.on('complete', () => {
            this.scene.start('level1');
        });

        this.add.text(width / 2, height - 30, 'Pressione ESPAÇO para pular', {
            fontSize: '18px',
            color: '#ffffff',
            backgroundColor: '#00000088',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5);

        this.input.keyboard!.once('keydown-SPACE', () => {
            video.stop();
            this.scene.start('level1');
        });
    }
}