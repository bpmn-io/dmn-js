'use strict';

var ids = new(require('diagram-js/lib/util/IdGenerator'))('row');

function OptimizeTable(elementRegistry, modeling, sheet) {
    this._elementRegistry = elementRegistry;
    this._modeling = modeling;
    this._sheet = sheet;
}

OptimizeTable.prototype.optimizeDMNTable = function () {
    
    var columnIds = this.getInputIds();
    var inputIDs = columnIds[0];
    var inputColumnTypes = this.getInputTypes(inputIDs);
    this.modifyCells(inputColumnTypes);
    var rules = {};
    var lastRule = this._sheet._lastRow.body;
    var outputEntries = {};
	
    while(lastRule !== null){
        var id = lastRule.id; 
        rules[id] = lastRule.businessObject.inputEntry;
        var outputEntry = lastRule.businessObject.outputEntry;
        var outputInString = '';
        var outputInList = [];
        for(var i = 0; i < outputEntry.length; i++){
            outputInString += outputEntry[i].text;
            outputInList.push(outputEntry[i].text);
        }
        if(typeof outputEntries[outputInString] === 'undefined'){
            outputEntries[outputInString] = {};
            outputEntries[outputInString].rules = {};
            outputEntries[outputInString].outputEntry = outputInList;
        }
        outputEntries[outputInString].rules[id] = rules[id];
        lastRule = lastRule.previous;
    }
    var newRules = [];
    var outputs = [];
    var outputIDs = columnIds[1];
    
    for(var overlapID in outputEntries){
        var rulesWithSameOutput = outputEntries[overlapID].rules;
        outputs.push(outputEntries[overlapID].outputEntry);
        
        if(Object.keys(rulesWithSameOutput).length > 1){
            var inputColumnCount = inputIDs.length;
            var splittedRules = this.splitTheRules(rulesWithSameOutput, inputColumnCount, inputColumnTypes);
            
            var dimensionOrder = this.calculateDimensionOrder(rulesWithSameOutput, inputColumnCount, inputColumnTypes);
            var mergedRules = this.hyperplaneSweep(splittedRules, inputColumnTypes, dimensionOrder);
            newRules.push(mergedRules);

        } else {    
            newRules.push(rulesWithSameOutput);
        }
        
    }
    
    /*
    var totalNumberOfRules = 0;
    for(var s in newRules){
        totalNumberOfRules += Object.keys(newRules[s]).length;
    }
    console.info('Execution time (Total number of rules): %d', totalNumberOfRules);

    */
    this.addNewRulesIntoTable(newRules, inputIDs, outputIDs, outputs);
    
};

OptimizeTable.prototype.hyperplaneSweep = function(comparingRules, inputColumnTypes, dimensionOrder){
        
    var columnCount = inputColumnTypes.length;
	var listOfMergedRules = [];
    for(var index = 0; index < columnCount; index++){
        var columnIndex = dimensionOrder[index].column;
        var ruleType = inputColumnTypes[columnIndex];
        if(ruleType === 'string' || ruleType === 'boolean'){
            comparingRules = this.mergeRulesCategoryValues(columnIndex, columnCount, comparingRules, inputColumnTypes);
        } else{
            var frontList = {};
            var backList = {};
            var meetsList = {};
            var lastIntervalValue = null;
            var lastIntervalEqualSign = false;
            var lastIntervalIsStartInterval = false;
            var sortedRuleOrder = this.sortRules(comparingRules, columnIndex);
            for(var i = 0; i < sortedRuleOrder.length; i++){
                var ruleId = Object.keys(sortedRuleOrder[i])[0];
                var rule = sortedRuleOrder[i][ruleId];
                var ruleValue = rule.value;
                if(Object.keys(frontList).length === 0 || (Object.keys(meetsList).length === 0 && rule.start && 
                lastIntervalValue === ruleValue && lastIntervalEqualSign === rule.equal)){
                    frontList[ruleId] = comparingRules[ruleId];
                } else if(!rule.start && Object.keys(meetsList).length === 0){
                    backList[ruleId] = comparingRules[ruleId];
                } else if(rule.start && ( 
                ((ruleType === 'integer' || ruleType === 'long') && 
				parseInt(lastIntervalValue) + 1 === parseInt(ruleValue)) || 
                (ruleType === 'double' && (lastIntervalValue === ruleValue) && 
                ((lastIntervalEqualSign && !rule.equal) || (!lastIntervalEqualSign && rule.equal))) ||
                (ruleType === 'string' || ruleType === 'boolean'))){
                    meetsList[ruleId] = comparingRules[ruleId];
                } else if(rule.start && Object.keys(meetsList).length !== 0 && lastIntervalValue === ruleValue &&
                lastIntervalEqualSign === rule.equal){
                    meetsList[ruleId] = comparingRules[ruleId];
                } else{
                    listOfMergedRules = this.mergeRules(frontList, backList, meetsList, 
                        columnIndex, columnCount, comparingRules, inputColumnTypes);
        
                    comparingRules = listOfMergedRules[0];
                    frontList = listOfMergedRules[1];
                    backList = {};
                    backList[ruleId] = comparingRules[ruleId];
                    meetsList = {};
                }
                
                lastIntervalIsStartInterval = rule.start;
                lastIntervalValue = ruleValue;
                lastIntervalEqualSign = rule.equal;
            }
            listOfMergedRules = this.mergeRules(frontList, backList, meetsList, 
                        columnIndex, columnCount, comparingRules, inputColumnTypes);
            comparingRules = listOfMergedRules[0];
        }
    }
        
    return comparingRules;
};

OptimizeTable.prototype.calculateDimensionOrder = function(splittedRules, columnCount, inputColumnTypes){
    var dimensionCutsArray = [];
    var stringCutsArray = [];
    for(var i = 0; i < columnCount; i++){
        var uniqueRules = [];
        var oldStringValues = [];
        for(var ruleId in splittedRules){
            var currentRule = splittedRules[ruleId][i];
            var ruleEnd = {};
            if(inputColumnTypes[i] === 'string' || inputColumnTypes[i] === 'boolean'){
                var stringValues = currentRule.multipleStringValues;
                for(var stringValueIndex = 0; stringValueIndex < stringValues.length; stringValueIndex++){
                    if(oldStringValues.indexOf(stringValues[stringValueIndex]) === -1){
                        oldStringValues.push(stringValues[stringValueIndex]);
                    }
                }
            } else{
                var equalSign = currentRule.equalSigns[1];
                var value = currentRule.intervalValues[1];
                if(uniqueRules.length === 0){
                    ruleEnd.equalSign = equalSign;
                    ruleEnd.value = value;
                    uniqueRules.push(ruleEnd);
                } else {
                    var isInList = false;
                    for(var j = 0; j < uniqueRules.length; j++){
                        if(uniqueRules[j].equalSign === equalSign && uniqueRules[j].value === value){
                            isInList = true;
                            break;
                        }
                    }
                    if(!isInList){
                        ruleEnd.equalSign = equalSign;
                        ruleEnd.value = value;
                        uniqueRules.push(ruleEnd);
                    }
                }
            }
        }
        if(inputColumnTypes[i] !== 'string' && inputColumnTypes[i] !== 'boolean'){
            dimensionCutsArray.push({column: i, cuts: uniqueRules.length});
        } else{
            stringCutsArray.push({column: i, cuts: oldStringValues.length});
        }
    }
    
    dimensionCutsArray.sort(this.sortObjectDescending);
    stringCutsArray.sort(this.sortObjectAscending);
    
    return dimensionCutsArray.concat(stringCutsArray);

};

