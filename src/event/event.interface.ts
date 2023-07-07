import { Machine } from "./machine";

export interface IEvent {
  eventType: string;
}

export interface IPublishSubscribeService {
  subscribe(subscriber: ISubscriber): void;
  publish(event: IEvent): void;
}

// Subscriber interface
export interface ISubscriber {
  subscribe(eventType: string): void;
  unsubscribe(eventType: string): void;
  isSubscribedToEvent(eventType: string): boolean;
  handleEvent(event: IEvent): void;
}

export class MachineSaleEvent implements IEvent {
  eventType = 'MachineSaleEvent';

  constructor(public machine: Machine, public saleQuantity: number) { }
}

export class MachineRefillEvent implements IEvent {
  eventType = 'MachineRefillEvent';

  constructor(public machine: Machine, public refillQuantity: number) { }
}

export class LowStockWarningEvent implements IEvent {
  eventType = 'LowStockWarningEvent';

  constructor(public machine: Machine) { }
}

export class StockLevelOkEvent implements IEvent {
  eventType = 'StockLevelOkEvent';

  constructor(public machine: Machine) { }
}