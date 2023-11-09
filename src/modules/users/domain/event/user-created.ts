import { TriggersOn } from '@gabrielzilmar/event-emitter';
import { UserDomain } from '~/modules/users/domain/users.domain';
import { domainEvent } from '~/shared/domain/events';

const EVENT_NAME = 'user.created';

export type UserCreatedEventPayload = {
  user: UserDomain;
};

// It's an example class of a event listener
export default class UserCreated {
  public static readonly eventName = EVENT_NAME;

  @TriggersOn(EVENT_NAME, domainEvent.eventEmitter)
  public userCreated(payload: UserCreatedEventPayload) {
    return payload;
  }
}
