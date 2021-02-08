import './app.sass'
import {GameCore} from './models/GameCore'
import {exampleLevel} from './constants/exampleLevel'

const canvas = document.getElementById('canvas') as HTMLCanvasElement

const gameCore = new GameCore(canvas)
    .drawLevel(exampleLevel)

document.addEventListener('keydown', event => gameCore.move(event))
