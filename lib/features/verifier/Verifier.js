'use strict';

var domClasses = require('min-dom/lib/classes');
var domify = require('min-dom/lib/domify');
var domRemove = require('min-dom/lib/remove');
var ids = new(require('diagram-js/lib/util/IdGenerator'))('row');

var overlappingRulesList = [];
var missingRuleList = [];
var inputClauseIDs = [];
var missingRuleListStrings = [];
var inputTypes = [];

function Verifier(elementRegistry, modeling, sheet) {
    this._elementRegistry = elementRegistry;
    this._modeling = modeling;
    this._sheet = sheet;
}

Verifier.prototype.verifyTable = function () {
    overlappingRulesList = [];
    missingRuleList = [];
    missingRuleListStrings = [];
    var childNodes = this._sheet.getContainer().childNodes;
    for(var i = 0; i< childNodes.length; i++){
        if(childNodes[i].getAttribute('id') === 'errorTable'){
            domRemove(this._sheet.getContainer().childNodes[i]);
            break;
        }
    }
    inputClauseIDs = this.getInputIds();
    inputTypes = this.getInputTypes(inputClauseIDs);
    
    var elReg = this._elementRegistry._elements;
    var lastRule = this._sheet._lastRow.body;
    while(lastRule !== null){
        var rule = lastRule.businessObject;
        for(i = 0; i < rule.inputEntry.length; i++){
            var cellId = 'cell_' + inputClauseIDs[i] + '_' + rule.id;
            var elementGFX = elReg[cellId].gfx;
            domClasses(elementGFX).remove('wrongValue');
            elementGFX.onmousemove = null;
            elementGFX.onmouseout = null;
            elementGFX.onmouseover = null;
        }
        domClasses(elReg[lastRule.id].gfx).remove('overlapping-rules-focused');
        lastRule = lastRule.previous;
    }

    var cellValues = this.makeCellsWithNewAttributes(inputClauseIDs);
    
    if(!cellValues[1]){
        var inputAndRules = this.getRulesAndInputs(cellValues[0], inputClauseIDs);
        var rules = inputAndRules[1];
        
        var inputColumnCount = inputClauseIDs.length;
        var ruleArray = Array.apply(null, new Array(inputColumnCount)).map(String.prototype.valueOf, 'any');
        
        var errorTable = domify('<table class="errorTable" id="errorTable" style="margin-top:20px; width:100%;">' + 
        '<thead><tr><th style="text-align:left;" colspan="2"> Missing and overlapping rules</th></tr></thead>' +
        '<tbody class="errorTableBody"></tbody></table>');
        
        this._sheet.getContainer().appendChild(errorTable);

        this.findOverlappingRules(rules, 0, inputColumnCount, '');
        
        var overlappingArray = [];
        for(var pos in overlappingRulesList){
            var currentRules = overlappingRulesList[pos];
            var newOverlappingRules = {};
            var currentRuleIDs = Object.keys(currentRules);
            newOverlappingRules.ruleIDs = [];
            for(var currentRuleID in currentRuleIDs){
                var currentRule = rules[currentRuleIDs[currentRuleID]];
                newOverlappingRules.ruleValue = '';
                newOverlappingRules[currentRuleID] = {};
                newOverlappingRules[currentRuleID].outputEntry = currentRule.outputEntry;
                newOverlappingRules[currentRuleID].ruleNR = currentRule.ruleNR;
                newOverlappingRules.ruleIDs.push(currentRuleIDs[currentRuleID]);
            }
            overlappingArray.push(newOverlappingRules);
        }
        
        this.outputOverlappingAndMissingRules(overlappingArray, false); 
    

        this.findMissingRules(rules, ruleArray, 0, inputColumnCount);
        missingRuleList = missingRuleList.concat(missingRuleListStrings);
        var missingRulesArray = [];

        for(var index in missingRuleList){
            var missingRule = missingRuleList[index];
            if(missingRule !== undefined){
                var missingIntervals = {};
                missingIntervals.ruleValue = missingRule;
                missingRulesArray.push(missingIntervals);
            }
        }
        
        this.outputOverlappingAndMissingRules(missingRulesArray, true);
            
    }
    
};


Verifier.prototype.mergeRules = function(intervals, missingRange, columnCount){
    
    var mergeHappened = true;
    var oneMergeHasHappened = false;
    var prevRuleNR = 0;
    
    var newRange = missingRange;
    while(mergeHappened){
        var intervalCount = intervals.length;
        mergeHappened = false;
        var secondRule = newRange;
        for(var firstRuleIndex = 0; firstRuleIndex < intervalCount; firstRuleIndex++){
            var firstRule = intervals[firstRuleIndex];
            if(firstRule !== undefined){
                
                var differentColumnIndex = -1;
                var moreThanTwoColumnsDiffer = false;
                for(var col = 0; col < columnCount; col++){
                    if(firstRule[col] !== secondRule[col]){
                        if(differentColumnIndex > -1){
                            moreThanTwoColumnsDiffer = true;
                            break;
                        } else {
                            differentColumnIndex = col;
                        }
                    }
                }
                if(!moreThanTwoColumnsDiffer && differentColumnIndex > -1){
                    var firstHalf = firstRule[differentColumnIndex].toString();
                    var secondHalf = secondRule[differentColumnIndex].toString();
                    
                    var newValue = {};
                    var lastRuleNumericValueObject = new this.NumericCellAttributes(firstHalf);
                    var previousRuleNumericValueObject = 
                        new this.NumericCellAttributes(secondHalf);
                    var currentColumnType = inputTypes[differentColumnIndex];
                    newValue = this.mergeTwoIntervalValues(lastRuleNumericValueObject, 
                        previousRuleNumericValueObject, currentColumnType);
                        
                    
                    if(newValue !== 'Impossible to merge' && !mergeHappened){
                        var intervalNewValue = newValue.value;
                        
                        if(oneMergeHasHappened){
                            intervals.splice(prevRuleNR, 1);
                        }
                        firstRule[differentColumnIndex] = intervalNewValue;
                        
                        prevRuleNR = firstRuleIndex;
                        newRange = firstRule.slice(0);
                        oneMergeHasHappened = true;
                        mergeHappened = true;
                        break;
                    }
                }
            }
        }
    }
    if(!oneMergeHasHappened){
        intervals.push(missingRange);
    } 
    return intervals;
};


