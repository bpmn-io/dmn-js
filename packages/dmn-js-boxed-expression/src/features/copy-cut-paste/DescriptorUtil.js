import {
  isArray,
  forEach,
  keys,
  reduce
} from 'min-dash';

// creating descriptors //////////

const createHooks = [
  copyTableProperties,
  copyBusinessObjectProperties
];

const reviveHooks = [
  reviveBusinessObject,
  reviveTableElement
];

/**
 * Return a serializable snapshot of the given elements.
 *
 * @param {Array<Base>} elements list of table elements
 *
 * @return {Tree} descriptor tree
 */
export function createDescriptor(element, cache, hooks) {

  hooks = hooks || createHooks;
  cache = cache || {};

  if (isArray(element)) {
    return createDescriptors0(element, cache, hooks);
  } else {
    return createDescriptor0(element, cache, hooks);
  }

}


/**
 * Create descriptors of elements, returning { descriptors: [], descriptorCache }.
 *
 * @param {Array<Base>} elements list of table elements
 * @param {Object} cache the create cache
 *
 * @return {Object} new descriptors + updated cache
 */
function createDescriptors0(elements, cache, hooks) {

  return reduce(elements, (result, element) => {

    var currentCache = result.descriptorCache,
        currentDescriptors = result.root;

    let {
      root,
      descriptorCache
    } = createDescriptor0(element, currentCache, hooks);

    return {
      root: [
        ...currentDescriptors,
        root
      ],
      descriptorCache: {
        ...currentCache,
        ...descriptorCache
      }
    };
  }, {
    root: [],
    descriptorCache: cache
  });
}

function createDescriptor0(element, cache, hooks) {

  var id = element.id;

  var descriptor = {
    id: id
  };

  var elements = cache.elements || {};

  var existingDescriptor = elements[id];

  // element already created; nothing to do
  if (existingDescriptor) {
    return {
      root: existingDescriptor,
      descriptorCache: cache
    };
  }

  // we're new; need to initialize element via hooks
  // we assume we're not handling recursive data structures
  // here. Otherwise we'd need to pre-populate the cache
  // with the given element
  let element0 = evaluateHooks(element, descriptor, hooks, {
    ...cache,
    elements
  });

  return {
    root: element0.root,
    descriptorCache: {
      ...element0.descriptorCache,
      elements: {
        ...element0.descriptorCache.elements,
        [id]: element0.root
      }
    }
  };
}


function evaluateHooks(element, descriptor, hooks, cache) {

  function create(element, descriptorCache) {
    return createDescriptor(element, descriptorCache, hooks);
  }

  return reduce(hooks, function(result, hook) {
    return hook(
      element,
      result.root,
      result.descriptorCache,
      create
    );
  }, {
    root: descriptor,
    descriptorCache: cache
  });
}


import {
  Row,
  Col,
  Cell
} from 'table-js/lib/model';


function copyTableProperties(element, descriptor, cache, create) {

  var descriptorCache = cache;

  var newDesc = {
    ...descriptor,
    type: getType(element)
  };

  if (
    element instanceof Row ||
    element instanceof Col
  ) {
    let cells0 = create(element.cells, descriptorCache);

    newDesc.cells = cells0.root;
    descriptorCache = cells0.descriptorCache;
  }

  return {
    root: newDesc,
    descriptorCache
  };
}


function copyBusinessObjectProperties(element, descriptor, cache) {

  var businessObject = element.businessObject;

  if (!businessObject) {
    return {
      root: descriptor,
      descriptorCache: cache
    };
  }

  // need to clone businessObject
  var bo0 = createBoDescriptor(businessObject, cache);

  return {
    root: {
      ...descriptor,
      businessObject: bo0.root
    },
    descriptorCache: bo0.descriptorCache
  };
}


function getType(element) {

  if (element instanceof Row) {
    return 'row';
  }

  if (element instanceof Col) {
    return 'col';
  }

  if (element instanceof Cell) {
    return 'cell';
  }

  throw new Error('cannot deduce element type: #' + element.id);
}


