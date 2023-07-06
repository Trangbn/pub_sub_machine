import { EventType, ISubscriber, Machine } from "./event.interface";

export class Subscriber implements ISubscriber {
  subcriberName: string;
  constructor(name: string) {
    this.subcriberName = name;
  }
  public handleEvent(eventType: EventType, machine: Machine): void {
    console.log(
      `${this.subcriberName} received event '${eventType}' for machine ${machine.name}`
    );
  }
}
