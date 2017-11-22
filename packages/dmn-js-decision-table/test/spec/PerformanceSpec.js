import {
  bootstrapEditor,
  inject,
  importXML
} from 'test/TestHelper';

// eslint-disable-next-line
import Inferno from 'inferno';

import DecisionTable from '../../lib/DecisionTable';
import DecisionTableEditor from '../../lib/DecisionTableEditor';

// import TestDecision from './simple.dmn';
import TestDecision from './performance.dmn';

import ModelingModule from '../../lib/features/modeling';

describe('Performance', function() {

  let container;

  beforeEach(function() {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  describe('DecisionTable', function() {

    function createDecisionTable(xml, done) {
      const decisionTable = new DecisionTable({ container });
  
      decisionTable.importXML(xml, (err, warnings) => {
        done(err, warnings);
      });
    }
  
  
    it('import in less than 1500ms', function(done) {
      const now = performance.now();
  
      createDecisionTable(TestDecision, function() {
        const duration = performance.now() - now;
  
        expect(duration).to.be.below(1500);
  
        console.log(`imported in ${duration}ms`);
  
        done();
      });
    });

  });


  describe('DecisionTableEditor', function() {

    function createDecisionTableEditor(xml, done) {
      const decisionTableEditor = new DecisionTableEditor({ container });
  
      decisionTableEditor.importXML(xml, (err, warnings) => {
        done(err, warnings);
      });
    }
  
  
    it('import in less than 2500ms', function(done) {
      const now = performance.now();
  
      createDecisionTableEditor(TestDecision, function() {
        const duration = performance.now() - now;
  
        expect(duration).to.be.below(2500);
  
        console.log(`imported in ${duration}ms`);
  
        done();
      });
    });


    describe('modeling', function() {

      beforeEach(bootstrapEditor({
        modules: [ ModelingModule ]
      }));
  
      beforeEach(importXML(TestDecision));
  
  
      it.skip('moving rows/cols', inject(function(eventBus, modeling, renderer, sheet) {
        const rows = sheet.getRoot().rows,
              cols = sheet.getRoot().cols;
  
        let now;
  
        setInterval(() => {
          now = performance.now();
  
          if (Math.random() < 0.5) {
            let row = rows[Math.floor(Math.random() * rows.length)];
  
            modeling.moveRow(row, 0);
  
            console.log(`Modeling#moveRow took ${Math.round(performance.now() - now)}ms`);
          } else {
            let col = cols[Math.floor(Math.random() * cols.length)];
  
            modeling.moveCol(col, 0);
  
            console.log(`Modeling#moveCol took ${Math.round(performance.now() - now)}ms`);
          }
        }, 1000);
      }));
  
  
      it.skip('editing cells', inject(function(eventBus, modeling, renderer, sheet) {
        const rows = sheet.getRoot().rows,
              cols = sheet.getRoot().cols;
  
        let now;
  
        setInterval(() => {
          now = performance.now();
  
          const cell = rows[Math.floor(Math.random() * rows.length)].cells[Math.floor(Math.random() * cols.length)];
  
          cell.businessObject.text = 'FOO';
  
          modeling.editCell(cell);
  
          console.log(`Modeling#editCell took ${Math.round(performance.now() - now)}ms`);
        }, 1000);
      }));
      
  
      it.skip('should add/move/remove/edit', inject(function(eventBus, modeling, renderer, sheet) {
        const root = sheet.getRoot();
        
        const rows = root.rows,
              cols = root.cols;
        
        const businessObject = root.businessObject,
              inputs = businessObject.input,
              outputs = businessObject.output;
        
        let now;
        
        setInterval(() => {
          now = performance.now();
  
          let random = Math.random();
  
          if (random < 0.333) {
            let row = rows[Math.floor(Math.random() * rows.length)];
            let idx = Math.floor(Math.random() * rows.length);
  
            modeling.moveRow(row, idx);
  
            console.log(`Modeling#moveRow took ${Math.round(performance.now() - now)}ms`);
          } else if (random < 0.666) {
            let col, idx;

            if (Math.random() < 0.5) {
              col = cols[Math.floor(Math.random() * inputs.length)];
              idx = Math.floor(Math.random() * inputs.length);
            } else {
              col = cols[Math.floor(Math.random() * outputs.length) + inputs.length];
              idx = Math.floor(Math.random() * outputs.length) + inputs.length;
            }
  
            modeling.moveCol(col, idx);
  
            console.log(`Modeling#moveCol took ${Math.round(performance.now() - now)}ms`);
          } else {
            let cell = rows[Math.floor(Math.random() * rows.length)].cells[Math.floor(Math.random() * cols.length)];
            
            cell.businessObject.text = 'foo';
    
            modeling.editCell(cell);
    
            console.log(`Modeling#editCell took ${Math.round(performance.now() - now)}ms`);
          }
        }, 1000);
      }));

    });

  });

});