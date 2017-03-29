import { expect } from 'chai';
import {CoinCap, EventTypes as coincapEventTypes} from '../src/CoinCap';

describe('Coincap', () => {
  let coincap;
  beforeEach(() => {
    coincap = new CoinCap();
  });

  it('should have a null socket', () => {
    expect(coincap.socket).to.be.null;
  });

  describe('init', () => {
    beforeEach(() => {
      coincap.init();
    });

    it('should have a socket not null', () => {
      expect(coincap.socket).to.not.be.null;
    });
  });

  describe('event listeners', () => {
    let spyListener = () => {};

    before(() => {
      coincap.init();
    });

    it('should create an global listeners array', () => {
      expect(coincap.eventListeners[coincapEventTypes.Global]).to.be.an('array');
    });

    it('should create an trade listeners array', () => {
      expect(coincap.eventListeners[coincapEventTypes.Trade]).to.be.an('array');
    });

    describe('addEventListener', () => {
      it('should thrown if listener is not a function', () => {
        expect(() => {
          coincap.addEventListener('t', null);
        }).to.throw();
      });

      it('should add an event listener to the global listeners array', () => {
        coincap.addGlobalListener(spyListener);
        expect(coincap.eventListeners[coincapEventTypes.Global]).to.include(spyListener);
      });
    });

    describe('addCoinListener', () => {
      it('should thrown if listener is not a function', () => {
        expect(() => {
          coincap.addCoinListener(null);
        }).to.throw();
      });

      it('should add an event listener to the BTC listener array', () => {
        coincap.addCoinListener(spyListener);
        expect(coincap.coinListeners['BTC']).to.include(spyListener);
      });

      it('should add an event listener to the DASH listener array', () => {
        coincap.addCoinListener(spyListener, 'DASH');
        expect(coincap.coinListeners['DASH']).to.include(spyListener);
      });
    });

  });

});
