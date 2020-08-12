import test from 'ava';
import sinon from 'sinon';
import Swing from '../../src';

/* Aux const and functions */
const { Direction, Stack } = Swing;

const setupEnvironment = (config = {}) => {
  const parentElement = global.document.createElement('div');
  const cardElement = global.document.createElement('div');

  config.targetElementWidth = 100;
  config.targetElementHeight = 100;

  const stack = Stack(config);

  parentElement.append(cardElement);

  const card = stack.createCard(cardElement);

  return {
    card,
    cardElement,
    stack
  };
};

const delayedAction = (action = () => {}, timeout = 25) => {
  let resolvePromise;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  setTimeout(() => {
    action();
    resolvePromise();
  }, timeout);

  return promise;
};

/* Tests */
test('getCard() returns card associated with an element', (t) => {
  const stack = Stack();

  const parentElement = global.document.createElement('div');
  const element = global.document.createElement('div');

  parentElement.append(element);

  const card = stack.createCard(element);

  t.is(stack.getCard(element), card);
});

test('getCard() returns null when element is not associated with a card', (t) => {
  const stack = Stack();

  const element = global.document.createElement('div');

  t.is(stack.getCard(element), null);
});

test('destroyCard() is called when Card is destroyed', (t) => {
  const stack = Stack();

  const parentElement = global.document.createElement('div');
  const element = global.document.createElement('div');
  const spy = sinon.spy(stack, 'destroyCard');

  parentElement.append(element);

  const card = stack.createCard(element);

  card.destroy();

  t.is(spy.calledWith(card), true);
});

test('getConfig() returns the config object', (t) => {
  const configInput = {};

  const stack = Stack(configInput);

  t.deepEqual(stack.getConfig(), configInput);
});

test('isThrowOut is invoked in the event of dragend', (t) => {
  const spy = sinon.spy();

  const environment = setupEnvironment({ isThrowOut: spy });

  t.false(spy.called);

  environment.card.trigger('mousedown');

  t.false(spy.called);

  environment.card.trigger('panmove', {
    deltaX: 10,
    deltaY: 10
  });

  t.false(spy.called);

  environment.card.trigger('panend', {
    deltaX: 10,
    deltaY: 10
  });

  t.true(spy.called);
});

[true, false].forEach((throwOut) => {
  test(`determines throwOut event (${throwOut})`, (t) => {
    const environment = setupEnvironment({
      allowedDirections: [
        Direction.UP,
        Direction.DOWN,
        Direction.LEFT,
        Direction.RIGHT
      ],
      isThrowOut: () => {
        return throwOut;
      }
    });

    const spy1 = sinon.spy();
    const spy2 = sinon.spy();

    environment.card.on('throwout', spy1);
    environment.card.on('throwin', spy2);

    environment.card.trigger('mousedown');
    environment.card.trigger('panmove', {
      deltaX: 10,
      deltaY: 10
    });
    environment.card.trigger('panend', {
      deltaX: 10,
      deltaY: 10
    });

    if (throwOut) {
      t.true(spy1.called);
      t.false(spy2.called);
    } else {
      t.false(spy1.called);
      t.true(spy2.called);
    }
  });
});

test('throwOutConfidence is invoked in the event of dragmove', async (t) => {
  const spy = sinon.spy();
  const environment = setupEnvironment({ throwOutConfidence: spy });

  environment.card.trigger('panstart');

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 10,
      deltaY: 10
    });
  });

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 11,
      deltaY: 10
    });
  });

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 12,
      deltaY: 10
    });
  });

  await delayedAction();

  t.is(spy.callCount, 3);
});

test('rotation is invoked in the event of dragmove', async (t) => {
  const spy = sinon.spy();
  const environment = setupEnvironment({ rotation: spy });

  environment.card.trigger('panstart');

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 10,
      deltaY: 10
    });
  });

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 11,
      deltaY: 10
    });
  });

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 12,
      deltaY: 10
    });
  });

  await delayedAction();

  t.is(spy.callCount, 3);
});

test('transform is invoked in the event of dragmove', async (t) => {
  const spy = sinon.spy();

  const environment = setupEnvironment({ transform: spy });

  environment.card.trigger('panstart');

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 10,
      deltaY: 10
    });
  });

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 11,
      deltaY: 10
    });
  });

  await delayedAction(() => {
    environment.card.trigger('panmove', {
      deltaX: 12,
      deltaY: 10
    });
  });

  await delayedAction();

  t.is(spy.callCount, 3);
});