Verifier.prototype.NumericCellAttributes = function(value){
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

Verifier.prototype.mergeTwoIntervalValues = function(lastRuleNumericValueObject,
	previousRuleNumericValueObject, colType) {
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
    ((firstRuleSecondValue > secondRuleFirstValue) || ((
    (colType === 'double' && firstRuleSecondValue === secondRuleFirstValue) || 
    ((colType === 'integer' || colType === 'long') && firstRuleSecondValue + 1 === secondRuleFirstValue)) &&
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
                newIntervalObject.value = newIntervalValue.toString();
            }
        }
    } else{
        newIntervalObject = 'Impossible to merge';
    }
    return newIntervalObject;
};


Verifier.prototype.sortRules = function(comparingRules, index){
	var allRanges = [];
    var firstRuleId = Object.keys(comparingRules)[0];
    var compactRule= {};
    var rule = NaN;
    if(comparingRules[firstRuleId][index].type !== 'string' && comparingRules[firstRuleId][index].type !== 'boolean'){
        for(var r in comparingRules){
            rule = comparingRules[r][index];
            compactRule = {};
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
                        var comparableRule = Object.keys(allRanges[i])[0];
                        var currentRuleValue = rule.intervalValues[position];
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
        var ruleId = "";
        var ruleIDsAndOverlaps = {};
        var ruleIDsForCompare = {};
        
		var ruleEnds = [];
        if(allValues.length === 1 && allValues[0] === ''){
            for(ruleId in comparingRules){
                rule = comparingRules[ruleId][index];
                compactRule= {};
                compactRule[ruleId] = new this.CellAttributesForSort(rule, false, true, 'any');
                allRanges.push(compactRule);
                compactRule = {};
                compactRule[ruleId] = new this.CellAttributesForSort(rule, true, true, 'any');
                ruleEnds.push(compactRule);
            }
            allRanges = allRanges.concat(ruleEnds);
        } else{
            for(var valueIndex = 0; valueIndex < allValues.length; valueIndex++){
                var StringValue = allValues[valueIndex];
                if(StringValue !== ''){
                    var ruleIDs = [];
                    ruleEnds = [];
                    var valueIsAloneInRule = false;
                    var aloneStringValues = [];
                    for(ruleId in comparingRules){
                        rule = comparingRules[ruleId][index];
                        var ruleContainsAllValues = rule.multipleStringValues.indexOf('') > -1;
                        var valuesCount = rule.multipleStringValues.length;
                        if(ruleContainsAllValues){
                            valuesCount = 2;
                        }
                        if(rule.multipleStringValues.indexOf(StringValue) > -1 || 
                        ruleContainsAllValues){
                            compactRule= {};
                            compactRule[ruleId] = new this.CellAttributesForSort(rule, false, true, StringValue);
                            aloneStringValues.push(compactRule);
                            compactRule= {};
                            compactRule[ruleId] = new this.CellAttributesForSort(rule, true, true, StringValue);
                            ruleEnds.push(compactRule);
                            if(valuesCount === 1){
                                valueIsAloneInRule = true;
                            }
                            ruleIDs.push(ruleId);
                        }
                    }
                    if(ruleIDs.length > 0){
                        if(valueIsAloneInRule){
                            allRanges = allRanges.concat(aloneStringValues.concat(ruleEnds));
                        } else{
                            ruleIDsForCompare[StringValue] = ruleIDs;
                        }
                    }
                }
            }
            var stringValues = Object.keys(ruleIDsForCompare);
            var stringValuesCount = stringValues.length;
            var visitedRules = Array.apply(null, new Array(stringValuesCount)).map(Number.prototype.valueOf,0);
            if(stringValuesCount > 0){
                for(var firstRuleIndex = 0; firstRuleIndex < stringValuesCount; firstRuleIndex++){
                    if(visitedRules[firstRuleIndex] === 0){
                        visitedRules[firstRuleIndex] = 1;
                        var firstRule = ruleIDsForCompare[stringValues[firstRuleIndex]];
                        var compactValues = stringValues[firstRuleIndex];
                        var ruleIDsSimilarValues = [];
                        for(var secondRuleIndex = firstRuleIndex+1; 
						secondRuleIndex < stringValuesCount; secondRuleIndex++){
                            if(visitedRules[secondRuleIndex] === 0){
                                var canMerge = true;
                                var secondRule = ruleIDsForCompare[stringValues[secondRuleIndex]];
                                if(firstRule.length === secondRule.length){
                                    for(var currentIndex = 0; currentIndex < firstRule.length; currentIndex++){
                                        if(firstRule[currentIndex] !== secondRule[currentIndex]){
                                            canMerge = false;
                                            break;
                                        }
                                    }
                                } else{
                                    canMerge = false;
                                }
                                if(canMerge){
                                    visitedRules[secondRuleIndex] = 1;
                                    compactValues += ', ' + stringValues[secondRuleIndex];
                                    ruleIDsSimilarValues = firstRule;
                                }
                            }
                        }
                        if(ruleIDsSimilarValues.length === 0){
                            ruleIDsAndOverlaps[stringValues[firstRuleIndex]] = firstRule;
                        } else{
                            compactValues = '[' + compactValues + ']';
                            ruleIDsAndOverlaps[compactValues] = ruleIDsSimilarValues;
                        }
                    }
                }
                for(var allStringValues in ruleIDsAndOverlaps){
					ruleEnds = [];
                    var currentObject = ruleIDsAndOverlaps[allStringValues];
                    for(var indexOfRule in currentObject){
                        ruleId = currentObject[indexOfRule];
                        compactRule= {};
                        compactRule[ruleId] = new this.CellAttributesForSort({}, false, true, allStringValues);
                        allRanges.push(compactRule);
                        compactRule = {};
                        compactRule[ruleId] = new this.CellAttributesForSort({}, true, true, allStringValues);
                        ruleEnds.push(compactRule);
                    }
                    allRanges = allRanges.concat(ruleEnds);
                }
            }
        }
    }
    return allRanges;
};

Verifier.prototype.CellAttributesForSort = function(rule, isEndInterval, isString, stringValue){
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


Verifier.prototype.constructMissingRanges = function(rules, inputColumnCount){
    var ruleIDs = Object.keys(rules);
    var firstRule = rules[ruleIDs[0]];
    var secondRule = rules[ruleIDs[1]];
    
    var overlappingIntervals = [];
    
    for(var columnIndex = 0; columnIndex < inputColumnCount; columnIndex++){
        var columnType = firstRule[columnIndex].type;
        var overlappingInterval = '';
        if(columnType === 'string' || columnType === 'boolean'){
            var overlappingStrings = [];
            var firstRuleValues = firstRule[columnIndex].multipleStringValues;
            var secondRuleValues = secondRule[columnIndex].multipleStringValues;
            if(firstRuleValues[0] === '' && secondRuleValues[0] === ''){
                overlappingInterval = '[' + firstRule[columnIndex].allowedValues.join(', ') + ']';
            }else if(firstRuleValues[0] === ''){
                overlappingInterval = '[' + secondRuleValues.join(', ') + ']';
            }else if(secondRuleValues[0] === ''){
                overlappingInterval = '[' + firstRuleValues.join(', ') + ']';
            }else{
                for(var valueIndex in secondRuleValues){
                    var currentStringValue = secondRuleValues[valueIndex];
                    if(firstRuleValues.indexOf(currentStringValue) > -1){
                        overlappingStrings.push(currentStringValue);
                    }
                }
                overlappingInterval = '[' + overlappingStrings.join(', ') + ']';
            }
        }else{
            var firstRuleInterval = firstRule[columnIndex].intervalValues;
            var firstRuleIntervalBrackets = firstRule[columnIndex].equalSigns;
            
            var secondRuleInterval = secondRule[columnIndex].intervalValues;
            var secondRuleIntervalBrackets = secondRule[columnIndex].equalSigns;
            
            if(firstRuleInterval[0] === -Infinity && secondRuleInterval[0] === -Infinity){
                if(firstRuleInterval[1] === Infinity && secondRuleInterval[1] === Infinity){
                    overlappingInterval = '';
                } else{
                    
                    if(firstRuleInterval[1] > secondRuleInterval[1]){
                        if(secondRuleIntervalBrackets[1]){
                            overlappingInterval = '<= ' + secondRuleInterval[1];
                        } else{
                            overlappingInterval = '< ' + secondRuleInterval[1];
                        }
                    } else{
                        if(firstRuleIntervalBrackets[1]){
                            overlappingInterval = '<= ' + firstRuleInterval[1];
                        } else {
                            overlappingInterval = '< ' + firstRuleInterval[1];
                        }
                    }
                }
            } else if(firstRuleInterval[1] === Infinity && secondRuleInterval[1] === Infinity){
                if(firstRuleInterval[0] < secondRuleInterval[0]){
                    if(secondRuleIntervalBrackets[0]){
                        overlappingInterval = '>= ' + secondRuleInterval[0];
                    } else{
                        overlappingInterval = '> ' + secondRuleInterval[0];
                    }
                }else{
                    if(firstRuleIntervalBrackets[0]){
                        overlappingInterval = '>= ' + firstRuleInterval[0];
                    } else {
                        overlappingInterval = '> ' + firstRuleInterval[0];
                    }
                }
                
            } else{
                if(firstRuleInterval[0] < secondRuleInterval[0]){
                    if(secondRuleIntervalBrackets[0]){
                        overlappingInterval = '[' + secondRuleInterval[0];
                    } else{
                        overlappingInterval = '(' + secondRuleInterval[0];
                    }
                } else if(firstRuleInterval[0] === secondRuleInterval[0]){
                    if(firstRuleIntervalBrackets[0] || secondRuleIntervalBrackets[0]){
                        overlappingInterval = '(' + firstRuleInterval[0];
                    } else {
                        overlappingInterval = '[' + firstRuleInterval[0];
                    }
                } else{
                    if(firstRuleIntervalBrackets[0]){
                        overlappingInterval = '[' + firstRuleInterval[0];
                    } else {
                        overlappingInterval = '(' + firstRuleInterval[0];
                    }
                }
                
                if(firstRuleInterval[1] > secondRuleInterval[1]){
                    if(secondRuleIntervalBrackets[1]){
                        overlappingInterval += ', ' + secondRuleInterval[1] + ']';
                    } else{
                        overlappingInterval += ', ' + secondRuleInterval[1] + ')';
                    }
                } else if(firstRuleInterval[1] === secondRuleInterval[1]){
                    if(firstRuleIntervalBrackets[1] || secondRuleIntervalBrackets[1]){
                        overlappingInterval += ', ' + firstRuleInterval[1] + ')';
                    } else {
                        overlappingInterval += ', ' + firstRuleInterval[1] + ']';
                    }
                } else{
                    if(firstRuleIntervalBrackets[1]){
                        overlappingInterval += ', ' + firstRuleInterval[1] + ']';
                    } else {
                        overlappingInterval += ', ' + firstRuleInterval[1] + ')';
                    }
                }
            }
        }
        overlappingIntervals[columnIndex] = overlappingInterval;
    }
    return overlappingIntervals;
};


Verifier.prototype.findOverlappingRules = function(comparingRules, index, inputColumnCount){
    if(inputColumnCount === index){
        var ruleID = Object.keys(comparingRules);
        var isSubset = false;
        var listLen = overlappingRulesList.length;
        for(var listIndex = 0; listIndex < listLen; listIndex++){
            var currentList = overlappingRulesList[listIndex];
            isSubset = true;
            var similarCount = 0;
            for(var ruleIDIndex in ruleID){
                var currentRuleID = ruleID[ruleIDIndex];
                if(currentList[currentRuleID] === undefined){
                    isSubset = false;
                }else{
                    similarCount++;
                }
            }
            if(similarCount === Object.keys(currentList).length){
                overlappingRulesList.splice(listIndex, 1);
                listIndex--;
                listLen = overlappingRulesList.length;
            }
            
            if(isSubset){
                break;
            }
        }
        if(!isSubset){
            var keyMap = {};
            for(var ruleIndex in ruleID){
                keyMap[ruleID[ruleIndex]] = {};
            }
            overlappingRulesList.push(keyMap);
        }
    } else{
        var overlappingRules = {};
        var lastIntervalValue = NaN;
        var lastIntervalEqualSign = false;
        var lastIntervalIsStartInterval = false;
        var sortedRuleOrder = this.sortRules(comparingRules, index);
        for(var i = 0; i < sortedRuleOrder.length; i++){
            var ruleId = Object.keys(sortedRuleOrder[i])[0];
            var rule = sortedRuleOrder[i][ruleId];
            var ruleValue = rule.value;
            var newIntervalValue = true;
            var ruleStart = rule.start;
            var ruleEqual = rule.equal;
            if(Object.keys(overlappingRules).length === 0 || 
            ((lastIntervalValue === ruleValue) && 
            ((!lastIntervalIsStartInterval && ruleStart && lastIntervalEqualSign !== ruleEqual) ||
            (lastIntervalIsStartInterval === ruleStart && lastIntervalEqualSign === ruleEqual)))){
                newIntervalValue = false;                            
            }
            var ruleIds = Object.keys(overlappingRules);
            if(newIntervalValue && ruleIds.length > 1 && !ruleStart){
                var newRules = {};
                for(var rIdIndex in ruleIds){
                    var ruleIDForCopy = ruleIds[rIdIndex];
                    newRules[ruleIDForCopy] = comparingRules[ruleIDForCopy];
                }
                this.findOverlappingRules(newRules, index + 1, inputColumnCount);
            }
            if(ruleStart){
                overlappingRules[ruleId] = rule;
            } else{
                delete overlappingRules[ruleId];
            }
            lastIntervalIsStartInterval = ruleStart;
            lastIntervalValue = ruleValue;
            lastIntervalEqualSign = ruleEqual;
        }
    }
};


Verifier.prototype.constructOverlappingRange = function(lastValue, 
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
                range = 'any';
            } else{
                if((ruleStart && !ruleEqualSign) || (!ruleStart&& ruleEqualSign)){
                    rangeEqualSign = '=';
                }
                rangeInequalitySign = '<';
                range = rangeInequalitySign + rangeEqualSign + ' ' + ruleValue;
            }
        } else if(ruleValue === Infinity){
            if((!lastIntervalIsStartInterval && !equalSign) || (lastIntervalIsStartInterval && equalSign)){
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
                    range = '(' + lastValue +', ';
                }
                if((ruleStart && !ruleEqualSign) || (!ruleStart && ruleEqualSign)){
                    range += ruleValue +']';
                } else{
                    range += ruleValue +')';
                }
            }
        }
    }
    return range;
};

