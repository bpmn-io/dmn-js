export class BoxedContext {
  getEntries(boxedContext) {
    return boxedContext.get('contextEntry');
  }

  getEntryName(entry) {
    return entry.variable?.get('name');
  }
}