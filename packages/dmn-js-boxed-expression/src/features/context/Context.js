export class Context {
  getEntries(context) {
    return context.get('contextEntry');
  }

  getKey(entry) {
    return entry.get('variable') || null;
  }

  getExpression(entry) {
    return entry.get('value');
  }
}
