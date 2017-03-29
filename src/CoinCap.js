import { connect } from 'socket.io-client';
import { isFunction, isEmpty, each, isUndefined, pull } from 'lodash';

const { info } = console;

const EventTypes = {
  Global: Symbol('coincap-global'),
  Trade: Symbol('coincap-trade'),
};

const SocketEvents = {
  [EventTypes.Global]: 'global',
  [EventTypes.Trade]: 'trades',
};

class CoinCap {
  constructor() {
    info('Creating CoinCap.');
    this.socket = null;
    this.eventListeners = {};
    this.coinListeners = {};
    this.addGlobalListener = this.addEventListener.bind(this, EventTypes.Global);
    this.addTradeListener = this.addEventListener.bind(this, EventTypes.Trade);
    each(EventTypes, this.initListeners.bind(this));
  }

  init() {
    info('Initializing CoinCap.');
    this.socket = connect('http://socket.coincap.io');
    each(EventTypes, this.bindEvent.bind(this));
    this.addTradeListener(this.checkCoin.bind(this));
  }

  initListeners(type) {
    this.eventListeners[type] = [];
  }

  bindEvent(type) {
    const eventType = SocketEvents[type];
    const listeners = this.eventListeners[type];
    this.socket.on(eventType, (msg) => {
      if (!isEmpty(listeners)) {
        each(listeners, fn => fn(msg));
      }
    });
  }

  checkCoin(response) {
    const { coin, msg } = response.message;
    const listeners = this.coinListeners[coin];
    if (!isEmpty(this.coinListeners[coin])) {
      each(listeners, fn => fn(msg, coin));
    }
  }

  addEventListener(type, listener) {
    if (!isFunction(listener)) {
      throw new TypeError('Listener should be a function');
    }
    this.eventListeners[type].push(listener);
    return listener;
  }

  addCoinListener(listener, type = 'BTC') {
    if (!isFunction(listener)) {
      throw new TypeError('Listener should be a function');
    }
    if (isUndefined(this.coinListeners[type])) {
      this.coinListeners[type] = [];
    }
    this.coinListeners[type].push(listener);
    return listener;
  }

  removeCoinListener(listener, type = 'BTC') {
    if (isUndefined(this.coinListeners[type])) {
      return;
    }
    pull(this.coinListeners[type], listener);
  }
}

let singleton;

function getCoinCapSingleton() {
  if (!(singleton instanceof CoinCap)) {
    singleton = new CoinCap();
    singleton.init();
  }
  return singleton;
}

export default getCoinCapSingleton();

export {
  CoinCap,
  EventTypes,
  SocketEvents,
};