OptimizeTable.prototype.sortObjectDescending = function(a,b) {
    return b.cuts - a.cuts;
};

OptimizeTable.prototype.sortObjectAscending = function(a,b) {
    return a.cuts - b.cuts;
};


OptimizeTable.prototype.mergeRulesCategoryValues = function(columnIndex, columnCount, comparingRules, inputColumnTypes){
    
    var ruleIDs = Object.keys(comparingRules);
    var ruleCount = ruleIDs.length;
    
    for(var firstRuleIndex = 0; firstRuleIndex < ruleCount; firstRuleIndex++){
        var firstRule = comparingRules[ruleIDs[firstRuleIndex]];
        if(firstRule !== undefined){
            for(var secondRuleIndex = firstRuleIndex+1; secondRuleIndex < ruleCount; secondRuleIndex++){
                var secondRule = comparingRules[ruleIDs[secondRuleIndex]];
                if(secondRule !== undefined){
                    var rulesMeet = true;
                    for(var col = 0; col < columnCount; col++){
                        if(col !== columnIndex){
                            if(firstRule[col].value !== secondRule[col].value){
                                rulesMeet = false;
                                break;
                            }
                        }
                    }
                    var colType = firstRule[columnIndex].type;
                    if(rulesMeet){
                        var newValue = {};
                        var cellValues = secondRule[columnIndex].value;
                        var oldValue = firstRule[columnIndex].value;
                        var newCharValue = oldValue + ', ' + secondRule[columnIndex].value;
                        newValue.allowedValues = cellValues.allowedValues;
                        var stringOldValues = firstRule[columnIndex].multipleStringValues;
                        var stringValues = secondRule[columnIndex].multipleStringValues;
                        for(var stringIndex = 0; stringIndex < stringValues.length; stringIndex++){
                            if(stringOldValues.indexOf(stringValues[stringIndex]) === -1){
                                stringOldValues.push(stringValues[stringIndex]);
                            }
                        }
                        newValue.multipleStringValues = stringOldValues;
                        newValue.value = newCharValue;
                        newValue.text = newCharValue;
                            
                        newValue.type = colType;
                        comparingRules[ruleIDs[firstRuleIndex]][columnIndex] = newValue;
                        delete comparingRules[ruleIDs[secondRuleIndex]];
                    }
                }
            }
        }
    }
    return comparingRules;
};


