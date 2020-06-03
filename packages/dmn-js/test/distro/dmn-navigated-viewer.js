describe('dmn-navigated-viewer', function() {

  it('should expose globals', function() {

    var DmnJS = window.DmnJS;

    // then
    expect(DmnJS).to.exist;
    expect(new DmnJS()).to.exist;
  });


  it('should import initial diagram', function(done) {

    var DmnJS = window.DmnJS;

    // then
    /* global testImport */
    testImport(DmnJS, done);
  });

});