Verifier.prototype.outputOverlappingAndMissingRules = function(overlappingRules, missingRuleCase){
    var childNodes = this._sheet.getContainer().childNodes;
    var errorTable = NaN;
    for(var i = 0; i< childNodes.length; i++){
        if(childNodes[i].getAttribute('id') === 'errorTable'){
            errorTable = this._sheet.getContainer().childNodes[i];
            break;
        }
    }
    var errorTableBody = errorTable.childNodes[1];
    for(i = 0; i < overlappingRules.length; i++) {
        var overlappingRuleValue = [];
        var overlappingRuleRowNRs = [];
        for(var rule in overlappingRules[i]){
            if(rule === 'ruleValue'){
                overlappingRuleValue = overlappingRules[i][rule];
            } else if (rule !== 'ruleValue'){
                overlappingRuleRowNRs.push(overlappingRules[i][rule].ruleNR);
            }
        }
        if(missingRuleCase){
            var missingRule = domify( '<tr><th class="ruleErrorText">' + 
            '<span>No rule exists for (' + overlappingRuleValue + ')</span></th>' + 
            '<th><input type="button" class="missing_rules" data-missing_rules= ' + 
            '\'' + JSON.stringify(overlappingRules[i]).replace(/'/g, '\'') + '\'' +
            'value="Add missing rule"></input>' +  
            '</th></tr>');
            
            missingRule.addEventListener('click', this.addMissingRule(this._modeling));
            errorTableBody.appendChild(missingRule);
        }
        else {
            var rulesWithSameOutputs = [[]];
            overlappingRuleRowNRs = overlappingRuleRowNRs.sort(this.sortNumber);
            rulesWithSameOutputs = this.controlOutputs(overlappingRules[i]);
            var ruleNRs = rulesWithSameOutputs[0];
            var rules = rulesWithSameOutputs[1];
            var currentOverlapRuleIDs = rulesWithSameOutputs[2];
            for(var j = 0; j < ruleNRs.length; j++){
                if(j === 0){
                    if(ruleNRs[j].length === overlappingRuleRowNRs.length - 1){
						overlappingRuleRowNRs.splice(overlappingRuleRowNRs.length - 1, 1);
                        overlappingRules[j].ruleIDs = currentOverlapRuleIDs[j];
                        this.addOverlappingRuleToTable(overlappingRules[i], overlappingRuleRowNRs, 
                            overlappingRuleValue, errorTableBody, ' (outputs are same)');
                        continue;
                        
                    } else{
						overlappingRuleRowNRs.splice(overlappingRuleRowNRs.length - 1, 1);
                        this.addOverlappingRuleToTable(overlappingRules[i], overlappingRuleRowNRs, 
                            overlappingRuleValue, errorTableBody, ' ');
                    }
                } 
                if(typeof rules[j] !== 'undefined'){
                    rules[j].ruleIDs = currentOverlapRuleIDs[j];
                    this.addOverlappingRuleToTable(rules[j], ruleNRs[j], 
                        overlappingRuleValue, errorTableBody, ' (outputs are same)');
                }
            }  
        }
    } 
};

