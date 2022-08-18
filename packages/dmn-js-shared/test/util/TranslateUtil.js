const customTranslate = (template, replacements) => {
  replacements = replacements || {};

  // Translate
  template = `tr(${template})`;

  // Replace
  return template.replace(/{([^}]+)}/g, function(_, key) {
    return replacements[key] && `tr(${replacements[key]})` || '{' + key + '}';
  });
};

export const translateModule = {
  translate: [ 'value', customTranslate ],
};