import {LevelStore} from './LevelStore'
import {LayerContent} from './LayerContent'
import {XYCoordinate} from './XYCoordinate'
import {DynamicContent} from './DynamicContent'
import {EventKey} from './EventKey'

export class GameCore {
    private ctx: CanvasRenderingContext2D
    private level: LevelStore
    private readonly canvasDiameter: number
    private step: number
    private get boxSpaceDiameter() {
        return Math.floor(this.step / 2)
    }
    private get boxDiameter() {
        return Math.floor(0.9 * this.step)
    }
    private draw(coordinate: XYCoordinate) {
        return {x: coordinate.x * this.step, y: coordinate.y * this.step}
    }

    constructor(canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext('2d')

        if (ctx === null) {
            throw new Error('ctx is null')
        }

        if (canvas.width !== canvas.height) {
            throw new Error('canvas should be square')
        }

        this.canvasDiameter = canvas.width
        this.ctx = ctx

        return this
    }

    drawLevel(level: LevelStore) {
        level.currentPosition = { ...level.initialPosition }
        this.level = level
        this.step = Math.floor(this.canvasDiameter / level.layerDots.length)

        level.layerDots.forEach((row, y) => {
            row.forEach((dot, x) => {
                const c = this.draw({x, y})
                switch (dot) {
                    case LayerContent.Wall:
                        this.ctx.fillRect(c.x, c.y, this.step, this.step)
                        break
                    case LayerContent.Space:
                        break
                    case LayerContent.BoxSpace:
                        this.drawBoxSpace({x, y})
                        break
                    default:
                        break
                }
            })
        })

        const initialPosition = level.initialPosition

        this.drawDynamicContent(initialPosition.playerCoordinate, DynamicContent.Player)

        initialPosition.boxesCoordinates.forEach(coordinate =>
            this.drawDynamicContent(coordinate, DynamicContent.Box))

        return this
    }

    move(event: KeyboardEvent) {
        const currentPosition = this.level.currentPosition
        if (currentPosition === undefined) {
            throw new Error('current position is undefined')
        }

        const coordinate = currentPosition.playerCoordinate

        if (this.invalidDynamicCoordinate(coordinate.x) || this.invalidDynamicCoordinate(coordinate.y)) {
            throw new Error('coordinate is invalid')
        }

        const next = { ...coordinate }
        const doubleNext = { ...coordinate }
        switch (event.key) {
            case EventKey.Down:
                next.y++
                doubleNext.y += 2
                break
            case EventKey.Up:
                next.y--
                doubleNext.y -= 2
                break
            case EventKey.Left:
                next.x--
                doubleNext.x -= 2
                break
            case EventKey.Right:
                next.x++
                doubleNext.x += 2
                break
            default:
                return
        }

        if (this.isWall(next)) {
            return
        }

        const nextBox = this.getBox(next)
        if (nextBox) {
            if (this.isWall(doubleNext) || this.getBox(doubleNext)) {
                return
            }

            this.moveDynamicContent(next, doubleNext, DynamicContent.Box)
            Object.assign(nextBox, doubleNext)

            this.checkBoxesPlaces()
        }

        this.moveDynamicContent(coordinate, next, DynamicContent.Player)
        Object.assign(coordinate, next)
    }

    private checkBoxesPlaces() {
        const boxesCoordinates = this.level.currentPosition?.boxesCoordinates

        if (boxesCoordinates === undefined) {
            throw new Error('boxes coordinates is undefined')
        }

        for (const coordinate of boxesCoordinates) {
            if (!this.isBoxSpace(coordinate)) {
                return
            }
        }

        console.log('all boxes on places')
    }

    private invalidDynamicCoordinate(c: number) {
        return c < 1 || c > this.level.layerDots.length - 2
    }

    private moveDynamicContent(previous: XYCoordinate, next: XYCoordinate, type: DynamicContent) {
        this.clearDynamicContent(previous)
        this.drawDynamicContent(next, type)
    }

    private checkDrawDot(coordinate: XYCoordinate) {
        if (this.isWall(coordinate)) {
            throw new Error('try to draw dynamic content on wall')
        }
    }

    private clearDynamicContent(coordinate: XYCoordinate) {
        this.checkDrawDot(coordinate)

        const draw = this.draw(coordinate)
        this.ctx.clearRect(draw.x, draw.y, this.step, this.step)

        if (this.isBoxSpace(coordinate)) {
            this.drawBoxSpace(coordinate)
        }
    }

    private drawDynamicContent(coordinate: XYCoordinate, type: DynamicContent) {
        this.checkDrawDot(coordinate)
        const draw = this.draw(coordinate)
        if (type === DynamicContent.Player) {
            this.ctx.beginPath()
            this.ctx.arc(draw.x + this.boxSpaceDiameter, draw.y + this.boxSpaceDiameter,
                this.boxSpaceDiameter / 1.1, 0, 2 * Math.PI)
            this.ctx.stroke()
        } else {
            const shift = (this.step - this.boxDiameter) / 2
            this.ctx.strokeRect(draw.x + shift, draw.y + shift, this.boxDiameter, this.boxDiameter)
        }
    }

    private drawBoxSpace(coordinate: XYCoordinate) {
        const shift = (this.step - this.boxSpaceDiameter) / 2
        const draw = this.draw(coordinate)
        this.ctx.fillRect(draw.x + shift, draw.y + shift,
            this.boxSpaceDiameter, this.boxSpaceDiameter)
    }

    private getBox(coordinate: XYCoordinate) {
        return this.level.currentPosition?.boxesCoordinates
            .find(c => c.x === coordinate.x && c.y === coordinate.y)
    }

    private isWall(coordinate: XYCoordinate) {
        return this.level.layerDots[coordinate.y][coordinate.x] === LayerContent.Wall
    }

    private isBoxSpace(coordinate: XYCoordinate) {
        return this.level.layerDots[coordinate.y][coordinate.x] === LayerContent.BoxSpace
    }
}