Verifier.prototype.addOverlappingRuleToTable = function(rules, ruleNRs, 
    overlapingRange, errorTableBody, isSameString){
        
    /*
    var overlappingRule = domify('<tr><th class="ruleErrorText">' +
    '<span>Rule (' + overlapingRange  + ') has overlap in rules: ' + 
    ruleNRs + isSameString + '</span></th>' + 
    '<th><input type="button" class="overlapping_rules" data-overlapping_rules= ' + 
    '\'' + JSON.stringify(rules).replace(/'/g, '\'') + '\'' +
    'value="Highlight overlapping rules"></input>' + 
    '</th></tr>');
    */
    var overlappingRule = domify('<tr><th class="ruleErrorText">' +
    '<span>Rules ' + ruleNRs.join(", ") + ' are overlapping' + isSameString + '</span></th>' + 
    '<th><input type="button" class="overlapping_rules" data-overlapping_rules= ' + 
    '\'' + JSON.stringify(rules).replace(/'/g, '\'') + '\'' +
    'value="Highlight overlapping rules"></input>' + 
    '</th></tr>');
    
    overlappingRule.addEventListener('click', 
        this.highlightOverlapingRules(this._elementRegistry, this._sheet));
    errorTableBody.appendChild(overlappingRule);
};

Verifier.prototype.controlOutputs = function(rules){
    var ruleNRWithSameOutput = [];
    var rulesWithSameOutput = [];
    var ruleIDsWithSameOutput = [];
    var allCurrentRuleIDs = rules.ruleIDs;
    var ruleIDs = Object.keys(rules);
    ruleIDs.splice(ruleIDs.indexOf('ruleValue'), 1);
    for(var ruleID = ruleIDs.length - 1; ruleID >= 0; ruleID--){
        var ruleName = ruleIDs[ruleID];
        if(ruleIDs[ruleID] !== 'ruleIDs'){
            var ruleOutput = rules[ruleIDs[ruleID]].outputEntry;
            var sameOutput = [rules[ruleIDs[ruleID]].ruleNR];
            var sameOutputIDs = [allCurrentRuleIDs[ruleID]];
            var ruleObject = {};
            ruleObject[ruleIDs[ruleID]] = rules[ruleIDs[ruleID]];
            for(var ruleID2 = ruleID - 1; ruleID2 >= 0; ruleID2--){
                var ruleName2 = ruleIDs[ruleID2];
                var ruleOutput2 = rules[ruleIDs[ruleID2]].outputEntry;
                var allOutputAreSame = true;
                for(var outputColumn = 0; outputColumn < ruleOutput.length; outputColumn++){
                    if(ruleOutput[outputColumn] !== ruleOutput2[outputColumn]){
                        allOutputAreSame = false;
                        break;
                    }
                }
                if(allOutputAreSame){
                    sameOutput.push(rules[ruleIDs[ruleID2]].ruleNR);
                    sameOutputIDs.push(allCurrentRuleIDs[ruleID2]);
                    ruleObject[ruleIDs[ruleID2]] = rules[ruleIDs[ruleID2]];
                    ruleIDs.splice(ruleIDs.indexOf(ruleName2), 1);
                }
            }
            if(sameOutput.length > 1){
                ruleNRWithSameOutput.push(sameOutput.sort(this.sortNumber));
                ruleIDsWithSameOutput.push(sameOutputIDs);
                rulesWithSameOutput.push(JSON.parse(JSON.stringify(ruleObject)));
                ruleIDs.splice(ruleIDs.indexOf(ruleName), 1);
                ruleID = ruleIDs.length;
            }
        }
    }
    if(ruleNRWithSameOutput.length === 0){
        ruleNRWithSameOutput = [[]];
    }
    return [ruleNRWithSameOutput, rulesWithSameOutput, ruleIDsWithSameOutput];
};