OptimizeTable.prototype.mergeRules = function(frontList, backList, meetsList, 
    columnIndex, columnCount, comparingRules, inputColumnTypes){
    
    var newFrontList = meetsList;
    var newBackList = {};
	var col = 0;
	var colType = "";
	var firstHalf = "";
	var secondHalf = "";
	var newValue = {};
	var cellValues = {};
	var oldValue = "";
	var newCharValue = "";
	var stringOldValues = [];
	var stringValues = [];
	var lastRuleNumericValueObject = {};
	var previousRuleNumericValueObject = {};
    for(var backListRuleId in backList){
        var rulesThatFitInsideRule = {};
        var backListRule = backList[backListRuleId];
        if(backListRule !== undefined){
            var twoRulesHasMerged = false;
			var meetsListRule = {};
			var rulesMeet = false;
            for(var meetsListRuleId in meetsList){
                meetsListRule = meetsList[meetsListRuleId];
                rulesMeet = true;
                var ruleFitInsideRule = true;
                for(col = 0; col < columnCount; col++){
                    if(col !== columnIndex){
                        if(backListRule[col].value !== meetsListRule[col].value){
                            rulesMeet = false;
                        }
                        var type = inputColumnTypes[col];
                        if(type === 'string' || type === 'boolean'){
                            var backListStringValues = backListRule[col].multipleStringValues;
                            var frontListStringValues = meetsListRule[col].multipleStringValues;
                            
                            for(var i = 0; i < frontListStringValues.length; i++){
                                if(backListStringValues.indexOf(frontListStringValues[i]) === -1){
                                    ruleFitInsideRule = false;
                                    break;
                                }
                            }
                        } else{
                            if(backListRule[col].intervalValues[0] <= meetsListRule[col].intervalValues[0] && 
                                backListRule[col].intervalValues[1] >= meetsListRule[col].intervalValues[1]){
                                if(backListRule[col].intervalValues[0] === meetsListRule[col].intervalValues[0] &&
                                    !backListRule[col].equalSigns[0] && meetsListRule[col].equalSigns[0]){
                                    
                                    ruleFitInsideRule = false;
                                    break;
                                }
                                
                                if(backListRule[col].intervalValues[1] === meetsListRule[col].intervalValues[1] &&
                                    !backListRule[col].equalSigns[1] && meetsListRule[col].equalSigns[1]){
                                    
                                    ruleFitInsideRule = false;
                                    break;
                                }
                                
                            } else{
                                ruleFitInsideRule = false;
                                break;
                            }
                        }
                    }
                    if(!ruleFitInsideRule && !rulesMeet){
                        break;
                    }
                }
                
                if(rulesMeet){
                    firstHalf = backListRule[columnIndex].value;
                    secondHalf = meetsListRule[columnIndex].value;
                    colType = comparingRules[meetsListRuleId][columnIndex].type;
                    newValue = {};
                    if(colType === 'string' || colType === 'boolean'){
                        cellValues = meetsListRule[columnIndex];
                        oldValue = backListRule[columnIndex].value;
                        newCharValue = oldValue + ', ' + meetsListRule[columnIndex].value;
                        newValue.allowedValues = cellValues.allowedValues;
                        stringOldValues = backListRule[columnIndex].multipleStringValues;
                        stringValues = meetsListRule[columnIndex].multipleStringValues;
                        for(var stringIndex = 0; stringIndex < stringValues.length; stringIndex++){
                            if(stringOldValues.indexOf(stringValues[stringIndex]) === -1){
                                stringOldValues.push(stringValues[stringIndex]);
                            }
                        }
                        newValue.multipleStringValues = stringOldValues;
                        newValue.value = newCharValue;
                        newValue.text = newCharValue;
                    } else{
                        lastRuleNumericValueObject = new this.NumericCellAttributes(firstHalf);
                        previousRuleNumericValueObject = 
                            new this.NumericCellAttributes(secondHalf);
                        newValue = this.mergeTwoIntervalValues(lastRuleNumericValueObject, 
                            previousRuleNumericValueObject, colType);
                    }
                    if(newValue !== 'Impossible to merge'){
                        twoRulesHasMerged = true;
                        newValue.type = colType;
                        comparingRules[meetsListRuleId][columnIndex] = newValue;
                        newFrontList[meetsListRuleId][columnIndex] = newValue;
                        delete comparingRules[backListRuleId];
                        newBackList[meetsListRuleId] = comparingRules[meetsListRuleId];
                        break;
                    }
                }
                if(ruleFitInsideRule){
                    rulesThatFitInsideRule[meetsListRuleId] = (JSON.parse(JSON.stringify(meetsListRule)));
                }
            }
            if(Object.keys(rulesThatFitInsideRule).length > 0){
                var mergeHappened = true;
                var ruleIDsForDelete = Object.keys(rulesThatFitInsideRule);
                while(mergeHappened){
                    mergeHappened = false;
                    var ruleIDs = Object.keys(rulesThatFitInsideRule);
                    var ruleCount = ruleIDs.length;
                    
                    for(var firstRuleIndex = 0; firstRuleIndex < ruleCount; firstRuleIndex++){
                        var firstRule = rulesThatFitInsideRule[ruleIDs[firstRuleIndex]];
                        if(firstRule !== undefined){
                            for(var secondRuleIndex = firstRuleIndex+1; secondRuleIndex < ruleCount; secondRuleIndex++){
                                var secondRule = rulesThatFitInsideRule[ruleIDs[secondRuleIndex]];
                                var differentColumnIndex = -1;
                                var moreThanTwoColumnsDiffer = false;
                                for(col = 0; col < columnCount; col++){
                                    if(firstRule[col].value !== secondRule[col].value){
                                        if(differentColumnIndex > -1){
                                            moreThanTwoColumnsDiffer = true;
                                            break;
                                        } else {
                                            differentColumnIndex = col;
                                        }
                                    }
                                }
                                colType = firstRule[differentColumnIndex].type;
                                if(!moreThanTwoColumnsDiffer && (colType !== 'string' && colType !== 'boolean')){
                                    firstHalf = firstRule[differentColumnIndex].value;
                                    secondHalf = secondRule[differentColumnIndex].value;
                                    
                                    newValue = {};
                                    if(colType === 'string' || colType === 'boolean'){
                                        cellValues = secondRule[differentColumnIndex];
                                        oldValue = firstRule[differentColumnIndex].value;
                                        newCharValue = oldValue + ', ' + secondRule[differentColumnIndex].value;
                                        newValue.allowedValues = cellValues.allowedValues;
                                        stringOldValues = backListRule[columnIndex].multipleStringValues;
                                        stringValues = meetsListRule[columnIndex].multipleStringValues;
                                        for(var strIndex = 0; strIndex < stringValues.length; strIndex++){
                                            if(stringOldValues.indexOf(stringValues[strIndex]) === -1){
                                                stringOldValues.push(stringValues[strIndex]);
                                            }
                                        }
                                        newValue.multipleStringValues = stringOldValues;
                                        newValue.value = newCharValue;
                                        newValue.text = newCharValue;
                                    } else{
                                        lastRuleNumericValueObject = new this.NumericCellAttributes(firstHalf);
                                        previousRuleNumericValueObject = 
                                            new this.NumericCellAttributes(secondHalf);
                                        newValue = this.mergeTwoIntervalValues(lastRuleNumericValueObject, 
                                            previousRuleNumericValueObject, colType);
                                    }
                                    if(newValue !== 'Impossible to merge'){
                                        newValue.type = colType;
										var clauseIndex = differentColumnIndex;
                                        rulesThatFitInsideRule[ruleIDs[secondRuleIndex]][clauseIndex] = newValue;
                                        delete rulesThatFitInsideRule[ruleIDs[firstRuleIndex]];
                                        mergeHappened = true;
                                        break;
                                    }
                                }
                            }
                            if(mergeHappened){
                                break;
                            }
                        }
                    }
                }
                
                if(Object.keys(rulesThatFitInsideRule).length === 1){
                    var ruleId = Object.keys(rulesThatFitInsideRule)[0];
                    var rule = rulesThatFitInsideRule[ruleId];
                    rulesMeet = true;
                    for(col = 0; col < columnCount; col++){
                        if(col !== columnIndex){
                            if(backListRule[col].value !== rule[col].value){
                                rulesMeet = false;
                                break;
                            }
                        }
                    }
                    if(rulesMeet){
                        firstHalf = backListRule[columnIndex].value;
                        secondHalf = rule[columnIndex].value;
                        colType = comparingRules[meetsListRuleId][columnIndex].type;
                        newValue = {};
                        if(colType === 'string' || colType === 'boolean'){
                            cellValues = rule[columnIndex].value;
                            oldValue = backListRule[columnIndex].value;
                            newCharValue = oldValue + ', ' + rule[columnIndex].value;
                            newValue.allowedValues = cellValues.allowedValues;
                            newValue.multipleStringValues = backListRule[columnIndex].multipleStringValues;
                            newValue.multipleStringValues.push(rule[columnIndex].value);
                            newValue.value = newCharValue;
                            newValue.text = newCharValue;
                        } else{
                            lastRuleNumericValueObject = new this.NumericCellAttributes(firstHalf);
                            previousRuleNumericValueObject = 
                                new this.NumericCellAttributes(secondHalf);
                            newValue = this.mergeTwoIntervalValues(lastRuleNumericValueObject, 
                                previousRuleNumericValueObject, colType);
                        }
                        if(newValue !== 'Impossible to merge'){
                            newValue.type = colType;
                            backList[backListRuleId][columnIndex] = newValue;
                            comparingRules[backListRuleId][columnIndex] = newValue;
                            for(var deleteIndex = 0; deleteIndex < ruleIDsForDelete.length; deleteIndex++){
                                delete comparingRules[ruleIDsForDelete[deleteIndex]];
                                delete meetsList[ruleIDsForDelete[deleteIndex]];
                            }
                        }
                    }
                }
            }
            if(!twoRulesHasMerged){
                newBackList[backListRuleId] = comparingRules[backListRuleId];
                newFrontList[backListRuleId] = comparingRules[backListRuleId];
            }
        }
    }
	
	var newRules = this.mergeAdjacencyRules(newBackList, comparingRules, newFrontList, columnCount);
    
    return newRules;
};


