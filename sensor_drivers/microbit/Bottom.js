let abssignal = 0
radio.onDataPacketReceived(({ receivedNumber, signal }) => {
    basic.pause(1000)
    abssignal = Math.abs(signal)
    let signalStr = abssignal.toString()
    serial.writeLine(signalStr)
    basic.showNumber(abssignal)
})
basic.showString("Bottom")
radio.setGroup(1)

