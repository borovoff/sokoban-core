import {LayerContent} from './LayerContent'
import {GamePosition} from './GamePosition'

export class LevelStore {
    layerDots: LayerContent[][]
    initialPosition: GamePosition
    currentPosition?: GamePosition
}