OptimizeTable.prototype.mergeAdjacencyRules = function(newBackList, comparingRules, newFrontList, columnCount){
	var mergeTookPlace = true;
    while(mergeTookPlace){
        mergeTookPlace = false;
        var ruleIDs = Object.keys(newBackList);
        var ruleCount = ruleIDs.length;
        
        for(var firstRuleIndex = 0; firstRuleIndex < ruleCount; firstRuleIndex++){
            var firstRule = newBackList[ruleIDs[firstRuleIndex]];
            if(firstRule !== undefined){
                for(var secondRuleIndex = firstRuleIndex+1; secondRuleIndex < ruleCount; secondRuleIndex++){
                    var secondRule = newBackList[ruleIDs[secondRuleIndex]];
                    var differentColumnIndex = -1;
                    var moreThanTwoColumnsDiffer = false;
                    for(var col = 0; col < columnCount; col++){
                        if(firstRule[col].value !== secondRule[col].value){
                            if(differentColumnIndex > -1){
                                moreThanTwoColumnsDiffer = true;
                                break;
                            } else {
                                differentColumnIndex = col;
                            }
                        }
                    }
                    var colType = firstRule[differentColumnIndex].type;
                    if(!moreThanTwoColumnsDiffer && (colType !== 'string' && colType !== 'boolean')){
                        var firstHalf = firstRule[differentColumnIndex].value;
                        var secondHalf = secondRule[differentColumnIndex].value;
                        
                        var newValue = {};
                        if(colType === 'string' || colType === 'boolean'){
                            var cellValues = secondRule[differentColumnIndex].value;
                            var oldValue = firstRule[differentColumnIndex].value;
                            var newCharValue = oldValue + ', ' + secondRule[differentColumnIndex].value;
                            newValue.allowedValues = cellValues.allowedValues;
                            newValue.multipleStringValues = firstRule[differentColumnIndex].multipleStringValues;
                            newValue.multipleStringValues.push(secondRule[differentColumnIndex].value);
                            newValue.value = newCharValue;
                            newValue.text = newCharValue;
                        } else{
                            var lastRuleNumericValueObject = new this.NumericCellAttributes(firstHalf);
                            var previousRuleNumericValueObject = 
                                new this.NumericCellAttributes(secondHalf);
                            newValue = this.mergeTwoIntervalValues(lastRuleNumericValueObject, 
                                previousRuleNumericValueObject, colType);
                        }
                        if(newValue !== 'Impossible to merge'){
                                
                            newValue.type = colType;
                            newBackList[ruleIDs[secondRuleIndex]][differentColumnIndex] = newValue;
                            comparingRules[ruleIDs[secondRuleIndex]][differentColumnIndex] = newValue;
                            newFrontList[ruleIDs[secondRuleIndex]][differentColumnIndex] = newValue;
                            delete comparingRules[ruleIDs[firstRuleIndex]];
                            delete newBackList[ruleIDs[firstRuleIndex]];
                            delete newFrontList[ruleIDs[firstRuleIndex]];
                            mergeTookPlace = true;
                            break;
                        }
                    }
                }
                if(mergeTookPlace){
                    break;
                }
            }
        }
    }
	return [comparingRules, newFrontList];
};



OptimizeTable.prototype.addNewRulesIntoTable = function(newRules, inputIDs, outputIDs, outputs) {
    
    var lastRule = this._sheet._lastRow.body;

    while(lastRule !== null){
        this._elementRegistry.remove(lastRule);
        this._modeling.deleteRow(lastRule);
        this._sheet.removeRow(lastRule);
        lastRule = this._sheet._lastRow.body;
        
    }
    

    for(var r = 0; r < newRules.length; r++){
        var ruleIDs = Object.keys(newRules[r]);
        for(var rule = 0; rule < ruleIDs.length; rule++){
            var newRowId = ids.next();
            this._modeling.createRow({ id: newRowId });
            for(var inputIndex = 0; inputIndex < inputIDs.length; inputIndex++){
                this._modeling.editCell(newRowId, inputIDs[inputIndex], newRules[r][ruleIDs[rule]][inputIndex].value);
            }
            for(var outputIndex = 0; outputIndex < outputIDs.length; outputIndex++){
                this._modeling.editCell(newRowId, outputIDs[outputIndex], outputs[r][outputIndex]);
            }
        }
    }
};


