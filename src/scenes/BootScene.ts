import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {
    constructor() {
        super('BootScene');
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Texto centralizado na tela
        this.add.text(width / 2, height / 2, 'Clique em qualquer lugar para Iniciar', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);

        // O evento de clique (pointerdown) satisfaz a regra do navegador
        this.input.once('pointerdown', () => {
            this.scene.start('IntroScene'); // Chama a cena do trailer logo após o clique
        });
    }
}