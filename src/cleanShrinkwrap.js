const sorted = input =>
  Object.keys(input)
    .sort()
    .reduce((memo, key) => Object.assign(memo, {[key]: input[key]}), {});


export const cleanShrinkwrap = (module, name) => {
  const mod = {};
  if (module.name) {
    mod.name = module.name;
  }
  mod.version = module.version;

  // keep `from` and `resolve` properties for git dependencies, delete otherwise
  if (module.resolved && !module.resolved.match(/registry.npmjs.org/)) {
    mod.from = module.from;
    mod.resolved = module.resolved;
  }

  if (name && name.indexOf('@') > -1 && mod.from) {
    mod.from = `${name}@${mod.version}`;
  }

  if (typeof module.dependencies === 'object') {
    mod.dependencies = Object.keys(sorted(module.dependencies)).reduce((memo, key) =>
      Object.assign(memo, {[key]: cleanShrinkwrap(module.dependencies[key], key)}), {});
  }

  return mod;
};
