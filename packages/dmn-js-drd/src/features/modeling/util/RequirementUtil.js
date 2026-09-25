import { is } from 'dmn-js-shared/lib/util/ModelUtil';


/**
 * Get the DMN requirement type (e.g. `Decision`, `Input`) referenced by a
 * `dmn:InformationRequirement`, `dmn:KnowledgeRequirement` or
 * `dmn:AuthorityRequirement` sourced from the given element.
 *
 * @param {djs.model.Base|ModdleElement} source - either a diagram element (e.g. a
 * shape) or its underlying DMN moddle element
 *
 * @returns {string} [requirementType]
 */
export function getRequirementType(source) {
  if (is(source, 'dmn:BusinessKnowledgeModel') || is(source, 'dmn:DecisionService')) {
    return 'Knowledge';
  } else if (is(source, 'dmn:Decision')) {
    return 'Decision';
  } else if (is(source, 'dmn:InputData')) {
    return 'Input';
  } else if (is(source, 'dmn:KnowledgeSource')) {
    return 'Authority';
  }
}
