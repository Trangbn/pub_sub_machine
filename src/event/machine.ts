export class Machine {
  constructor(public id: number, public name: string, public stock: number) { }

  decreaseStock(quantity: number): boolean {
    if (this.stock >= quantity) {
      this.stock -= quantity;
      return true;
    }
    return false;
  }

  increaseStock(quantity: number): void {
    this.stock += quantity;
  }
}