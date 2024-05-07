
async function testImport(DmnJS) {
  const diagram = await get('/base/test/distro/diagram.dmn');
  const container = createContainer();
  const modeler = createModeler(DmnJS, container);

  await importDiagram(modeler, diagram);

  return modeler;
}

async function testAllViews(DmnJS) {
  const modeler = await testImport(DmnJS);

  const views = modeler.getViews();

  for (const view of views) {
    await modeler.open(view);
  }
}

async function get(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('status = ' + response.status);
  }

  const text = await response.text();

  return text;
}

function createContainer() {
  const container = document.createElement('div');
  container.style.height = '500px';
  container.style.border = 'solid 1px #666';

  document.body.appendChild(container);

  return container;
}

function createModeler(DmnJS, container) {
  return new DmnJS({
    container: container
  });
}

function importDiagram(modeler, diagram) {
  return modeler.importXML(diagram);
}

window.testImport = testImport;
window.testAllViews = testAllViews;
