export enum EventType {
  SALE_EVENT = "sale",
  REFILL_EVENT = "refill",
  LOW_STOCK_WARNING_EVENT = "low_stock_warning",
  UNSUBSCRIBE = "unsubscribe",
  STOCK_LEVEL_OK_EVENT = "stock_level_ok_event",
}

// Define the Machine interface
export interface Machine {
  id: number;
  name: string;
  quantity: number;
}

// Define the ISubscriber interface
export interface ISubscriber {
  subcriberName: string;
  handleEvent(
    eventType: EventType,
    machine: Machine,
    subscriberName?: string
  ): void;
}
