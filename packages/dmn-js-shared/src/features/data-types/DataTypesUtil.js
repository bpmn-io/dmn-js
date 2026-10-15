/**
 * @typedef {import('./DataTypes').DataType} DataType
 *
 * @typedef {Object} DataTypesGroup
 * @property {string} id
 * @property {string} [name] header to display, if any
 * @property {DataType[]} types
 */

const DEFAULT_GROUP_ID = 'default';

/**
 * Group data types by their group. Data types without a group come first,
 * all other groups follow in order of their first appearance.
 *
 * Group names are only kept if there is more than one group, i.e. there is
 * no need to tell groups apart.
 *
 * @param {DataType[]} dataTypes
 *
 * @return {DataTypesGroup[]}
 */
export function groupDataTypes(dataTypes) {
  const defaultGroup = { id: DEFAULT_GROUP_ID, types: [] };

  const groups = [ defaultGroup ];

  dataTypes.forEach(dataType => {
    if (!dataType.group) {
      return defaultGroup.types.push(dataType);
    }

    const { id, name } = dataType.group;

    let group = groups.find(g => g.id === id);

    if (!group) {
      group = { id, name, types: [] };

      groups.push(group);
    }

    group.types.push(dataType);
  });

  const nonEmptyGroups = groups.filter(group => group.types.length);

  if (nonEmptyGroups.length < 2) {
    return nonEmptyGroups.map(group => ({ ...group, name: undefined }));
  }

  return nonEmptyGroups;
}

/**
 * Get options for a select, ordered by group.
 *
 * @param {DataType[]} dataTypes
 *
 * @return {{ label: string, value: string, group?: string }[]}
 */
export function getTypeRefOptions(dataTypes) {
  return groupDataTypes(dataTypes).flatMap(({ name, types }) => {
    return types.map(type => ({
      label: type.label,
      value: type.name,
      group: name
    }));
  });
}
