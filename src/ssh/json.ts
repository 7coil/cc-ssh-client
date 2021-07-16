const json = {
  parse(contents: string) {
    const [parsed] = textutils.unserializeJSON(contents);
    return parsed;
  },
  stringify(contents: any) {
    return textutils.serializeJSON(contents);
  }
}

export { json }
