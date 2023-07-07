import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { MachineRepository } from "./event/repository";
import { PublishSubscribeService } from "./event/service";
import { Machine } from "./event/machine";
import { MachineRefillSubscriber, MachineSaleSubscriber, StockWarningSubscriber } from "./event/subcribers";
import { MachineRefillEvent, MachineSaleEvent } from "./event/event.interface";
const app = express();
app.use(bodyParser.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Usage example
const machineRepository = new MachineRepository();
const publishSubscribeService = new PublishSubscribeService();

// Create machines
const machine1 = new Machine(1, 'Machine 1', 5);
const machine2 = new Machine(2, 'Machine 2', 2);
const machine3 = new Machine(3, 'Machine 3', 4);

// Store machines in repository
machineRepository.add(machine1);
machineRepository.add(machine2);
machineRepository.add(machine3);
// Create subscribers
const machineRefillSubscriber = new MachineRefillSubscriber(machineRepository);
const machineSaleSubscriber = new MachineSaleSubscriber(machineRepository);
const stockWarningSubscriber = new StockWarningSubscriber(machineRepository, publishSubscribeService);

// Subscribe subscribers to the service
publishSubscribeService.subscribe(machineRefillSubscriber);
publishSubscribeService.subscribe(machineSaleSubscriber);
publishSubscribeService.subscribe(stockWarningSubscriber);
// publishSubscribeService.unsubscribe(stockWarningSubscriber);

app.get('/machine', (req: Request, res: Response) => {
  res.json({ machine: machineRepository.getAll() })
})

app.post('/refill', (req: Request, res: Response) => {
  const { machineId, quantity } = req.body;
  const machineSale = machineRepository.getById(machineId).getValue();
  const refillEvent = new MachineRefillEvent(machineSale, quantity);

  publishSubscribeService.publish(refillEvent);
  res.json({ machine: machineSale })
})

app.post('/sale', (req: Request, res: Response) => {
  const { machineId, quantity } = req.body;
  const machineSale = machineRepository.getById(machineId).getValue();
  const saleEvent = new MachineSaleEvent(machineSale, quantity);

  publishSubscribeService.publish(saleEvent);
  res.json({ machine: machineSale })
})

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
