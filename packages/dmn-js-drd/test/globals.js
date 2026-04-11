import { use as chaiUse } from 'chai';
import sinonChai from 'sinon-chai';
import BoundsMatchers from 'diagram-js/test/matchers/BoundsMatchers';
import ConnectionMatchers from 'diagram-js/test/matchers/ConnectionMatchers';

chaiUse(sinonChai);
chaiUse(BoundsMatchers);
chaiUse(ConnectionMatchers);
