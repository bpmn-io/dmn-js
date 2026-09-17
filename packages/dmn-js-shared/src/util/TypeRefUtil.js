/**
 * Build type choices with translated group names for type selectors.
 * Configured types retain their order and take precedence over model types.
 *
 * @param {import('../features/data-types/DataTypes').default} dataTypes
 * @param {ModdleElement} element
 * @param {Function} translate
 *
 * @returns {Array<{ value: string, label: string, group: { id: string, name: string } }>}
 */
export function getTypeRefOptions(dataTypes, element, translate) {
  const configuredTypes = new Set(dataTypes.getAll());

  const primitive = { id: 'primitive', name: translate('Primitive') };
  const custom = { id: 'custom', name: translate('Custom') };

  return dataTypes.getAll(element).map(type => ({
    value: type,
    label: translate(type),
    group: configuredTypes.has(type) ? primitive : custom
  }));
}