OptimizeTable.prototype.mergeTwoIntervalValues = function(
	lastRuleNumericValueObject, previousRuleNumericValueObject, colType) {
    var newIntervalValue = NaN;
    var newIntervalObject = {};
    var firstRuleFirstValue = NaN;
    var firstRuleSecondValue = NaN;
    var secondRuleFirstValue = NaN;
    var secondRuleSecondValue = NaN;
    var firstRuleBeginningBrackets = false;
    var firstRuleEndBrackets = false;
    var secondRuleBeginningBrackets = false;
    var secondRuleEndBrackets = false;
    if(lastRuleNumericValueObject.intervalValues[0] <= previousRuleNumericValueObject.intervalValues[0]){
        firstRuleFirstValue = lastRuleNumericValueObject.intervalValues[0];
        firstRuleSecondValue = lastRuleNumericValueObject.intervalValues[1];
        secondRuleFirstValue = previousRuleNumericValueObject.intervalValues[0];
        secondRuleSecondValue = previousRuleNumericValueObject.intervalValues[1];
        firstRuleBeginningBrackets = lastRuleNumericValueObject.equalSigns[0];
        firstRuleEndBrackets = lastRuleNumericValueObject.equalSigns[1];
        secondRuleBeginningBrackets = previousRuleNumericValueObject.equalSigns[0];
        secondRuleEndBrackets = previousRuleNumericValueObject.equalSigns[1];
    } else{
        firstRuleFirstValue = previousRuleNumericValueObject.intervalValues[0];
        firstRuleSecondValue = previousRuleNumericValueObject.intervalValues[1];
        secondRuleFirstValue = lastRuleNumericValueObject.intervalValues[0];
        secondRuleSecondValue = lastRuleNumericValueObject.intervalValues[1];
        firstRuleBeginningBrackets = previousRuleNumericValueObject.equalSigns[0];
        firstRuleEndBrackets = previousRuleNumericValueObject.equalSigns[1];
        secondRuleBeginningBrackets = lastRuleNumericValueObject.equalSigns[0];
        secondRuleEndBrackets = lastRuleNumericValueObject.equalSigns[1];
    }
    if(firstRuleFirstValue <= secondRuleFirstValue && 
    ((firstRuleSecondValue > secondRuleFirstValue) || (
    (colType === 'double' && firstRuleSecondValue === secondRuleFirstValue) || 
    ((colType === 'integer' || colType === 'long') && firstRuleSecondValue + 1 === secondRuleFirstValue) &&
    (firstRuleEndBrackets || secondRuleBeginningBrackets)))){
        var minIntervalFirstValue = Math.min(firstRuleFirstValue, secondRuleFirstValue);
        var maxIntervalSecondValue = Math.max(firstRuleSecondValue, secondRuleSecondValue);
        if(maxIntervalSecondValue === Infinity){
            if(minIntervalFirstValue === -Infinity){
                newIntervalValue = '';
                newIntervalObject.equalSigns = [false, false];
                newIntervalObject.intervalValues = [-Infinity, Infinity];
                newIntervalObject.text = '';
                newIntervalObject.value = '';
            } else{
                newIntervalObject.equalSigns = [false, false];
                newIntervalObject.intervalValues = [minIntervalFirstValue, Infinity];
                if((firstRuleFirstValue === secondRuleFirstValue &&
                (firstRuleBeginningBrackets || secondRuleBeginningBrackets)) || 
                ((firstRuleFirstValue < secondRuleFirstValue) && firstRuleBeginningBrackets)){
                    newIntervalValue = '>= ' + minIntervalFirstValue;
                    newIntervalObject.equalSigns[0] = true;
                } else{
                    newIntervalValue = '> ' + minIntervalFirstValue;
                }
                newIntervalObject.text = newIntervalValue;
                newIntervalObject.value = newIntervalValue;
            }
        } else if(minIntervalFirstValue === -Infinity){
            newIntervalObject.equalSigns = [false, false];
            newIntervalObject.intervalValues = [-Infinity, maxIntervalSecondValue];
            if((firstRuleSecondValue === secondRuleSecondValue &&
            (firstRuleEndBrackets || secondRuleEndBrackets)) || 
            ((firstRuleSecondValue < secondRuleSecondValue) && secondRuleEndBrackets) || 
            ((firstRuleSecondValue > secondRuleSecondValue) && firstRuleEndBrackets)){
                newIntervalValue = '<= ' + maxIntervalSecondValue;
                newIntervalObject.equalSigns[1] = true;
            } else{
                newIntervalValue = '< ' + maxIntervalSecondValue;
            }
            newIntervalObject.text = newIntervalValue;
            newIntervalObject.value = newIntervalValue;
        } else{
            newIntervalObject.equalSigns = [true, true];
            newIntervalObject.intervalValues = [minIntervalFirstValue, maxIntervalSecondValue];
            
            if(minIntervalFirstValue === maxIntervalSecondValue){
                newIntervalValue = minIntervalFirstValue.toString();
                newIntervalObject.text = newIntervalValue;
                newIntervalObject.value = newIntervalValue;
            } else{
                if((((colType === 'integer' || colType === 'long') && 
					firstRuleFirstValue + 1 === secondRuleFirstValue) ||
                (colType === 'double' && firstRuleFirstValue === secondRuleFirstValue) &&
                (firstRuleBeginningBrackets || secondRuleBeginningBrackets)) || 
                ((firstRuleFirstValue < secondRuleFirstValue) && firstRuleBeginningBrackets)){
                    newIntervalValue = '[' + minIntervalFirstValue + ', ';
                } else{
                    newIntervalValue = '(' + minIntervalFirstValue + ', ';
                    newIntervalObject.equalSigns[0] = false;
                } 
                if((((colType === 'integer' || colType === 'long') && 
					firstRuleFirstValue + 1 === secondRuleFirstValue) ||
                (colType === 'double' && firstRuleFirstValue === secondRuleFirstValue) &&
                (firstRuleBeginningBrackets || secondRuleBeginningBrackets)) || 
                ((firstRuleSecondValue < secondRuleSecondValue) && secondRuleEndBrackets) || 
                ((firstRuleSecondValue > secondRuleSecondValue) && firstRuleEndBrackets)){
                    newIntervalValue = newIntervalValue + maxIntervalSecondValue + ']';
                } else{
                    newIntervalObject.equalSigns[1] = false;
                    newIntervalValue = newIntervalValue + maxIntervalSecondValue + ')';
                }
                newIntervalObject.text = newIntervalValue;
                newIntervalObject.value = newIntervalValue;
            }
        }
    } else{
        newIntervalObject = 'Impossible to merge';
    }
    return newIntervalObject;
};

OptimizeTable.prototype.NumericCellAttributes = function(value){
    this.value = value;
    var numericValue = NaN;
    if(value.indexOf('<') > -1){
        numericValue = Number(value.replace(/[<>=\s+]/g, ''));
        this.intervalValues = [-Infinity, numericValue];
        if(value.indexOf('=') > -1){
            this.equalSigns = [false, true];
        } else {
            this.equalSigns = [false, false];
        }
    } else if(value.indexOf('>') > -1){
        numericValue = Number(value.replace(/[<>=\s+]/g, ''));
        this.intervalValues = [numericValue, Infinity];
        if(value.indexOf('=') > -1){
            this.equalSigns = [true, false];
        } else {
            this.equalSigns = [false, false];
        }
    } else if(value.indexOf(',') > -1){
        var equalSigns = [false, false];
        var intervalValues = value.replace(/\s+/g, '').split(',');
        var intervalValuesWithoutBrackets = value.replace(/[(\[\)\]\s+]/g, '').split(',');
        this.intervalValues = [Number(intervalValuesWithoutBrackets[0]), Number(intervalValuesWithoutBrackets[1])];
        if(intervalValues[0].indexOf('[') > -1){
            equalSigns[0] = true;
        }
        if(intervalValues[1].indexOf(']') > -1){
            equalSigns[1] = true;
        }
        this.equalSigns = equalSigns;
    } else if(value === ''){
        this.intervalValues = [-Infinity, Infinity];
        this.equalSigns = [false, false];
    } else {
        numericValue = Number(value.replace(/[<>=\s+]/g, ''));
        this.intervalValues = [numericValue, numericValue];
        this.equalSigns = [true, true];
    }
};

OptimizeTable.prototype.getInputTypes = function(columnIds){

    var inputColumnTypes = [];
    for(var i = 0; i < columnIds.length; i++){
        var type = this._elementRegistry.get(columnIds[i]).businessObject.inputExpression.typeRef;
        inputColumnTypes.push(type);
    }
    return inputColumnTypes;
};

OptimizeTable.prototype.getInputsWhereTypeIsString = function(inputColumnTypes){
    var stringTypeColumns = [];
    for(var i = 0; i < inputColumnTypes.length; i++){
        if(inputColumnTypes[i] === 'string'){
            stringTypeColumns.push(i);
        }
    }
    return stringTypeColumns;
};

