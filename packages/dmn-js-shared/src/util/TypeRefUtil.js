/**
 * @typedef {import('../features/data-types/DataTypes').DataType} DataType
 *
 * @typedef {Object} DataTypesGroup
 * @property {string} [id] undefined for data types without a group
 * @property {string} [name] header to display, if any, i.e. if there are multiple groups
 * @property {DataType[]} types
 */

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
  const ungrouped = { types: [] };

  const groups = [];

  dataTypes.forEach(dataType => {
    if (!dataType.group) {
      return ungrouped.types.push(dataType);
    }

    const { id, name } = dataType.group;

    let group = groups.find(g => g.id === id);

    if (!group) {
      group = { id, name, types: [] };

      groups.push(group);
    }

    group.types.push(dataType);
  });

  const allGroups = ungrouped.types.length ? [ ungrouped, ...groups ] : groups;

  if (allGroups.length < 2) {
    return allGroups.map(group => ({ ...group, name: undefined }));
  }

  return allGroups;
}

/**
 * Get options for a select, ordered by group.
 *
 * @param {DataType[]} dataTypes
 *
 * @return {{ label: string, value: string, group?: { id: string, name?: string } }[]}
 */
export function getTypeRefOptions(dataTypes) {
  return groupDataTypes(dataTypes).flatMap(({ id, name, types }) => {
    return types.map(type => ({
      label: type.label,
      value: type.name,
      group: id === undefined ? undefined : { id, name }
    }));
  });
}
