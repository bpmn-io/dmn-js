import { expect } from 'chai';

import {
  getTypeRefOptions,
  groupDataTypes
} from 'src/features/data-types/DataTypesUtil';

const CUSTOM = { id: 'custom', name: 'Custom' };
const BUILT_IN = { id: 'built-in', name: 'Built-ins' };


describe('DataTypesUtil', function() {

  describe('#groupDataTypes', function() {

    it('should put ungrouped types first, then groups by appearance', function() {

      // given
      const dataTypes = [
        { name: 'a', label: 'a', group: CUSTOM },
        { name: 'b', label: 'b', group: BUILT_IN },
        { name: 'c', label: 'c' },
        { name: 'd', label: 'd', group: CUSTOM }
      ];

      // when
      const groups = groupDataTypes(dataTypes);

      // then
      expect(groups.map(g => g.id)).to.eql([ 'default', 'custom', 'built-in' ]);
      expect(groups[1].types.map(t => t.name)).to.eql([ 'a', 'd' ]);
    });


    it('should keep group names if multiple groups', function() {

      // given
      const dataTypes = [
        { name: 'a', label: 'a', group: { id: 'foo' } },
        { name: 'b', label: 'b', group: CUSTOM }
      ];

      // when
      const groups = groupDataTypes(dataTypes);

      // then
      expect(groups).to.have.length(2);
      expect(groups[0]).to.include({ id: 'foo', name: undefined });
      expect(groups[1]).to.include({ id: 'custom', name: 'Custom' });
    });


    it('should not name group if only one', function() {

      // given
      const dataTypes = [
        { name: 'a', label: 'a', group: BUILT_IN },
        { name: 'b', label: 'b', group: BUILT_IN }
      ];

      // when
      const groups = groupDataTypes(dataTypes);

      // then
      expect(groups).to.have.length(1);
      expect(groups[0].name).not.to.exist;
    });


    it('should not name group if only one, ungrouped', function() {

      // when
      const groups = groupDataTypes([ { name: 'a', label: 'a' } ]);

      // then
      expect(groups).to.have.length(1);
      expect(groups[0].name).not.to.exist;
    });

  });


  describe('#getTypeRefOptions', function() {

    it('should return options without group if only one group', function() {

      // when
      const options = getTypeRefOptions([
        { name: 'a', label: 'A', group: BUILT_IN },
        { name: 'b', label: 'B', group: BUILT_IN }
      ]);

      // then
      expect(options).to.eql([
        { label: 'A', value: 'a', group: undefined },
        { label: 'B', value: 'b', group: undefined }
      ]);
    });


    it('should return options with group, ordered by group', function() {

      // when
      const options = getTypeRefOptions([
        { name: 'a', label: 'A', group: CUSTOM },
        { name: 'b', label: 'B', group: BUILT_IN },
        { name: 'c', label: 'C', group: CUSTOM }
      ]);

      // then
      expect(options).to.eql([
        { label: 'A', value: 'a', group: 'Custom' },
        { label: 'C', value: 'c', group: 'Custom' },
        { label: 'B', value: 'b', group: 'Built-ins' }
      ]);
    });

  });

});
