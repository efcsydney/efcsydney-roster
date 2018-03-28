export function getOptions(names) {
  return names
    .map(name => ({ value: name, label: name }))
    .filter(name => name.label !== 'Combined Service');
}