OptimizeTable.prototype.modifyCells = function(inputColumnTypes){
    var lastRule = this._sheet._lastRow.body;
    var differentStringValues = {};
    while(lastRule !== null){
        var ruleInputEntry = lastRule.businessObject.inputEntry;
        for(var i = 0; i < inputColumnTypes.length; i++){
            if(inputColumnTypes[i] !== 'string' && inputColumnTypes[i] !== 'boolean'){
                var equalSigns = [false, false];
                var value = ruleInputEntry[i].text.slice(0);
                ruleInputEntry[i].value = value;
                ruleInputEntry[i].type = inputColumnTypes[i];
                var numericValue = NaN;
                var intervalValues = NaN;
                if(value.indexOf('<') > -1){
                    numericValue = Number(value.replace(/[<>=\s+]/g, ''));
                    intervalValues = [-Infinity, numericValue];
                    if(value.indexOf('=') > -1){
                        equalSigns = [false, true];
                    } else {
                        equalSigns = [false, false];
                    }
                } else if(value.indexOf('>') > -1){
                    numericValue = Number(value.replace(/[<>=\s+]/g, ''));
                    intervalValues = [numericValue, Infinity];
                    if(value.indexOf('=') > -1){
                        equalSigns = [true, false];
                    } else {
                        equalSigns = [false, false];
                    }
                } else if(value.indexOf(',') > -1){
                    equalSigns = [false, false];
                    var intervalOriginalValues = value.replace(/\s+/g, '').split(',');
                    var intervalValuesWithoutBrackets = value.replace(/[(\[\)\]\s+]/g, '').split(',');
                    intervalValues = [Number(intervalValuesWithoutBrackets[0]), 
						Number(intervalValuesWithoutBrackets[1])];
                    if(intervalOriginalValues[0].indexOf('[') > -1){
                        equalSigns[0] = true;
                    }
                    if(intervalOriginalValues[1].indexOf(']') > -1){
                        equalSigns[1] = true;
                    }
                    equalSigns = equalSigns;
                } else if(value === ''){
                    intervalValues = [Number.NEGATIVE_INFINITY, Infinity];
                    equalSigns = [false, false];
                } else {
                    numericValue = Number(value.replace(/[<>=\s+]/g, ''));
                    intervalValues = [numericValue, numericValue];
                    equalSigns = [true, true];
                }
                ruleInputEntry[i].equalSigns = equalSigns.splice(0);
                ruleInputEntry[i].intervalValues = intervalValues.splice(0);
            } else if(inputColumnTypes[i] === 'string'){
                var colNumber = i;
                var cellValue = ruleInputEntry[colNumber].text;
                ruleInputEntry[colNumber].value = cellValue;
                ruleInputEntry[colNumber].type = 'string';
                cellValue = cellValue.replace(/[\s+]/g, '').split(',');
                ruleInputEntry[colNumber].multipleStringValues = 
					ruleInputEntry[colNumber].text.replace(/[\s+]/g, '').split(',').sort();
                if(typeof differentStringValues[colNumber] === 'undefined'){
                    differentStringValues[colNumber] = cellValue;
                    ruleInputEntry[colNumber].allowedValues = cellValue;
                } else{
                    for(var j = 0; j < cellValue.length; j++){    
                        var columnValues = differentStringValues[colNumber];                
                        if(differentStringValues[colNumber].indexOf(cellValue[j]) === -1){
                            columnValues.push(cellValue[j]);
                            differentStringValues[colNumber] = columnValues;
                            
                        }
                        ruleInputEntry[colNumber].allowedValues = columnValues.sort();
                        
                    }
                }
            } else if(inputColumnTypes[i] === 'boolean'){
                var booleanColNumber = i;
                var booleanValue = ruleInputEntry[booleanColNumber].text;
                if(booleanValue === '0'){
                    booleanValue = 'false';
                } else if(booleanValue === '1'){
                    booleanValue = 'true';
                }
                ruleInputEntry[booleanColNumber].value = booleanValue;
                ruleInputEntry[booleanColNumber].type = 'boolean';
                ruleInputEntry[booleanColNumber].allowedValues = ['true', 'false'];
                ruleInputEntry[booleanColNumber].multipleStringValues = [booleanValue];
                
            }
        }
        
        lastRule = lastRule.previous;
    }
};

OptimizeTable.prototype.modifyCellsWithNumericValues = function(inputColumnTypes){
    for(var i = 0; i < inputColumnTypes.length; i++){
        if(inputColumnTypes[i] !== 'string' && inputColumnTypes[i] !== 'boolean'){
            var lastRule = this._sheet._lastRow.body;
            
            while(lastRule !== null){
                var equalSigns = [false, false];
                var ruleInputEntry = lastRule.businessObject.inputEntry;
                var value = ruleInputEntry[i].text.slice(0);
                ruleInputEntry[i].value = value;
                ruleInputEntry[i].type = inputColumnTypes[i];
                var numericValue = NaN;
                var intervalValues = NaN;
                if(value.indexOf('<') > -1){
                    numericValue = Number(value.replace(/[<>=\s+]/g, ''));
                    intervalValues = [-Infinity, numericValue];
                    if(value.indexOf('=') > -1){
                        equalSigns = [false, true];
                    } else {
                        equalSigns = [false, false];
                    }
                } else if(value.indexOf('>') > -1){
                    numericValue = Number(value.replace(/[<>=\s+]/g, ''));
                    intervalValues = [numericValue, Infinity];
                    if(value.indexOf('=') > -1){
                        equalSigns = [true, false];
                    } else {
                        equalSigns = [false, false];
                    }
                } else if(value.indexOf(',') > -1){
                    equalSigns = [false, false];
                    var intervalOriginalValues = value.replace(/\s+/g, '').split(',');
                    var intervalValuesWithoutBrackets = value.replace(/[(\[\)\]\s+]/g, '').split(',');
                    intervalValues = [Number(intervalValuesWithoutBrackets[0]), 
						Number(intervalValuesWithoutBrackets[1])];
                    if(intervalOriginalValues[0].indexOf('[') > -1){
                        equalSigns[0] = true;
                    }
                    if(intervalOriginalValues[1].indexOf(']') > -1){
                        equalSigns[1] = true;
                    }
                    equalSigns = equalSigns;
                } else if(value === ''){
                    intervalValues = [Number.NEGATIVE_INFINITY, Infinity];
                    equalSigns = [false, false];
                } else {
                    numericValue = Number(value.replace(/[<>=\s+]/g, ''));
                    intervalValues = [numericValue, numericValue];
                    equalSigns = [true, true];
                }
                ruleInputEntry[i].equalSigns = equalSigns.splice(0);
                ruleInputEntry[i].intervalValues = intervalValues.splice(0);
                lastRule = lastRule.previous;
            }
        }
    }
};

