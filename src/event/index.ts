import { sharedArrayMachine } from "../app";
import { EventType, ISubscriber, Machine } from "./event.interface";
import Redis from "ioredis";

export class PublishSubscribeService {
  private publishClient: Redis;
  private subscribeClient: Redis;

  private subscribers: Map<EventType, ISubscriber[]> = new Map();

  constructor() {
    // Create a Redis client for publishing
    this.publishClient = new Redis();

    // Create a Redis client for subscribing
    this.subscribeClient = new Redis();

    // Handle Redis connection errors for both clients
    this.publishClient.on("error", (err) => {
      console.error("Redis publish client connection error:", err);
    });

    this.subscribeClient.on("error", (err) => {
      console.error("Redis subscribe client connection error:", err);
    });

    // Subscribe to the event channel
    this.subscribeClient.subscribe("event_channel", (err) => {
      if (err) {
        console.error("Failed to subscribe to event channel:", err);
      } else {
        console.log("Subscribed to event channel");
      }
    });

    // Handle incoming events
    this.subscribeClient.on("message", (channel, message) => {
      if (channel === "event_channel") {
        const { eventType, data } = JSON.parse(message);
        switch (eventType) {
          case EventType.SALE_EVENT:
            {
              for (const item of sharedArrayMachine) {
                if (item.id === data.machine.id) {
                  item.quantity -= data.machine.quantity;

                  if (item.quantity < 3) {
                    this.publish(EventType.LOW_STOCK_WARNING_EVENT, {
                      subscriberName: data.subscriberName,
                      machine: item,
                    });
                  }
                }
              }
            }
            break;
          case EventType.REFILL_EVENT:
            {
              for (const item of sharedArrayMachine) {
                if (item.id === data.machine.id) {
                  item.quantity += data.machine.quantity;

                  if (item.quantity >= 3) {
                    this.publish(EventType.STOCK_LEVEL_OK_EVENT, {
                      subscriberName: data.subscriberName,
                      machine: item,
                    });
                  }
                }
              }
            }
            break;
          case EventType.LOW_STOCK_WARNING_EVENT:
            {
              const eventSubscribers = this.subscribers.get(eventType);
              if (eventSubscribers) {
                eventSubscribers.forEach((subscriber) => {
                  if (subscriber.subcriberName === data.subscriberName) {
                    subscriber.handleEvent(eventType, data.machine);
                  }
                });
              }
            }
            break;
          case EventType.STOCK_LEVEL_OK_EVENT:
            {
              const eventSubscribers = this.subscribers.get(eventType);
              if (eventSubscribers) {
                eventSubscribers.forEach((subscriber) => {
                  if (subscriber.subcriberName === data.subscriberName) {
                    subscriber.handleEvent(eventType, data.machine);
                  }
                });
              }
            }
            break;

          default:
            break;
        }
      }
    });
  }

  public subscribe(eventType: EventType, subscriber: ISubscriber): void {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }

    const eventSubscribers = this.subscribers.get(eventType);
    eventSubscribers.push(subscriber);
  }

  public unsubscribe(eventType: EventType, name: string): void {
    const eventSubscribers = this.subscribers.get(eventType);
    if (eventSubscribers?.length) {
      const index = eventSubscribers.findIndex((e) => e.subcriberName === name);
      if (index !== -1) {
        eventSubscribers.splice(index, 1);
      }
    }
  }

  public publish(
    eventType: EventType,
    data: { subscriberName: string; machine: Machine }
  ): void {
    const event = {
      eventType,
      data,
    };

    this.publishClient
      .publish("event_channel", JSON.stringify(event))
      .catch((err) => {
        console.error("Failed to publish event:", err);
      });
  }
}
