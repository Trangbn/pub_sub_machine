import { IEvent, IPublishSubscribeService, ISubscriber } from "./event.interface";

export class PublishSubscribeService implements IPublishSubscribeService {
  private subscribers: ISubscriber[] = [];
  private publishedEvents: IEvent[] = [];

  subscribe(subscriber: ISubscriber): void {
    this.subscribers.push(subscriber);
    this.publishedEvents.forEach((event) => {
      if (subscriber.isSubscribedToEvent(event.eventType)) {
        subscriber.handleEvent(event);
      }
    });
  }

  unsubscribe(subscriber: ISubscriber): void {
    const index = this.subscribers.indexOf(subscriber);
    if (index !== -1) {
      this.subscribers.splice(index, 1);
    }
  }

  publish(event: IEvent): void {
    this.publishedEvents.push(event);
    this.subscribers.forEach((subscriber) => {
      if (subscriber.isSubscribedToEvent(event.eventType)) {
        subscriber.handleEvent(event);
      }
    });
  }
}