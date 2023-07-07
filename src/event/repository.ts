
import Maybe from "../util";
import { Machine } from "./machine";

export class MachineRepository {
  private machines: Machine[] = [];

  add(machine: Machine): void {
    this.machines.push(machine);
  }

  getById(id: number): Maybe<Machine> {
    const machine = this.machines.find((m) => m.id === id);
    return machine ? Maybe.Some(machine) : Maybe.None();
  }

  getAll(): Machine[] {
    return [...this.machines];
  }
}
