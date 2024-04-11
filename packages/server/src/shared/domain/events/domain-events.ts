import { EventEmitter } from '@gabrielzilmar/event-emitter';

export default class DomainEvents {
  public eventEmitter: EventEmitter;

  constructor() {
    this.initialize();
  }

  private getUserEvents() {
    const events = ['user.created', 'user.update', 'user.deleted', 'user.get'];

    return events;
  }

  private getSessionEvents() {
    const events = ['session.created'];

    return events;
  }

  private initialize() {
    const userEvents = this.getUserEvents();
    const sessionEvents = this.getSessionEvents();
    const allEvents = userEvents.concat(sessionEvents);

    this.eventEmitter = new EventEmitter(allEvents);
    Object.freeze(this);
  }
}
