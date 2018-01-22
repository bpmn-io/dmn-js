import { query as domQuery } from 'min-dom';

export function queryEditor(baseSelector, container) {
  return domQuery(baseSelector + ' .content-editable', container);
}