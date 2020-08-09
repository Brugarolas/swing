import Sister from 'sister';
import rebound from 'rebound';
import Card from './Card';

/**
 * @param {object} config Stack configuration.
 * @returns {object} An instance of Stack object.
 */
const Stack = (config) => {
  let eventEmitter;
  let index;
  let springSystem;
  let stack;

  const construct = () => {
    stack = {};
    springSystem = new rebound.SpringSystem();
    eventEmitter = Sister();
    index = [];
  };

  construct();

  /**
   * Get the configuration object.
   *
   * @returns {object}
   */
  stack.getConfig = () => {
    return config;
  };

  /**
   * Get a singleton instance of the SpringSystem physics engine.
   *
   * @returns {Sister}
   */
  stack.getSpringSystem = () => {
    return springSystem;
  };

  /**
   * Proxy to the instance of the event emitter.
   *
   * @param {string} eventName
   * @param {string} listener
   * @returns {undefined}
   */
  stack.on = (eventName, listener) => {
    eventEmitter.on(eventName, listener);
  };

  /**
   * Creates an instance of Card and associates it with an element.
   *
   * @param {HTMLElement} element
   * @param {boolean} prepend
   * @returns {Card}
   */
  stack.createCard = (element, prepend) => {
    const card = Card(stack, element, prepend);
    const events = [
      'throwout',
      'throwoutend',
      'throwoutleft',
      'throwoutright',
      'throwoutup',
      'throwoutdown',
      'throwin',
      'throwinend',
      'dragstart',
      'dragmove',
      'dragend'
    ];

    // Proxy Card events to the Stack.
    events.forEach((eventName) => {
      card.on(eventName, (data) => {
        eventEmitter.trigger(eventName, data);
      });
    });

    index.push({
      card,
      element
    });

    return card;
  };

  /**
   * Returns an instance of Card associated with an element.
   *
   * @param {HTMLElement} element
   * @returns {Card|null}
   */
  stack.getCard = (element) => {
    const group = index.find((cardGroup) => {
      return cardGroup === element || cardGroup.element === element;
    });

    if (group) {
      return group.card;
    }

    return null;
  };

  /**
   * Returns all Cards instances in the stack.
   *
   * @returns {Array}
   */
  stack.getCards = () => {
    return [...index];
  };

  /**
   * Remove an instance of Card from the stack index.
   *
   * @param {Card|HtmlElement} card
   * @returns {boolean} Wether card has been destroyed or not
   */
  stack.destroyCard = (card) => {
    const idx = index.findIndex((cardGroup) => {
      return cardGroup === card || cardGroup.card === card;
    });

    const exists = idx !== -1;

    if (exists) {
      index.splice(idx, 1);

      eventEmitter.trigger('destroyCard', card);
    }

    return exists;
  };

  /**
  * Remove all instances of Card from the stack index and clean its listeners.
  *
  * @returns {number} Number of removed Cards
  */
  stack.destroyAll = () => {
    const cardsNumber = index.length;

    index.forEach((element) => {
      element.card.unbindListeners();

      eventEmitter.trigger('destroyCard', element.card);
    });

    index.length = 0;

    return cardsNumber;
  };

  return stack;
};

export default Stack;
