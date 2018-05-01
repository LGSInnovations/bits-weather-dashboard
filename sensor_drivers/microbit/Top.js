radio.onDataPacketReceived( ({ receivedNumber, signal }) =>  {
    abssignal = Math.abs(signal)
    let signalStr = abssignal.toString()
serial.writeLine(signalStr)
    basic.showNumber(abssignal)
})
let abssignal = 0
basic.showString("Top")
radio.setGroup(1)