Verifier.prototype.highlightOverlapingRules = function(elementRegistry, sheet){
    return function (){
        var button = this.childNodes[1].childNodes[0];
        var buttonValue = button.value;
        
        var elements = elementRegistry._elements;
        var lastRule = sheet._lastRow.body;
        while(lastRule !== null){
            domClasses(elements[lastRule.id].gfx).remove('overlapping-rules-focused');
            lastRule = lastRule.previous;
        }
        
        if(buttonValue === 'Highlight overlapping rules'){
            
            var childNodes = sheet.getContainer().childNodes;
            var errorTable = NaN;
            for(var i = 0; i < childNodes.length; i++){
                if(childNodes[i].getAttribute('id') === 'errorTable'){
                    errorTable = sheet.getContainer().childNodes[i];
                    break;
                }
            }
            
            var errorTableBody = errorTable.childNodes[1];
            var buttonRows = errorTableBody.rows;
            for(var j = 0; j < buttonRows.length; j++){
                var buttonElement = buttonRows[j].cells[1].children[0];
                if(domClasses(buttonElement).contains('overlapping_rules')){
                    buttonElement.value = 'Highlight overlapping rules';
                }
            }
            
            button.value = 'Unhighlight overlapping rules';
            var rules = JSON.parse(this.childNodes[1].childNodes[0].getAttribute('data-overlapping_rules'));
            var ruleIDs = rules.ruleIDs;
            for(var ruleId in ruleIDs){
                var currentRuleID = ruleIDs[ruleId];
                domClasses(elements[currentRuleID].gfx).add('overlapping-rules-focused');
            }
        } else {
            button.value = 'Highlight overlapping rules';
        }
    };
};


