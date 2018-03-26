import {
  Injector
} from 'didi';


function toModule(locals) {

  var module = {};

  Object.keys(locals).forEach(function(k) {
    module[k] = [ 'value', locals[k] ];
  });

  return module;
}

export function createInjector(locals) {
  return new Injector([ toModule(locals) ]);
}