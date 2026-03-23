import * as Color from '../boxesAndTargets/Colors'

const boxColorToTargetColor = (boxColor: number) => {
    switch (boxColor) {
        case Color.BoxOrange: 
            return Color.TargetOrange;
        case Color.BoxRed: 
            return Color.TargetRed;
        case Color.BoxBlue: 
            return Color.TargetBlue;
        case Color.BoxGreen: 
            return Color.TargetGreen;
        case Color.BoxGrey: 
            return Color.TargetGrey;
        default:
            return -1
    }
}

export {boxColorToTargetColor}