Verifier.prototype.findMissingRules = function(comparingRules, currentRule, index, inputColumnCount){
    if(inputColumnCount > index){
        var ruleType = comparingRules[Object.keys(comparingRules)[0]][index].type;
        var overalappingRules = {};
        var lastIntervalValue = NaN;
        var lastIntervalEqualSign = false;
        var lastIntervalIsStartInterval = false;
        var sortedRuleOrder = this.sortRules(comparingRules, index);
        var allowedValues = [];
        if(ruleType === 'string' || ruleType === 'boolean'){
            allowedValues = comparingRules[Object.keys(comparingRules)[0]][index].allowedValues.slice(0);
            if(allowedValues[0] === ''){
                allowedValues.splice(0, 1);
            }
        }
        
        for(var i = 0; i < sortedRuleOrder.length; i++){
            var ruleId = Object.keys(sortedRuleOrder[i])[0];
            var rule = sortedRuleOrder[i][ruleId];
            var ruleValue = rule.value;
            var newIntervalValue = true;
            
            if(ruleType === 'string' || ruleType === 'boolean'){
                if(ruleValue !== lastIntervalValue){
                    var stringValues = ruleValue.replace(/[[\]\s+]/g, '').split(',');
                    for(var listIndex in stringValues){
                        var currentValueIndex = allowedValues.indexOf(stringValues[listIndex]);
                        if(currentValueIndex > -1){
                            allowedValues.splice(currentValueIndex, 1);
                        }
                    }
                }
            } else{
                var isMissing = false;
                var missingRange = '';
                if(i === 0 && ruleValue !== -Infinity){
                    missingRange = this.constructOverlappingRange(-Infinity, false,
                        rule, ruleType, lastIntervalIsStartInterval);
                    isMissing = true;
                } else if(i === sortedRuleOrder.length - 1 && ruleValue !== Infinity){
                    var newRule = JSON.parse(JSON.stringify(rule));
                    newRule.value = Infinity;
                    missingRange = this.constructOverlappingRange(ruleValue, rule.equal,
                        newRule, ruleType, false);
                    isMissing = true;
                } else{
                    if(i !== 0 && Object.keys(overalappingRules).length === 0 && 
                    (lastIntervalValue !== ruleValue || (lastIntervalValue === ruleValue && 
                    !lastIntervalEqualSign && !rule.equal))){
                        
                        if((ruleType === 'integer' || ruleType === 'long') && 
                        (parseInt(rule.value) === parseInt(lastIntervalValue) + 1 && 
                        rule.equal !== lastIntervalEqualSign)){
                            if(rule.equal){
                                missingRange = lastIntervalValue;
                            } else{
                                missingRange = rule.value;
                            }
                            isMissing = true;
                        } else if((ruleType === 'integer' || ruleType === 'long') && 
                        rule.equal && lastIntervalEqualSign){
                            isMissing = false;
                        } else {
                            missingRange = this.constructOverlappingRange(lastIntervalValue, lastIntervalEqualSign,
                                rule, ruleType, lastIntervalIsStartInterval);
                            isMissing = true;
                        }
                    }
                }
                if(isMissing){
                    var missingRule = currentRule.slice(0);
                    missingRule[index] = missingRange;
                    missingRuleList = this.mergeRules(missingRuleList, missingRule, inputColumnCount);
                }
            }
            if(Object.keys(overalappingRules).length === 0 || 
            ((lastIntervalValue === ruleValue) && 
            ((!lastIntervalIsStartInterval && rule.start && lastIntervalEqualSign !== rule.equal) ||
            (lastIntervalIsStartInterval === rule.start && lastIntervalEqualSign === rule.equal)))){
                newIntervalValue = false;                            
            }
            if(newIntervalValue){
                
                var ruleRange = this.constructOverlappingRange(lastIntervalValue, lastIntervalEqualSign,
                    rule, ruleType, lastIntervalIsStartInterval);
                    
                currentRule[index] = ruleRange;
                var newRules = {};
                var ruleIds = Object.keys(overalappingRules);
                for(var rId in ruleIds){
                    newRules[ruleIds[rId]] = comparingRules[ruleIds[rId]].slice(0);
                }
                this.findMissingRules(newRules, currentRule.slice(0), index + 1, inputColumnCount);
            }
            if(rule.start){
                overalappingRules[ruleId] = rule;
            } else{
                delete overalappingRules[ruleId];
            }
            lastIntervalIsStartInterval = rule.start;
            lastIntervalValue = ruleValue;
            lastIntervalEqualSign = rule.equal;
        } 
        if((ruleType === 'string' || ruleType === 'boolean') && allowedValues.length > 0){
            var missingStrings = '[' + allowedValues.join(', ') + ']';
            var missingInterval = currentRule.slice(0);
            missingInterval[index] = missingStrings;
            missingRuleListStrings.push(missingInterval);
        }
    }
};


