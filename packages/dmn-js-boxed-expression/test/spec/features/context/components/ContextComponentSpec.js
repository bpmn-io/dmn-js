describe('ContextComponent', function() {

  it('should display a context', function() {

    // given
    const context = `
    <context>
      <contextEntry>
        <variable name="basic" />
        <literalExpression>
          <text>context</text>
        </literalExpression>
      </contextEntry>
    </context>
    `;

    // when
    renderContext(context);
  });


  it('should display a context with result entry', function() {

    // given
    const context = `
    <context>
      <contextEntry>
        <literalExpression>
          <text>Result entry</text>
        </literalExpression>
      </contextEntry>
    </context>
    `;

    // when
    renderContext(context);
  });


  it('should display a nested context', function() {

    // given
    const context = `
      <context>
        <contextEntry>
          <variable name="nested" />
          <context>
            <contextEntry>
              <literalExpression>
                <text>context</text>
              </literalExpression>
            </contextEntry>
          </context>
        </contextEntry>
      </context>
      `;

    // when
    renderContext(context);
  });
});


function renderContext() {}
