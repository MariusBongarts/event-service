import { eventService, Unsubscribe } from './event-service';

describe("EventService", function () {
  let onElementCreatedMock: jest.Mock<any, any>;
  let onElementUpdatedMock: jest.Mock<any, any>;

  beforeEach(() => {
    onElementCreatedMock = jest.fn();
    onElementUpdatedMock = jest.fn();
  });

  describe("subscribe to onElementCreated and onElementUpdated event", function () {
    let onElementCreatedSubscription: Unsubscribe;
    let onElementUpdatedSubscription: Unsubscribe;
    const payload = { id: "1" };

    beforeAll(() => {
      onElementCreatedSubscription = eventService.subscribe('onElementCreated', event => onElementCreatedMock(event.payload));
      onElementUpdatedSubscription = eventService.subscribe('onElementUpdated', event => onElementUpdatedMock(event.payload));
    });

    describe("emitting one onElementCreated event", function () {

      beforeEach(() => {
        eventService.emit('onElementCreated', payload);
      });

      it("calls onElementCreatedMock once with payload", () => {
        expect(onElementCreatedMock).toHaveBeenCalledWith(payload);
        expect(onElementCreatedMock).toHaveBeenCalledTimes(1);
      });

      it("does not call onElementUpdatedMock", () => {
        expect(onElementUpdatedMock).not.toHaveBeenCalled();
      });

    });

    describe("unsubscribe onElementCreated event", function () {
      beforeEach(() => {
        onElementCreatedSubscription.unsubscribe();
      });

      describe("emitting one elementCreated event", function () {

        beforeEach(() => {
          eventService.emit('onElementCreated', payload);
        });

        it("does not call onElementCreatedMock", () => {
          expect(onElementCreatedMock).not.toHaveBeenCalled();
        });
      });
    });

  });
});