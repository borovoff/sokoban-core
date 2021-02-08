import {LevelStore} from '../models/LevelStore'
import {LayerContent} from '../models/LayerContent'

export const exampleLevel: LevelStore = {
    layerDots: [
        [LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall],
        [LayerContent.Wall, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Wall],
        [LayerContent.Wall, LayerContent.BoxSpace, LayerContent.BoxSpace, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Wall],
        [LayerContent.Wall, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Wall],
        [LayerContent.Wall, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Wall],
        [LayerContent.Wall, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Space, LayerContent.Wall],
        [LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall, LayerContent.Wall],
    ],
    initialPosition: {
        playerCoordinate: {
            x: 1,
            y: 1
        },
        boxesCoordinates: [
            {
                x: 1,
                y: 2
            },
            {
                x: 2,
                y: 2
            }
        ]
    }
}