function createBoDescriptor(bo, cache) {
  var boCache,
      existingBoDesc;

  var id = bo.id;

  if (id) {
    boCache = cache.boCache || {};

    existingBoDesc = boCache[id];

    // businessObject already created; nothing to do
    if (existingBoDesc) {
      return {
        root: existingBoDesc,
        descriptorCache: cache
      };
    }
  }

  var descriptor = {
    $type: bo.$type
  };

  if (id) {
    descriptor.id = id;

    boCache = {
      ...boCache,
      [id]: descriptor
    };

    cache = {
      ...cache,
      boCache
    };
  }

  // TODO(nikku): distinguish relations and containment
  // Need to build up the whole tree and revive relations afterwards

  // ITERATE OVER ALL SET PROPERTIES
  // (Object.keys(bo) or via bo.$descriptor....)

  bo.$descriptor.properties.forEach(function(property) {
    var value = bo[property.name];

    // const propertyDescriptor = bo.$model.getPropertyDescriptor(bo, property.name),
    //       isId = propertyDescriptor.isId,
    //       isReference = propertyDescriptor.isReference;

    // not set
    if (!value) {
      return;
    }

    // arrays of moddle elements
    if (isArray(value)) {
      value = value.map(b => {
        var value0 = createBoDescriptor(b, cache);

        cache = value0.descriptorCache;

        return value0.root;
      });
    }

    // moddle elements
    if (value.$type) {
      let value0 = createBoDescriptor(value, cache);

      cache = value0.descriptorCache;
      value = value0.root;
    }

    // other values
    descriptor[property.name] = value;
  });

  return {
    root: descriptor,
    descriptorCache: cache
  };
}



// reviving //////////

export function reviveDescriptor(entry, reviveCache, hooks) {

  hooks = hooks || reviveHooks;
  reviveCache = reviveCache || {};

  if (isArray(entry.root)) {
    return reviveDescriptors0(entry, reviveCache, hooks);
  } else {
    return reviveDescriptor0(entry, reviveCache, hooks);
  }
}


/**
 * TBD: document this!
 *
 * @param  {[type]} entry       [description]
 * @param  {[type]} reviveCache [description]
 * @param  {[type]} hooks       [description]
 * @return {[type]}             [description]
 */
function reviveDescriptors0(entry, reviveCache, hooks) {

  let descriptors = entry.root;
  let descriptorCache = entry.descriptorCache;

  return reduce(descriptors, (result, element) => {

    var currentCache = result.reviveCache,
        currentDescriptors = result.root;

    let {
      root,
      reviveCache
    } = reviveDescriptor0({ root: element, descriptorCache }, currentCache, hooks);

    return {
      root: [
        ...currentDescriptors,
        root
      ],
      reviveCache
    };
  }, {
    root: [],
    reviveCache
  });
}

/**
 * TBD: document this!
 *
 * @param  {[type]} entry [description]
 * @param  {[type]} cache [description]
 * @param  {[type]} hooks [description]
 * @return {[type]}       [description]
 */
function reviveDescriptor0(entry, reviveCache, hooks) {

  var descriptor = entry.root;

  var id = descriptor.id;

  var elements = reviveCache.elements || {};

  var existingElement = elements[id];

  // element already created; nothing to do
  if (existingElement) {
    return {
      root: existingElement,
      reviveCache: reviveCache
    };
  }

  // start with a fake element; haha <3
  var element = {
    id: id
  };

  // we're new; need to initialize element via hooks
  let element0 = evaluateReviveHooks(entry, element, hooks, {
    ...reviveCache,
    elements
  });

  return {
    root: element0.root,
    reviveCache: {
      ...element0.reviveCache,
      elements: {
        ...element0.reviveCache.elements,
        [id]: element0.root
      }
    }
  };
}

// entry = { root, descriptorCache }
// element = { id: foo }
// hooks = [ ... ]
// reviveCache = { ... }
function evaluateReviveHooks(entry, element, hooks, reviveCache) {

  function revive(entry, reviveCache) {
    return reviveDescriptor(entry, reviveCache, hooks);
  }

  return reduce(hooks, function(result, hook) {
    return hook(
      entry,
      result.root,
      result.reviveCache,
      revive
    );
  }, {
    root: element,
    reviveCache: reviveCache
  });
}


