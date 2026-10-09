import TypeRefCellContextMenu from './components/TypeRefCellContextMenu';

const LOW_PRIORITY = 750;

export default class TypeRef {

  constructor(components) {

    components.onGetComponent('context-menu', LOW_PRIORITY, (context = {}) => {
      const { contextMenuType } = context;

      if (contextMenuType === 'input-edit' || contextMenuType === 'output-edit') {
        return TypeRefCellContextMenu;
      }
    });
  }

}

TypeRef.$inject = [
  'components'
];