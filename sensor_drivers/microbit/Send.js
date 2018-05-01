basic.showIcon(IconNames.Diamond)
radio.setGroup(1)
radio.setTransmitPower(0)
basic.forever(() => {
        
})
basic.forever(() => {
    basic.showIcon(IconNames.Ghost)
    radio.sendNumber(1)
    basic.pause(1000)
    basic.showIcon(IconNames.StickFigure)
    basic.pause(4000)
})

