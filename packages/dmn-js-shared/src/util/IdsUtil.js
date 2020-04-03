const SPACE_REGEX = /\s/;

// for QName validation as per http://www.w3.org/TR/REC-xml/#NT-NameChar
const QNAME_REGEX = /^([a-z][\w-.]*:)?[a-z_][\w-.]*$/i;

// for ID validation as per BPMN Schema (QName - Namespace)
const ID_REGEX = /^[a-z_][\w-.]*$/i;

const PLACEHOLDER_REGEX = /\$\{([^}]*)\}/g;

/**
 * Validates an ID.
 *
 * @param {ModdleElement} businessObject
 * @param {string} id
 *
 * @return {string} error message
 */
export function validateId(businessObject, id) {
  const assigned = businessObject.$model.ids.assigned(id);

  const idExists = assigned && assigned !== businessObject;

  if (!id || idExists) {
    return 'Element must have an unique id.';
  }

  return validateIdFormat(id);
}


function validateIdFormat(id) {

  id = stripPlaceholders(id);

  if (containsSpace(id)) {
    return 'Id must not contain spaces.';
  }

  if (!ID_REGEX.test(id)) {

    if (QNAME_REGEX.test(id)) {
      return 'Id must not contain prefix.';
    }

    return 'Id must be a valid QName.';
  }
}


function containsSpace(value) {
  return SPACE_REGEX.test(value);
}


function stripPlaceholders(id) {

  // replace expression e.g. ${VERSION_TAG}
  // use only the content between ${}
  // for the REGEX check
  return id.replace(PLACEHOLDER_REGEX, '$1');
}