type EventSubject = 'Element' | 'Property';
type EventAction = 'Created' | 'Updated' | 'Deleted';
export type EventTypes = `on${EventSubject}${EventAction}`;

export interface Event<T extends EventTypes> {
  type: T;
  payload: Payload<T>;
}

type EventCallback<T extends EventTypes> = (payload: Event<T>) => void;

export type Unsubscribe = { unsubscribe: () => void; }

type Payload<T extends EventTypes> =
T extends `onElement${string}` ? { id: string } :
T extends `onProperty${string}` ? { key: string } :
any;

class EventService {
  private listeners: Partial<Record<EventTypes, Array<EventCallback<EventTypes>>>> = {};

  protected static _instance: EventService | undefined;

  private constructor() { };

  public static create() {
    if (!this._instance) this._instance = new EventService();
    return this._instance;
  }

  /**
   * Subscribes to a specific event type.
   *
   * @param {EventTypes} eventType
   * @param {EventCallback} listener
   * @returns {Unsubscribe} - return value which can be called to unsubscribe from event
   * @memberof EventService
   */
  public subscribe<T extends EventTypes>(eventType: T, listener: EventCallback<T>): Unsubscribe {
    // @ts-ignore
    this.listeners[eventType] = [...this.listeners[eventType] || [], listener];
    return {
      unsubscribe: () => { // unsubscribe function
        this.listeners[eventType] = this.listeners[eventType]?.filter(other => other !== listener);
      }
    };
  }

  /**
   * Emits an event which will be notified to all events with the specific type
   *
   * @param {EventTypes} eventType - event type to emit
   * @param {*} payload
   * @memberof EventService
   */
  public emit<T extends EventTypes>(type: T, payload: Payload<T>) {
    this.listeners[type]?.forEach(listener => listener({ type, payload }));
  }

}

export const eventService = EventService.create();
