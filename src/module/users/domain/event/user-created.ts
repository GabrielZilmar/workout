import { TriggersOn } from '@gabrielzilmar/event-emitter';
import { UserDomain } from '~/module/users/domain/users.domain';
import { domainEvent } from '~/shared/domain/events';

const EVENT_NAME = 'user.created';

export type UserCreatedEventPayload = {
  user: UserDomain;
};

export default class UserCreated {
  public static readonly eventName = EVENT_NAME;

  @TriggersOn(EVENT_NAME, domainEvent.eventEmitter)
  public userCreated(payload: UserCreatedEventPayload) {
    console.info('User created!', payload);
  }
}