Verifier.prototype.addMissingRule = function(modeling){
    return function (){
        var rules = JSON.parse(this.childNodes[1].childNodes[0].getAttribute('data-missing_rules'));
        var newRowId = ids.next();
        modeling.createRow({ id: newRowId });
        var ruleValues = rules.ruleValue;
        for(var i = 0; i < ruleValues.length; i++){
            if(ruleValues[i] !== 'any'){
                modeling.editCell(newRowId, inputClauseIDs[i], (ruleValues[i].toString()).replace(/[(\[\)\]\+]/g, ''));
            }
        }
        this.parentNode.deleteRow(this.rowIndex - 1);
    };
};


Verifier.prototype.getInputIds = function(){
    var lastColumn = this._sheet._lastColumn.previous;
    var columnIds = [];
    
    while(lastColumn !== null){
        if(lastColumn.type === 'dmn:InputClause'){
            columnIds.push(lastColumn.id);
        }
        lastColumn = lastColumn.previous;
    }
    columnIds = columnIds.reverse();
    return columnIds;
};

Verifier.prototype.getInputTypes = function(columnIds){
    var inputColumnTypes = [];
    for(var i = 0; i < columnIds.length; i++){
        var type = this._elementRegistry.get(columnIds[i]).businessObject.inputExpression.typeRef;
        inputColumnTypes.push(type);
    }
    return inputColumnTypes;
};

Verifier.prototype.makeCellsWithNewAttributes = function(ruleOrder){
    var cellValues = {};
    var hasError = false;
    var inputTypes = this.getInputTypes(ruleOrder);
    var lastRule = this._sheet._lastRow.body;
    var ruleCount = lastRule.businessObject.$parent.rule.length;
    var cellId = '';
    while(lastRule !== null){
        var rule = lastRule.businessObject;
        var ruleInputEntry = rule.inputEntry;
        for(var i = 0; i < ruleInputEntry.length; i++){
            var valueType = inputTypes[i];
            var allowedValues = [];
            var cell = ruleInputEntry[i];
            cellId = 'cell_' + ruleOrder[i] + '_' + rule.id;
            var cellValue = cell.text;
            
            var hasSyntaxError = this.checkSyntaxErrors(cellId, cellValue, valueType);
            if(!hasError && hasSyntaxError){
                hasError = hasSyntaxError;
            }

            if(valueType === 'boolean'){
                if(cellValue === '1'){ cellValue = 'true';}
                else if(cellValue === '0'){ cellValue = 'false';}
                allowedValues = ['true', 'false'];
            } else if(['integer','long','double','number'].indexOf(valueType) > -1){
                allowedValues = ['any'];
            }
            cellValues[cellId] = new this.CellAttributes(cellId , valueType,
                allowedValues, cellValue, ruleOrder[i], rule.id, ruleCount);
        }
        var outputEntry = [];
        var ruleOutputEntry = rule.outputEntry;
        for(var j = 0; j < ruleOutputEntry.length; j++){
            outputEntry.push(ruleOutputEntry[j].text);
        }
        cellValues[cellId].outputEntry = outputEntry;
        
        ruleCount--;
        lastRule = lastRule.previous;
    }
    return [cellValues, hasError];
};

Verifier.prototype.CellAttributes = function(id, type, allowedValue, value, clauseId, ruleId, ruleNR){
    this.type = type;
    this.allowedValues = allowedValue;
    this.value = value;
    this.clauseId = clauseId;
    this.ruleId = ruleId;
    this.id = id;
    this.ruleNR = ruleNR;
    if(type !== 'string' && type !== 'boolean'){
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
    } else if(type === 'string' || type === 'boolean'){
        this.multipleStringValues = value.replace(/[\s+]/g, '').split(',').sort();
    }
};

Verifier.prototype.getRulesAndInputs = function(allCellValues, rulesRightOrder){
    var rules = {};
    var inputs = {};
    var allowedValues = [];
    var ruleSize = rulesRightOrder.length;
    for(var inputValue in allCellValues){
        var cell = allCellValues[inputValue];
        var clauseId = cell.clauseId;
        var cellIDs = NaN;
        if(!(clauseId in inputs) && (typeof inputs.clauseId === 'undefined')){
            cellIDs = [cell];
            if(cell.type === 'string'){
                allowedValues = cell.multipleStringValues.slice(0);
            }
        } else {
            cellIDs = inputs[clauseId];
            cellIDs.push(cell);
            if(cell.type === 'string'){
                allowedValues = inputs[clauseId].allowedValues;
                for(var stringValueIndex in cell.multipleStringValues){
                    if(allowedValues.indexOf(cell.multipleStringValues[stringValueIndex]) === -1){
                        allowedValues.push(cell.multipleStringValues[stringValueIndex].slice(0));
                    }
                }    
            }
        }
        inputs[cell.clauseId] = cellIDs;
        if(cell.type === 'string'){
            inputs[cell.clauseId].allowedValues = allowedValues;
        }
        
        var ruleId = cell.ruleId;
        var rightPositionIndex = rulesRightOrder.indexOf(clauseId);
        if(!(ruleId in rules) && (typeof rules.ruleId === 'undefined')){
            cellIDs = Array.apply(null, new Array(ruleSize)).map(Number.prototype.valueOf, 0);
            // var ruleNumber = this.elementRegistry.get('cell_utilityColumn_' + ruleId).content;
            cellIDs[rightPositionIndex] = cell;
            rules[cell.ruleId] = cellIDs;
            rules[cell.ruleId].ruleNR = cell.ruleNR;
        } else {
            cellIDs = rules[ruleId];
            cellIDs[rightPositionIndex] = cell;
            rules[cell.ruleId] = cellIDs;
        }
        if(typeof cell.outputEntry !== undefined){
            rules[cell.ruleId].outputEntry = cell.outputEntry;
        }
    }
    for(var input in inputs){
        if(inputs[input][0].type === 'string'){
            allowedValues = inputs[input].allowedValues.sort();
            for(var j in inputs[input]){
                if(j !== allowedValues){
                    inputs[input][j].allowedValues = inputs[input].allowedValues;    
                }
            }
        }
    }
    for(var r in rules){
        for(var i = 0; i < rules[r].length; i++) {
            rules[r][i].ruleNR = rules[r].ruleNR;
        }
    }
    return [inputs, rules];
};