OptimizeTable.prototype.getInputIds = function(){
    var lastColumn = this._sheet._lastColumn.previous;
    var inputIDs = [];
    var outputIDs = [];
    
    while(lastColumn !== null){
        if(lastColumn.type === 'dmn:InputClause'){
            inputIDs.unshift(lastColumn.id);
        } else if(lastColumn.type === 'dmn:OutputClause'){
            outputIDs.unshift(lastColumn.id);
        }
        lastColumn = lastColumn.previous;
    }
    return [inputIDs, outputIDs];
};


OptimizeTable.prototype.getOutputIds = function(){
    var lastColumn = this._sheet._lastColumn.previous;
    var columnIds = [];
    
    while(lastColumn !== null){
        if(lastColumn.type === 'dmn:InputClause'){
            break;
        }
        columnIds.push(lastColumn.id);
        lastColumn = lastColumn.previous;
    }
    columnIds = columnIds.reverse();
    return columnIds;
};


OptimizeTable.prototype.getDifferentStringValuesInEachInput = function(stringTypeColumns){
    
    var lastRule = this._sheet._lastRow.body;
    var differentStringValues = {};
    
    while(lastRule !== null){
        var ruleInputEntry = lastRule.businessObject.inputEntry;
        for(var i = 0; i < stringTypeColumns.length; i++){
            var colNumber = stringTypeColumns[i];
            var cellValue = ruleInputEntry[colNumber].text;
            ruleInputEntry[colNumber].value = cellValue;
            ruleInputEntry[colNumber].type = 'string';
            cellValue = cellValue.replace(/[\s+]/g, '').split(',');
            ruleInputEntry[colNumber].multipleStringValues = 
				ruleInputEntry[colNumber].text.replace(/[\s+]/g, '').split(',').sort();
            if(typeof differentStringValues[colNumber] === 'undefined'){
                differentStringValues[colNumber] = cellValue;
                ruleInputEntry[colNumber].allowedValues = cellValue;
            } else{
                for(var j = 0; j < cellValue.length; j++){    
                    var columnValues = differentStringValues[colNumber];                
                    if(differentStringValues[colNumber].indexOf(cellValue[j]) === -1){
                        columnValues.push(cellValue[j]);
                        differentStringValues[colNumber] = columnValues;
                        
                    }
                    ruleInputEntry[colNumber].allowedValues = columnValues.sort();
                    
                }
            }
        }
        lastRule = lastRule.previous;
    }
    
    return differentStringValues;
};
    

OptimizeTable.prototype.splitTheRules = function(comparingRules, inputColumnCount, inputColumnTypes){  
    for(var columnIndex = 0; columnIndex < inputColumnCount; columnIndex++){
        var newRules = {};
        var ruleType = inputColumnTypes[columnIndex];
        var overlappingRules = {};
        var lastIntervalValue = null;
        var lastIntervalEqualSign = false;
        var lastIntervalIsStartInterval = false;
        var lastRuleId = null;
        var sortedRuleOrder = this.sortRules(comparingRules, columnIndex);
        for(var i = 0; i < sortedRuleOrder.length; i++){
            var ruleId = Object.keys(sortedRuleOrder[i])[0];
            var rule = sortedRuleOrder[i][ruleId];
            var ruleValue = rule.value;
            var newIntervalValue = true;
                
            if(Object.keys(overlappingRules).length === 0 || 
            ((lastIntervalValue === ruleValue) && 
            ((!lastIntervalIsStartInterval && rule.start && lastIntervalEqualSign !== rule.equal) ||
            (lastIntervalIsStartInterval === rule.start && lastIntervalEqualSign === rule.equal)))){
                newIntervalValue = false;                            
            } else if(((ruleType === 'integer' || ruleType === 'long') && 
				parseInt(lastIntervalValue) + 1 === parseInt(ruleValue)) &&
            !lastIntervalIsStartInterval && rule.start){
                newIntervalValue = false;       
            }
            var ruleIds = Object.keys(overlappingRules);
            if(newIntervalValue && ruleIds.length > 0){
                var missingRule = this.constructOverlappingRange(lastIntervalValue, lastIntervalEqualSign,
                    rule, ruleType, lastIntervalIsStartInterval);
                
                missingRule = missingRule.toString();
                var newCellValues = {};
                if(ruleType !== 'string' && ruleType !== 'boolean'){
                    newCellValues = new this.NumericCellAttributes(missingRule);
                }
                for(var idIndex = 0; idIndex < ruleIds.length; idIndex++){
                    if(comparingRules[ruleIds[idIndex]] !== undefined){
                        var newRule = [];
                        var ruleValues = [];
                        for(var columnPosition = 0; columnPosition < inputColumnCount; columnPosition++){
                            var ruleCopy = comparingRules[ruleIds[idIndex]][columnPosition];
                            var newCellValue = {};
                            newCellValue.type = ruleCopy.type;
                            var type = inputColumnTypes[columnPosition];

                            if(columnPosition === columnIndex){
                                newCellValue.value = missingRule;
                                newCellValue.text = missingRule;
                                if(type !== 'string' && type !== 'boolean'){
                                    newCellValue.intervalValues = newCellValues.intervalValues;
                                    newCellValue.equalSigns = newCellValues.equalSigns;
                                } else{
                                    newCellValue.allowedValues = ruleCopy.allowedValues;
                                    newCellValue.multipleStringValues = [missingRule];
                                }
                                ruleValues.push(missingRule);
                            } else {
                                newCellValue.value = ruleCopy.value;
                                newCellValue.text = ruleCopy.text;
                                if(type !== 'string' && type !== 'boolean'){
                                    newCellValue.intervalValues = ruleCopy.intervalValues;
                                    newCellValue.equalSigns = ruleCopy.equalSigns;
                                } else{
                                    newCellValue.allowedValues = ruleCopy.allowedValues;
                                    newCellValue.multipleStringValues = ruleCopy.multipleStringValues;
                                }
                                ruleValues.push(ruleCopy.text);
                            }
                            newRule[columnPosition] = newCellValue;
                        }
                        var ruleExist = false;
                        for(var id in newRules){
                            if(ruleValues.toString() === newRules[id].ruleValues.toString()){
                                ruleExist = true;
                                break;
                            }
                        }
                        if(!ruleExist){
                            var newRowId = ids.next();
                            newRules[newRowId] = newRule;
                            newRules[newRowId].ruleValues = ruleValues;
                        }
                    }
                    
                }
            }
            if(rule.start){
                overlappingRules[ruleId] = rule;
            } else{
                delete overlappingRules[ruleId];
            }
            lastIntervalIsStartInterval = rule.start;
            lastIntervalValue = ruleValue;
            lastIntervalEqualSign = rule.equal;
            lastRuleId = ruleId;
        }
        comparingRules = newRules;
    }
    return comparingRules;
};


