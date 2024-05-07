describe('dmn-viewer', function() {

  it('should expose globals', function() {

    const DmnJS = window.DmnJS;

    // then
    expect(DmnJS).to.exist;
    expect(new DmnJS()).to.exist;
  });


  it('should import initial diagram', async function() {

    const DmnJS = window.DmnJS;

    // then
    /* global testImport */
    await testImport(DmnJS);
  });


  it('should open each view', async function() {

    const DmnJS = window.DmnJS;

    // then
    /* global testAllViews */
    await testAllViews(DmnJS);
  });
});