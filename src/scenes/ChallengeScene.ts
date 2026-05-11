import Phaser from 'phaser';

export default class ChallengeScene extends Phaser.Scene {
    private inputText!: Phaser.GameObjects.Text;
    private answer: string = '';
    private correctAnswer: string = '';
    private parentSceneKey: string = '';

    constructor() {
        super('ChallengeScene');
    }

    // Recebe a informação de qual fase chamou o desafio (ex: 'level1' ou 'level2')
    init(data: { parentScene: string }) {
        this.parentSceneKey = data.parentScene;
    }

    create() {
        const width = this.scale.width;
        const height = this.scale.height;

        // Gera uma conta matemática simples aleatória (soma ou subtração)
        const num1 = Phaser.Math.Between(1, 10);
        const num2 = Phaser.Math.Between(1, 10);
        const isAddition = Phaser.Math.Between(0, 1) === 1;

        let questionText = '';
        if (isAddition) {
            questionText = `${num1} + ${num2} = ?`;
            this.correctAnswer = (num1 + num2).toString();
        } else {
            // Garante que o número maior fica primeiro para não dar resultado negativo
            const max = Math.max(num1, num2);
            const min = Math.min(num1, num2);
            questionText = `${max} - ${min} = ?`;
            this.correctAnswer = (max - min).toString();
        }

        // Fundo escuro semi-transparente
        this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.7);

        // Fundo do Modal
        this.add.rectangle(width / 2, height / 2, 400, 250, 0xf4e4bc).setStrokeStyle(4, 0x5a3a22);

        // Textos principais
        this.add.text(width / 2, height / 2 - 80, 'Fase Concluída!', { color: '#000', fontSize: '22px', fontStyle: 'bold' }).setOrigin(0.5);
        this.add.text(width / 2, height / 2 - 50, 'Resolva o desafio para avançar:', { color: '#555', fontSize: '16px' }).setOrigin(0.5);

        // Mostra a conta na tela
        this.add.text(width / 2, height / 2 - 10, questionText, { 
            color: '#000', 
            fontSize: '36px', 
            fontStyle: 'bold' 
        }).setOrigin(0.5);

        // Campo onde aparece a digitação
        this.inputText = this.add.text(width / 2, height / 2 + 50, '', { 
            color: '#000', 
            backgroundColor: '#ffffff', 
            padding: { x: 10, y: 10 }, 
            fixedWidth: 100, 
            align: 'center',
            fontSize: '24px'
        }).setOrigin(0.5);

        // Texto de erro (invisível no início)
        const errorText = this.add.text(width / 2, height / 2 + 100, 'Resposta incorreta. Tente novamente!', { color: '#cc0000', fontSize: '14px', fontStyle: 'bold' }).setOrigin(0.5).setVisible(false);

        // Lógica de digitação
        this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
            if (event.key === 'Backspace') {
                this.answer = this.answer.slice(0, -1);
            } else if (event.key === 'Enter') {
                if (this.answer === this.correctAnswer) {
                    // Acertou! Retoma a fase (o que vai ativar a mudança para a próxima fase no BoxManager)
                    this.scene.resume(this.parentSceneKey);
                    this.scene.stop(); 
                } else {
                    // Errou!
                    errorText.setVisible(true);  
                    this.answer = '';            
                }
            } else if (event.key.match(/^[0-9]$/) && this.answer.length < 3) {
                // Aceita apenas números (máximo de 3 dígitos)
                this.answer += event.key;
                errorText.setVisible(false);
            }
            
            this.inputText.setText(this.answer);
        });
    }
}