Verifier.prototype.checkSyntaxErrors = function(cellId, cellValue, valueType){
    var hasSyntaxError = false;
    var cellTrimmedValue = cellValue;
    if('string' !== valueType){
        cellTrimmedValue = cellValue.replace(/[(\[\)\]\s+]/g, '').replace(/[<>=\s+]/g, '');
    }
    if(cellTrimmedValue !== ''){
        if((!this.isString(cellTrimmedValue) && 'string' === valueType) ||
        ((['integer','long','double','number'].indexOf(valueType) > -1) && 
        (!(this.isNumeric(cellTrimmedValue)) || 
        ('integer' === valueType && !(this.isInteger(cellTrimmedValue))))) || 
        ('boolean' === valueType && !(this.isBoolean(cellTrimmedValue)))){
            this.addTooltip(cellId, valueType, cellTrimmedValue);
                
            hasSyntaxError = true;
        }
    }
    return hasSyntaxError;
};


Verifier.prototype.makeTooltipText = function(valueType, inputEntry){
    var outputText = '';
    if(valueType === 'string'){
        outputText = 'Cell value has to be string';
    } else if(['integer','long','double','number'].indexOf(valueType) > -1){
        if(valueType === 'integer' && this.isNumeric(inputEntry)){
            outputText = 'Cell value is a float number, but has to be an integer';
        } else {
            outputText = 'Cell value is a string, but has to be a number';
        }
        
    } else if(valueType === 'boolean'){
        outputText = 'Cell value has to be one of these values: true, false, 1 or 2';
    }
    return outputText;
};

Verifier.prototype.tooltip = function(cellId, tooltipText){
    var container = this._sheet.getContainer();
    cellId.onmousemove = function(event){
        var tooltipX = event.pageX - 25;
        var tooltipY = event.pageY - 100;
        var tooltipCell = NaN;
        var childNodes = container.childNodes;
        for(var i = 0; i< childNodes.length; i++){
            if(childNodes[i].getAttribute('class') === 'tooltip'){
                tooltipCell = container.childNodes[i];
                break;
            }
        }
        
        tooltipCell.style.top = tooltipY + 'px';
        tooltipCell.style.left = tooltipX + 'px';
    };
    
    cellId.onmouseout = function(){
        var childNodes = container.childNodes;
        for(var i = 0; i< childNodes.length; i++){
            if(childNodes[i].getAttribute('class') === 'tooltip'){
                domRemove(container.childNodes[i]);
                break;
            }
        }
    };

    cellId.onmouseover = function(){
        if(domClasses(cellId).contains('wrongValue')){
            var childNodes = container.childNodes;
            for(var i = 0; i< childNodes.length; i++){
                if(childNodes[i].getAttribute('class') === 'tooltip'){
                    domRemove(container.childNodes[i]);
                    break;
                }
            }
            var toolTipDiv = domify('<div class="tooltip">' + tooltipText + '</div>');
            container.appendChild(toolTipDiv);
        }
    };
};

Verifier.prototype.addTooltip = function(cellId, valueType, inputEntry){
    var tooltipText = this.makeTooltipText(valueType, inputEntry);
    var wrongCell = this._elementRegistry._elements[cellId].gfx;
    domClasses(wrongCell).add('wrongValue');
    this.tooltip(wrongCell, tooltipText);
};


Verifier.prototype.isString = function(value){
    var values = value.replace(/[\s+]/g, '').split(',');
    for(var i = 0; i < values.length; i++){
        if(values[i].charAt(0) !== '"' || values[i].charAt(values[i].length-1) !== '"'){
            return false;
        }
    }
    return true;
};

Verifier.prototype.isNumeric = function(value){
    if(value.split(',').length === 2){
        value = value.split(',');
        return !isNaN(parseFloat(value[0])) && isFinite(value[0]) && 
            !isNaN(parseFloat(value[1])) && isFinite(value[1]);
    } else {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }
};

Verifier.prototype.isInteger = function(value){
    if(value.split(',').length  === 2){
        value = value.split(',');
        return value[0] % 1 === 0 && value[1] % 1 === 0;
    } else {
        return value % 1 === 0;
    }
};

Verifier.prototype.isBoolean = function(value){
    if(['1','0','true','false'].indexOf(value.toLowerCase()) > -1){
        return true;
    }
    else{
        return false;
    }
};

Verifier.prototype.sortNumber = function(a,b) {
    return a - b;
};


Verifier.$inject = [ 'elementRegistry', 'modeling', 'sheet'];

module.exports = Verifier;