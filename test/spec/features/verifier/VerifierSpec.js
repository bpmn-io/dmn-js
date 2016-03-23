'use strict';

var TestHelper = require('../../../TestHelper');

var domClasses = require('min-dom/lib/classes');

/* global bootstrapModeler, inject */


describe('features/verifier', function() {

    beforeEach(bootstrapModeler({additionalModules: [ require('../../../../lib/features/verifier') ]}));

    beforeEach(inject(function(modeling) {
        modeling.createRow({id: 'rule1'});
        modeling.createRow({id: 'rule2'});
        modeling.editCell('rule1', 'input1', '"gold"');
        modeling.editCell('rule2', 'input1', '"silver"');
    }));
  
    it('should get right input IDs', inject(function(verifier) {
        
        var inputIDs = verifier.getInputIds();

        expect(inputIDs[0] === 'input1').to.be.true;
    }));
    
    it('should get right input types', inject(function(verifier, elementRegistry) {

        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        
        var inputIDs = verifier.getInputIds();
        var inputTypes = verifier.getInputTypes(inputIDs);
        
        expect(inputTypes[0] === 'integer').to.be.true;
    }));
    
    it('should make tooltip text for type "string"', inject(function(verifier) {
        
        var tooltipText = verifier.makeTooltipText('string', '12');
        
        expect(tooltipText === 'Cell value has to be string').to.be.true;
    }));
    
    it('should make tooltip text for type "integer"', inject(function(verifier) {
        
        var tooltipText = verifier.makeTooltipText('integer', '"gold"');
        
        expect(tooltipText === 'Cell value is a string, but has to be a number').to.be.true;
    }));
    
    it('should return false if given parameter is not integer', inject(function(verifier) {
        expect(verifier.isNumeric('"silver"')).to.be.false;
    }));
    
    it('should return true if given parameter is integer', inject(function(verifier) {
        expect(verifier.isNumeric('100')).to.be.true;
    }));
    
    it('should add new "div" element with tooltip', inject(function(verifier, sheet, elementRegistry) {
        
        var wrongCell = elementRegistry._elements['cell_input1_rule1'].gfx;
        domClasses(wrongCell).add('wrongValue');
        verifier.tooltip(wrongCell, 'Cell value is a string, but has to be a number');
        wrongCell.onmouseover();
        var childNodes = sheet.getContainer().childNodes;
        var containsTooltip = false;
        for(var i = 0; i< childNodes.length; i++){
            if(childNodes[i].getAttribute('class') === 'tooltip'){
                containsTooltip = true;
                break;
            }
        }
        
        expect(containsTooltip).to.be.true;
    }));
    
    it('should destroy tooltip div when mouse moves out at error cell', inject(function(verifier, sheet, elementRegistry) {
        
        var wrongCell = elementRegistry._elements['cell_input1_rule1'].gfx;
        domClasses(wrongCell).add('wrongValue');
        verifier.tooltip(wrongCell, 'Cell value is a string, but has to be a number');
        wrongCell.onmouseover();
        wrongCell.onmouseout();
        var childNodes = sheet.getContainer().childNodes;
        var containsTooltip = false;
        for(var i = 0; i< childNodes.length; i++){
            if(childNodes[i].getAttribute('class') === 'tooltip'){
                containsTooltip = true;
                break;
            }
        }
        
        expect(containsTooltip).to.be.false;
    }));
    
    it('should add tooltip text to error cell, when cell has syntax error', inject(function(verifier, sheet, elementRegistry) {
        
        verifier.addTooltip('cell_input1_rule1', 'string', '100');
        var wrongCell = elementRegistry._elements['cell_input1_rule1'].gfx;
        wrongCell.onmouseover();
        var childNodes = sheet.getContainer().childNodes;
        var containsTooltip = false;
        for(var i = 0; i< childNodes.length; i++){
            if(childNodes[i].getAttribute('class') === 'tooltip'){
                containsTooltip = true;
                break;
            }
        }
        
        expect(containsTooltip).to.be.true;
    }));
    
    it('should have no "wrongValue" class, when cell has no syntax error', inject(function(verifier, elementRegistry) {
        
        verifier.checkSyntaxErrors('cell_input1_rule1', '"gold"', 'string');
        var wrongCell = elementRegistry._elements['cell_input1_rule1'].gfx;
        
        expect(domClasses(wrongCell).contains('wrongValue')).to.be.false;
    }));
    
    it('should return false if parameter is not string', inject(function(verifier) {
        expect(verifier.isString('100')).to.be.false;
    }));
    
    it('should return true if parameter is string', inject(function(verifier) {
        expect(verifier.isString('"gold"')).to.be.true;
    }));
    
    it('should return false if parameter is not integer', inject(function(verifier) {
        expect(verifier.isInteger('100.12')).to.be.false;
    }));
    
    it('should return true if parameter is integer', inject(function(verifier) {
        expect(verifier.isInteger('100')).to.be.true;
    }));
    
    it('should return false if parameter is not boolean', inject(function(verifier) {
        expect(verifier.isBoolean('2')).to.be.false;
    }));
    
    it('should return true if parameter is boolean', inject(function(verifier) {
        expect(verifier.isBoolean('0')).to.be.true;
    }));
    
    it('should construct new cell object from given parameters (string)', inject(function(verifier) {
        var cellObject = new verifier.CellAttributes('cell_input1_rule1', 'string', 
        [], '"gold", "silver"', 'input1', 'rule1', 1);
        
        expect(cellObject.type === 'string').to.be.true;
        expect(cellObject.allowedValues.length === 0).to.be.true;
        expect(cellObject.value === '"gold", "silver"').to.be.true;
        expect(cellObject.clauseId === 'input1').to.be.true;
        expect(cellObject.ruleId === 'rule1').to.be.true;
        expect(cellObject.id === 'cell_input1_rule1').to.be.true;
        expect(cellObject.ruleNR === 1).to.be.true;
        expect(JSON.stringify(cellObject.multipleStringValues) === JSON.stringify(['"gold"', '"silver"'])).to.be.true;
    }));
    
    it('should construct new cell object from given parameters (numeric)', inject(function(verifier) {
        var cellObject = new verifier.CellAttributes('cell_input1_rule1', 'double', 
        [], '(100, 200]', 'input1', 'rule1', 2);
        
        expect(cellObject.type === 'double').to.be.true;
        expect(cellObject.allowedValues.length === 0).to.be.true;
        expect(cellObject.value === '(100, 200]').to.be.true;
        expect(cellObject.clauseId === 'input1').to.be.true;
        expect(cellObject.ruleId === 'rule1').to.be.true;
        expect(cellObject.id === 'cell_input1_rule1').to.be.true;
        expect(cellObject.ruleNR === 2).to.be.true;
        expect(JSON.stringify(cellObject.intervalValues)  === JSON.stringify([100, 200])).to.be.true;
        expect(cellObject.equalSigns[0]).to.be.false;
        expect(cellObject.equalSigns[1]).to.be.true;
    }));
    
    it('should construct array with cell objects (string)', inject(function(verifier) {
        var inputIDs = verifier.getInputIds();
        var cellValues = verifier.makeCellsWithNewAttributes(inputIDs);
        
        var firstCellObject = cellValues[0]['cell_input1_rule2'];
        var secondCellObject = cellValues[0]['cell_input1_rule1'];
        
        expect(firstCellObject.type === 'string').to.be.true;
        expect(firstCellObject.allowedValues.length === 0).to.be.true;
        expect(firstCellObject.value === '"silver"').to.be.true;
        expect(firstCellObject.clauseId === 'input1').to.be.true;
        expect(firstCellObject.ruleId === 'rule2').to.be.true;
        expect(firstCellObject.id === 'cell_input1_rule2').to.be.true;
        expect(firstCellObject.ruleNR === 2).to.be.true;
        expect(JSON.stringify(firstCellObject.multipleStringValues) === JSON.stringify(['"silver"'])).to.be.true;
        
        expect(secondCellObject.type === 'string').to.be.true;
        expect(secondCellObject.allowedValues.length === 0).to.be.true;
        expect(secondCellObject.value === '"gold"').to.be.true;
        expect(secondCellObject.clauseId === 'input1').to.be.true;
        expect(secondCellObject.ruleId === 'rule1').to.be.true;
        expect(secondCellObject.id === 'cell_input1_rule1').to.be.true;
        expect(secondCellObject.ruleNR === 1).to.be.true;
        expect(JSON.stringify(secondCellObject.multipleStringValues) === JSON.stringify(['"gold"'])).to.be.true;
        
    }));
    
    it('should construct array with cell objects (numeric)', inject(function(verifier, modeling, elementRegistry) {
        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        modeling.editCell('rule1', 'input1', '> 100');
        modeling.editCell('rule2', 'input1', '<= 100');
        
        var inputIDs = verifier.getInputIds();
        var cellValues = verifier.makeCellsWithNewAttributes(inputIDs);
        
        var firstCellObject = cellValues[0]['cell_input1_rule2'];
        var secondCellObject = cellValues[0]['cell_input1_rule1'];
        
        expect(firstCellObject.type === 'integer').to.be.true;
        expect(firstCellObject.allowedValues[0] === 'any').to.be.true;
        expect(firstCellObject.value === '<= 100').to.be.true;
        expect(firstCellObject.clauseId === 'input1').to.be.true;
        expect(firstCellObject.ruleId === 'rule2').to.be.true;
        expect(firstCellObject.id === 'cell_input1_rule2').to.be.true;
        expect(firstCellObject.ruleNR === 2).to.be.true;
        expect(JSON.stringify(firstCellObject.intervalValues)  === JSON.stringify([-Infinity, 100])).to.be.true;
        expect(firstCellObject.equalSigns[0]).to.be.false;
        expect(firstCellObject.equalSigns[1]).to.be.true;
        
        expect(secondCellObject.type === 'integer').to.be.true;
        expect(secondCellObject.allowedValues[0] === 'any').to.be.true;
        expect(secondCellObject.value === '> 100').to.be.true;
        expect(secondCellObject.clauseId === 'input1').to.be.true;
        expect(secondCellObject.ruleId === 'rule1').to.be.true;
        expect(secondCellObject.id === 'cell_input1_rule1').to.be.true;
        expect(secondCellObject.ruleNR === 1).to.be.true;
        expect(JSON.stringify(secondCellObject.intervalValues)  === JSON.stringify([100, Infinity])).to.be.true;
        expect(secondCellObject.equalSigns[0]).to.be.false;
        expect(secondCellObject.equalSigns[1]).to.be.false;
        
    }));
    
    it('should construct object, where keys are rule IDs and contect is rule attributes', inject(function(verifier) {
        
        var ruleOrder = verifier.getInputIds();
        var cellValues = verifier.makeCellsWithNewAttributes(ruleOrder);
        var inputAndRules = verifier.getRulesAndInputs(cellValues[0], ruleOrder);
        var rules = inputAndRules[1];
        var ruleIDs = Object.keys(rules);
        expect(ruleIDs.length === 2).to.be.true;
        expect(ruleIDs.indexOf('rule1') > -1).to.be.true;
        expect(ruleIDs.indexOf('rule2') > -1).to.be.true;
        expect(rules['rule1'].ruleNR === 1).to.be.true;
        expect(rules['rule2'].ruleNR === 2).to.be.true;
        expect(JSON.stringify(rules['rule2'][0].allowedValues) === JSON.stringify(['"gold"', '"silver"']));
    }));
    
    it('should construct right object for sort (string)', inject(function(verifier) {
      
        var ruleOrder = verifier.getInputIds();
        var cellValues = verifier.makeCellsWithNewAttributes(ruleOrder);
        var inputAndRules = verifier.getRulesAndInputs(cellValues[0], ruleOrder);
        var rules = inputAndRules[1];
      
        var compactRule1 = new verifier.CellAttributesForSort(rules['rule1'][0], false, true, '"gold"');
        var compactRule2 = new verifier.CellAttributesForSort(rules['rule2'][0], true, true, '"silver"');
        
        expect(compactRule1.value === '"gold"').to.be.true;
        expect(compactRule1.start).to.be.true;
        expect(compactRule2.value === '"silver"').to.be.true;
        expect(compactRule2.start).to.be.false;
    }));
    
    it('should construct right object for sort (numeric)', inject(function(verifier, modeling, elementRegistry) {
        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        modeling.editCell('rule1', 'input1', '>= 100');
        modeling.editCell('rule2', 'input1', '< 100');
        
        var ruleOrder = verifier.getInputIds();
        var cellValues = verifier.makeCellsWithNewAttributes(ruleOrder);
        var inputAndRules = verifier.getRulesAndInputs(cellValues[0], ruleOrder);
        var rules = inputAndRules[1];
      
        var compactRule1 = new verifier.CellAttributesForSort(rules['rule1'][0], false, false);
        var compactRule2 = new verifier.CellAttributesForSort(rules['rule1'][0], true, false);
        
        expect(compactRule1.value === 100).to.be.true;
        expect(compactRule1.start).to.be.true;
        expect(compactRule1.equal).to.be.true;
        expect(compactRule2.value === Infinity).to.be.true;
        expect(compactRule2.start).to.be.false;
        expect(compactRule2.equal).to.be.false;
    }));
    
    it('should sort rules into alphabetical order if input type is string', inject(function(verifier) {
        
        var ruleOrder = verifier.getInputIds();
        var cellValues = verifier.makeCellsWithNewAttributes(ruleOrder);
        var inputAndRules = verifier.getRulesAndInputs(cellValues[0], ruleOrder);
        var rules = inputAndRules[1];
        var sortedRuleOrder = verifier.sortRules(rules, 0);
        
        expect(sortedRuleOrder[0]['rule1'].value === '"gold"').to.be.true;
        expect(sortedRuleOrder[0]['rule1'].start).to.be.true;
        expect(sortedRuleOrder[1]['rule1'].value === '"gold"').to.be.true;
        expect(sortedRuleOrder[1]['rule1'].start).to.be.false;
        expect(sortedRuleOrder[2]['rule2'].value === '"silver"').to.be.true;
        expect(sortedRuleOrder[2]['rule2'].start).to.be.true;
        expect(sortedRuleOrder[3]['rule2'].value === '"silver"').to.be.true;
        expect(sortedRuleOrder[3]['rule2'].start).to.be.false;
    }));
    
    it('should sort rules into ascending order if input type is numeric', inject(function(verifier, modeling, elementRegistry) {
        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        modeling.editCell('rule1', 'input1', '>= 100');
        modeling.editCell('rule2', 'input1', '< 1000');
        
        var ruleOrder = verifier.getInputIds();
        var cellValues = verifier.makeCellsWithNewAttributes(ruleOrder);
        var inputAndRules = verifier.getRulesAndInputs(cellValues[0], ruleOrder);
        var rules = inputAndRules[1];
        var sortedRuleOrder = verifier.sortRules(rules, 0);
        
        expect(sortedRuleOrder[0]['rule2'].value === -Infinity).to.be.true;
        expect(sortedRuleOrder[0]['rule2'].start).to.be.true;
        expect(sortedRuleOrder[0]['rule2'].equal).to.be.false;
        expect(sortedRuleOrder[1]['rule1'].value === 100).to.be.true;
        expect(sortedRuleOrder[1]['rule1'].start).to.be.true;
        expect(sortedRuleOrder[1]['rule1'].equal).to.be.true;
        expect(sortedRuleOrder[2]['rule2'].value === 1000).to.be.true;
        expect(sortedRuleOrder[2]['rule2'].start).to.be.false;
        expect(sortedRuleOrder[2]['rule2'].equal).to.be.false;
        expect(sortedRuleOrder[3]['rule1'].value === Infinity).to.be.true;
        expect(sortedRuleOrder[3]['rule1'].start).to.be.false;
        expect(sortedRuleOrder[3]['rule1'].equal).to.be.false;
    }));
    
    describe('construct overlapping interval', function(verifier) {
        it('if two merging intervals are strings, then should output last interval string value', inject(function(verifier) {
            
            var rule = {
                value: '"gold"',
                start: true,
                equal: false
            };
            
            var range = verifier.constructOverlappingRange('"silver"', false, rule, 'string', false);
            
            expect(range === '"silver"').to.be.true;
        }));
        
        it('if last value was -Infinity and current value is Infinity then merging interval is "any"', inject(function(verifier) {
            
            var rule = {
                value: Infinity,
                start: true,
                equal: false
            };
            
            var range = verifier.constructOverlappingRange(-Infinity, false, rule, 'integer', false);
            
            expect(range === 'any').to.be.true;
        }));
        
        it('if last value was -Infinity and current value is start interval and has equal sign' +
            'then merging interval is less than strict inequality', inject(function(verifier) {
            
            var rule = {
                value: 100,
                start: true,
                equal: true
            };
            
            var range = verifier.constructOverlappingRange(-Infinity, false, rule, 'integer', true);
            
            expect(range === '< 100').to.be.true;
        }));
        
        it('if last value was -Infinity and current value is start interval and has no equal sign' +
            'then merging interval is less than inequality', inject(function(verifier) {
            
            var rule = {
                value: 100,
                start: true,
                equal: false
            };
            
            var range = verifier.constructOverlappingRange(-Infinity, false, rule, 'integer', true);
            
            expect(range === '<= 100').to.be.true;
        }));
        
        it('if last value was start interval and had no equal sign and current value is Infinity' +
            'then merging interval is greater than strict inequality', inject(function(verifier) {
            
            var rule = {
                value: Infinity,
                start: false,
                equal: false
            };
            
            var range = verifier.constructOverlappingRange(100, false, rule, 'integer', true);
            
            expect(range === '> 100').to.be.true;
        }));
        
        it('if last value was start interval and had equal sign and current value is Infinity' +
            'then merging interval is greater than inequality', inject(function(verifier) {
            
            var rule = {
                value: Infinity,
                start: false,
                equal: false
            };
            
            var range = verifier.constructOverlappingRange(100, true, rule, 'integer', true);
            
            expect(range === '>= 100').to.be.true;
        }));
        
        it('if last value was start interval and had equal sign and current value is start interval and ' +
            'has no equal sign then merging interval has brackets "[" and "]"', inject(function(verifier) {
            
            var rule = {
                value: 200,
                start: true,
                equal: false
            };
            
            var range = verifier.constructOverlappingRange(100, true, rule, 'integer', true);
            
            expect(range === '[100, 200]').to.be.true;
        }));
        
        it('if last value was start interval and had no equal sign and current value is start interval and ' +
            'has no equal sign then merging interval has brackets "(" and "]"', inject(function(verifier) {
            
            var rule = {
                value: 200,
                start: true,
                equal: false
            };
            
            var range = verifier.constructOverlappingRange(100, false, rule, 'integer', true);
            
            expect(range === '(100, 200]').to.be.true;
        }));
        
        
        
        it('if last value was start interval and had equal sign and current value is start interval and ' +
            'has equal sign then merging interval has brackets "[" and ")"', inject(function(verifier) {
            
            var rule = {
                value: 200,
                start: true,
                equal: true
            };
            
            var range = verifier.constructOverlappingRange(100, true, rule, 'integer', true);
            
            expect(range === '[100, 200)').to.be.true;
        }));
        
        it('if last value was start interval and had no equal sign and current value is start interval and ' +
            'has equal sign then merging interval has brackets "(" and ")"', inject(function(verifier) {
            
            var rule = {
                value: 200,
                start: true,
                equal: true
            };
            
            var range = verifier.constructOverlappingRange(100, false, rule, 'integer', true);
            
            expect(range === '(100, 200)').to.be.true;
        }));
    });
  
    it('there should be no rows of class "wrongValue"', inject(function(verifier, modeling, elementRegistry) {
      
        var elements = elementRegistry._elements;
        verifier.verifyTable();
    
        expect(domClasses(elements['cell_input1_rule1'].gfx).contains('wrongValue')).to.be.false;
        expect(domClasses(elements['cell_input1_rule2'].gfx).contains('wrongValue')).to.be.false;
    }));

    it('should add class "wrongValue" to cell when cell value is in wrong type (string)', inject(function(verifier, modeling, elementRegistry) {
      
        modeling.editCell('rule1', 'input1', 'gold');
        var elements = elementRegistry._elements
        
        verifier.verifyTable();
        
        expect(domClasses(elements['cell_input1_rule1'].gfx).contains('wrongValue')).to.be.true;
        expect(domClasses(elements['cell_input1_rule2'].gfx).contains('wrongValue')).to.be.false;
    }));
  
    it('should add class "wrongValue" to cell when cell value is in wrong type (integer)', inject(function(verifier, modeling, elementRegistry) {
      
        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        modeling.editCell('rule1', 'input1', '>= 100');
        modeling.editCell('rule2', 'input1', '101.12');
        var elements = elementRegistry._elements
        
        verifier.verifyTable();
        
        expect(domClasses(elements['cell_input1_rule1'].gfx).contains('wrongValue')).to.be.false;
        expect(domClasses(elements['cell_input1_rule2'].gfx).contains('wrongValue')).to.be.true;
    }));
  
    it('should add a overlapping rule into "Missing and overlapping rules" table (string)', inject(function(elementRegistry, graphicsFactory, verifier, sheet, modeling) {
        
        modeling.createRow({id: 'rule3'});
        modeling.editCell('rule3', 'input1', '"silver"');
        
        verifier.verifyTable();
        
        var errorTableFirstRow = sheet.getContainer().childNodes[3].tBodies[0].rows[0];
        var errorValue = errorTableFirstRow.cells[0].getElementsByTagName('span')[0].innerHTML;

        expect(errorValue === 'Rules 2, 3 are overlapping (outputs are same)').to.be.true;

    }));
  
    it('should add a overlapping rule into "Missing and overlapping rules" table (numeric)', inject(function(verifier, sheet, modeling, elementRegistry) {
    
        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        modeling.editCell('rule1', 'input1', '< 100');
        modeling.editCell('rule2', 'input1', '>= 100');
        
        modeling.createRow({id: 'rule3'});
        modeling.editCell('rule3', 'input1', '[10,100)');
        
        verifier.verifyTable();
        
        var errorTableFirstRow = sheet.getContainer().childNodes[3].tBodies[0].rows[0];
        var errorValue = errorTableFirstRow.cells[0].getElementsByTagName('span')[0].innerHTML;
        
        expect(errorValue === 'Rules 1, 3 are overlapping (outputs are same)').to.be.true;

    }));
  
    it('should highlight overlapping rules when clicked "Higlight overlapping rules"', inject(function(verifier, sheet, modeling, elementRegistry) {
        modeling.createRow({id: 'rule3'});
        modeling.editCell('rule3', 'input1', '"silver"');
        
        
        verifier.verifyTable();
        
        var elements = elementRegistry._elements
        
        var errorTableFirstRow = sheet.getContainer().childNodes[3].tBodies[0].rows[0];
        errorTableFirstRow.cells[1].getElementsByTagName('input')[0].click();

        expect(domClasses(elements['rule1'].gfx).contains('overlapping-rules-focused')).to.be.false;
        expect(domClasses(elements['rule2'].gfx).contains('overlapping-rules-focused')).to.be.true;
        expect(domClasses(elements['rule3'].gfx).contains('overlapping-rules-focused')).to.be.true;
        
    }));
  
    it('should add a missing rule into "Missing and overlapping rules" table', inject(function(verifier, sheet, modeling, elementRegistry) {
    
        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        modeling.editCell('rule1', 'input1', '< 100');
        modeling.editCell('rule2', 'input1', '> 100');
        
        
        verifier.verifyTable();
        
        var errorTableFirstRow = sheet.getContainer().childNodes[3].tBodies[0].rows[0];
        var errorValue = errorTableFirstRow.cells[0].getElementsByTagName('span')[0].innerHTML;
        
        expect(errorValue === 'No rule exists for (100)').to.be.true;
    
    }));
  
    it('should add missing rule when clicked "Add missing rule" button', inject(function(verifier, sheet, modeling, elementRegistry) {
        
        elementRegistry.get('input1').businessObject.inputExpression.typeRef = 'integer';
        modeling.editCell('rule1', 'input1', '< 100');
        modeling.editCell('rule2', 'input1', '> 100');
        
        
        verifier.verifyTable();
        
        var errorTableFirstRow = sheet.getContainer().childNodes[3].tBodies[0].rows[0];
        errorTableFirstRow.cells[1].getElementsByTagName('input')[0].click();
        
        var lastRule = sheet._lastRow.body.businessObject.inputEntry[0];
        
        expect(lastRule.text === '100').to.be.true;
        
    }));

});
