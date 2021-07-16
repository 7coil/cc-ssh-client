const logger = {
  log: (...data: any) => print(...data),
  error: (...data: any) => {
    const existingColour = term.getTextColour()
    const existingBackground = term.getBackgroundColour()
    term.setTextColour(colours.red);
    term.setBackgroundColour(colours.black);
    print(...data)
    term.setTextColour(existingColour);
    term.setBackgroundColour(existingBackground);
  }
}

export { logger }
