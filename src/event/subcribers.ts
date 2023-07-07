import { IEvent, ISubscriber, LowStockWarningEvent, MachineRefillEvent, MachineSaleEvent, StockLevelOkEvent } from "./event.interface";
import { MachineRepository } from "./repository";
import { PublishSubscribeService } from "./service";

export class MachineSaleSubscriber implements ISubscriber {
  private subscribedEvents: string[] = ['MachineSaleEvent'];

  constructor(private machineRepository: MachineRepository) { }

  subscribe(eventType: string): void {
    if (!this.subscribedEvents.includes(eventType)) {
      this.subscribedEvents.push(eventType);
    }
  }

  unsubscribe(eventType: string): void {
    const index = this.subscribedEvents.indexOf(eventType);
    if (index !== -1) {
      this.subscribedEvents.splice(index, 1);
    }
  }

  handleEvent(event: IEvent): void {
    if (event instanceof MachineSaleEvent) {
      const machine = event.machine;
      const saleQuantity = event.saleQuantity;
      machine.decreaseStock(saleQuantity);
    }
  }
  isSubscribedToEvent(eventType: string): boolean {
    return this.subscribedEvents.includes(eventType);
  }
}

export class MachineRefillSubscriber implements ISubscriber {
  private subscribedEvents: string[] = ['MachineRefillEvent'];

  constructor(private machineRepository: MachineRepository) { }

  subscribe(eventType: string): void {
    if (!this.subscribedEvents.includes(eventType)) {
      this.subscribedEvents.push(eventType);
    }
  }

  unsubscribe(eventType: string): void {
    const index = this.subscribedEvents.indexOf(eventType);
    if (index !== -1) {
      this.subscribedEvents.splice(index, 1);
    }
  }

  handleEvent(event: IEvent): void {
    if (event instanceof MachineRefillEvent) {
      const machine = event.machine;
      const refillQuantity = event.refillQuantity;
      machine.increaseStock(refillQuantity);
    }
  }
  isSubscribedToEvent(eventType: string): boolean {
    return this.subscribedEvents.includes(eventType);
  }
}

// Concrete subscriber for stock warnings
export class StockWarningSubscriber implements ISubscriber {
  private subscribedEvents: string[] = ['MachineSaleEvent', 'MachineRefillEvent'];
  private lowStockNotifiedMachines: Set<number> = new Set();

  constructor(private machineRepository: MachineRepository, private publishSubscribeService: PublishSubscribeService) { }

  subscribe(eventType: string): void {
    if (!this.subscribedEvents.includes(eventType)) {
      this.subscribedEvents.push(eventType);
    }
  }

  unsubscribe(eventType: string): void {
    const index = this.subscribedEvents.indexOf(eventType);
    if (index !== -1) {
      this.subscribedEvents.splice(index, 1);
    }
  }

  handleEvent(event: IEvent): void {
    if (event instanceof MachineSaleEvent || event instanceof MachineRefillEvent) {
      const machine = event.machine;
      const currentStock = machine.stock;

      if (currentStock < 3 && !this.lowStockNotifiedMachines.has(machine.id)) {
        this.publishSubscribeService.publish(new LowStockWarningEvent(machine));
        this.lowStockNotifiedMachines.add(machine.id);
      } else if (currentStock >= 3 && this.lowStockNotifiedMachines.has(machine.id)) {
        this.publishSubscribeService.publish(new StockLevelOkEvent(machine));
        this.lowStockNotifiedMachines.delete(machine.id);
      }
    }
  }
  isSubscribedToEvent(eventType: string): boolean {
    return this.subscribedEvents.includes(eventType);
  }
}