function reviveTableElement(entry, element, reviveCache, revive) {
  var descriptor = entry.root;
  var createCache = entry.descriptorCache;

  var elementAttrs = {
    ...element
  };

  // make sure table element ID is same as moddle element ID
  if (element.businessObject && element.businessObject.id) {
    elementAttrs.id = element.businessObject.id;
  }

  if (
    descriptor.type === 'row' ||
    descriptor.type === 'col'
  ) {
    let cells0 = revive({
      root: descriptor.cells,
      descriptorCache: createCache
    }, reviveCache);

    elementAttrs.cells = cells0.root;
    reviveCache = cells0.reviveCache;
  }

  var Constructor = getConstructor(descriptor);

  var newElement = new Constructor(elementAttrs);

  // set parent row or col
  if (newElement instanceof Row) {
    newElement.cells.forEach(cell => {
      cell.row = newElement;
    });
  } else if (newElement instanceof Col) {
    newElement.cells.forEach(cell => {
      cell.col = newElement;
    });
  }

  return {
    root: newElement,
    reviveCache
  };
}


function reviveBusinessObject(entry, element, reviveCache) {
  var businessObject = entry.root.businessObject;

  if (!businessObject) {
    return {
      root: element,
      reviveCache
    };
  }

  // need to clone businessObject
  var bo0 = createBo({
    root: businessObject,
    descriptorCache: entry.descriptorCache
  }, reviveCache);

  return {
    root: {
      ...element,
      businessObject: bo0.root
    },
    reviveCache: bo0.reviveCache
  };
}


function getConstructor(descriptor) {

  switch (descriptor.type) {
  case 'row':
    return Row;
  case 'cell':
    return Cell;
  case 'col':
    return Col;
  default:
    throw new Error('unknown element type: #' + descriptor.type);
  }
}


function createBo(entry, reviveCache) {
  var boDescriptor = entry.root;

  var id = boDescriptor.id;

  let boCache,
      existingBo;

  if (id) {
    boCache = reviveCache.boCache || {};

    existingBo = boCache[id];

    // businessObject already created; nothing to do
    if (existingBo) {
      return {
        root: existingBo,
        reviveCache
      };
    }
  }

  var newBoAttrs = {};

  // set attrs for new business object (might include creating other business objects)
  keys(boDescriptor).forEach(key => {
    let val,
        val0;

    if (boDescriptor[key].$type) {
      val0 = createBo({
        root: boDescriptor[key]
      }, reviveCache);

      val = val0.root;

      reviveCache = val0.reviveCache;
      boCache = reviveCache.boCache || {};
    } else if (isArray(boDescriptor[key])) {
      val = boDescriptor[key].map(b => {
        val0 = createBo({
          root: b
        }, reviveCache);

        reviveCache = val0.reviveCache;
        boCache = reviveCache.boCache || {};

        return val0.root;
      });
    } else {
      val = boDescriptor[key];
    }

    newBoAttrs[key] = val;
  });

  const type = newBoAttrs.$type;

  delete newBoAttrs.$type;

  // generate new ID if not supposed to be kept or already assigned
  if (!reviveCache._keepIds
    || reviveCache._model.ids.assigned(newBoAttrs.id)) {

    delete newBoAttrs.id;
  }

  var newBo = reviveCache._dmnFactory.create(type, newBoAttrs);

  // set up $parent relationships for moddle elements
  forEach(newBoAttrs, newBoAttr => {
    if (newBoAttr.$type) {
      newBoAttr.$parent = newBo;
    }

    if (isArray(newBoAttr)) {
      newBoAttr.forEach(a => a.$parent = newBo);
    }
  });

  if (id) {
    boCache = {
      ...boCache,
      [id]: newBo
    };

    reviveCache = {
      ...reviveCache,
      boCache
    };
  }

  return {
    root: newBo,
    reviveCache
  };

}