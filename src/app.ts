import { Subscriber } from "./event/subcribers";
import { EventType, Machine } from "./event/event.interface";
import express, { Request, Response } from "express";
import { PublishSubscribeService } from "./event";
import bodyParser from "body-parser";
const app = express();
app.use(bodyParser.json());

const port = 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

export const sharedArrayMachine: Machine[] = [
  { id: 1, name: "Machine 1", quantity: 100 },
  { id: 2, name: "Machine 2", quantity: 50 },
]; // Shared array of mach  ines

const publishSubscribeService = new PublishSubscribeService();

const subscriber1 = new Subscriber("machine 1");
const subscriber2 = new Subscriber("machine 2");

publishSubscribeService.subscribe(
  EventType.LOW_STOCK_WARNING_EVENT,
  subscriber1
);
publishSubscribeService.subscribe(
  EventType.LOW_STOCK_WARNING_EVENT,
  subscriber2
);
publishSubscribeService.subscribe(EventType.STOCK_LEVEL_OK_EVENT, subscriber1);
publishSubscribeService.subscribe(EventType.STOCK_LEVEL_OK_EVENT, subscriber2);

app.get("/machine", (req: Request, res: Response) => {
  res.json({ machine: sharedArrayMachine });
});

app.post("/trigger-event-sale", (req: Request, res: Response) => {
  const { machine, eventType, name } = req.body;

  publishSubscribeService.publish(eventType, { subscriberName: name, machine });

  res.status(200).json({ message: "Event triggered successfully" });
});

app.post("/trigger-event-refill", (req: Request, res: Response) => {
  const { machine, eventType, name } = req.body;

  publishSubscribeService.publish(eventType, { subscriberName: name, machine });

  res.status(200).json({ message: "Event refill quantity successfully" });
});

app.post("/unsubscribe", (req: Request, res: Response) => {
  const { eventType, name } = req.body;
  publishSubscribeService.unsubscribe(eventType, name);

  res
    .status(200)
    .json({
      message: `Event unsubscribe ${name} from ${eventType} successfully`,
    });
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});