OptimizeTable.prototype.constructOverlappingRange = function(lastValue, 
    equalSign, rule, ruleType, lastIntervalIsStartInterval){
    var ruleValue = rule.value;
    var ruleEqualSign = rule.equal;
    var ruleStart = rule.start;
    var range = '';
    if(ruleType === 'string' || ruleType === 'boolean'){
        range = lastValue;
    } else{
        var rangeInequalitySign = '';
        var rangeEqualSign = '';
        if(lastValue === -Infinity){
            if(ruleValue === Infinity){
                range = '';
            } else{
                if((ruleStart && !ruleEqualSign) || (!ruleStart && ruleEqualSign)){
                    rangeEqualSign = '=';
                } else if(ruleType === 'integer' || ruleType === 'long'){
                    ruleValue = parseInt(ruleValue) - 1;
                    rangeEqualSign = '=';
                }
                rangeInequalitySign = '<';
                range = rangeInequalitySign + rangeEqualSign + ' ' + ruleValue;
            }
        } else if(ruleValue === Infinity){
            if((!lastIntervalIsStartInterval && !equalSign) || 
				(lastIntervalIsStartInterval && equalSign)){
                rangeEqualSign = '=';
            } else if(ruleType === 'integer' || ruleType === 'long'){
                lastValue = parseInt(lastValue) + 1;
                rangeEqualSign = '=';
            }
            rangeInequalitySign = '>';
            range = rangeInequalitySign + rangeEqualSign + ' ' + lastValue;
        } else{
            if(equalSign === ruleEqualSign && ruleValue === lastValue){
                range = lastValue;
            } else {
                if((!lastIntervalIsStartInterval && !equalSign) || (lastIntervalIsStartInterval && equalSign)){
                    range = '[' + lastValue +', ';
                } else{
                    if(ruleType === 'integer' || ruleType === 'long'){
                        lastValue = parseInt(lastValue) + 1;
                        range = '[' + lastValue +', ';
                    } else {
                        range = '(' + lastValue +', ';
                    }
                }
                if((ruleStart && !ruleEqualSign) || (!ruleStart && ruleEqualSign)){
                    range += ruleValue +']';
                } else{
                    if(ruleType === 'integer' || ruleType === 'long'){
                        range += ruleValue-1 +']';
                    } else {
                        range += ruleValue +')';
                    }
                }
            }
        }
    }
    return range;
};

OptimizeTable.prototype.sortRules = function(comparingRules, index){
    var allRanges = [];
    var firstRuleId = Object.keys(comparingRules)[0];
    var compactRule= {};
    var rule = NaN;
    if(comparingRules[firstRuleId][index].type !== 'string' && comparingRules[firstRuleId][index].type !== 'boolean'){
        for(var r in comparingRules){
            rule = comparingRules[r][index];
            compactRule= {};
            if(allRanges.length === 0){
                compactRule[r] = new this.CellAttributesForSort(rule, false, false);
                allRanges.push(compactRule);
                compactRule = {};
                compactRule[r] = new this.CellAttributesForSort(rule, true, false);
                allRanges.push(compactRule);
            } else{
                var currentPosition = 0;
                for(var position = 0; position < 2; position++){
                    var pushedToArray = false;
                    for(var i = currentPosition; i < allRanges.length; i++){
                        var currentRuleValue = rule.intervalValues[position];
                        var comparableRule = Object.keys(allRanges[i])[0];
                        var wholeRule = allRanges[i][comparableRule];
                        var value = wholeRule.value;
                        if(currentRuleValue <= value){
                            if(currentRuleValue === value){
                                if((!rule.equalSigns[1] && position) || 
                                (rule.equalSigns[0] && !position && 
                                !(!wholeRule.start && !wholeRule.equal)) || 
                                (rule.equalSigns[1] && position && 
                                !(!wholeRule.start && !wholeRule.equal) && 
                                !(wholeRule.start && wholeRule.equal))){
                                    pushedToArray = true;
                                } 
                            } else {
                                pushedToArray = true;
                            }
                            if(pushedToArray){
                                compactRule = {};
                                compactRule[r] = new this.CellAttributesForSort(rule, position, false);
                                allRanges.splice(i, 0, compactRule);
                                currentPosition = i;
                                break;
                            }
                        }
                    }
                    if(!pushedToArray){
                        compactRule = {};
                        compactRule[r] = new this.CellAttributesForSort(rule, position, false);
                        allRanges.splice(i+1, 0, compactRule);
                        currentPosition = i+1;
                    }
                }
                
            }
        }
    } else {
        var allValues = comparingRules[firstRuleId][index].allowedValues.slice(0);
        var ruleId = NaN;
        if(allValues.length === 1 && allValues[0] === ''){
            for(ruleId in comparingRules){
                rule = comparingRules[ruleId][index];
                compactRule= {};
                compactRule[ruleId] = new this.CellAttributesForSort(rule, false, true, '');
                allRanges.push(compactRule);
                compactRule = {};
                compactRule[ruleId] = new this.CellAttributesForSort(rule, true, true, '');
                allRanges.push(compactRule);
            }
                
        } else{
            for(var valueIndex = 0; valueIndex < allValues.length; valueIndex++){
                var StringValue = allValues[valueIndex];
                if(StringValue !== ''){
                    var ruleEnds = [];
                    for(ruleId in comparingRules){
                        rule = comparingRules[ruleId][index];
                        if(rule.multipleStringValues.indexOf(StringValue) > -1 || 
                        rule.multipleStringValues.indexOf('') > -1){
                            compactRule = {};
                            compactRule[ruleId] = new this.CellAttributesForSort(rule, false, true, StringValue);
                            allRanges.push(compactRule);
                            compactRule = {};
                            compactRule[ruleId] = new this.CellAttributesForSort(rule, true, true, StringValue);
                            ruleEnds.push(compactRule);
                        }
                    }
                    allRanges = allRanges.concat(ruleEnds);
                }
            }
        }
    }
    return allRanges;
};

OptimizeTable.prototype.CellAttributesForSort = function(rule, isEndInterval, isString, stringValue){
    if(isString){
        this.equal = true;
        this.value = stringValue;
    } else{
        var index = 0;
        if(isEndInterval){
            index = 1;
        } 
        this.equal = rule.equalSigns[index];
        this.value = rule.intervalValues[index];
    }
    this.start = !isEndInterval;
};


OptimizeTable.$inject = [ 'elementRegistry', 'modeling', 'sheet'];

module.exports = OptimizeTable;