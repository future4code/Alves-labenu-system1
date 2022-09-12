export class Turma {
  constructor(private name: string, private modulo: string) {}

  getName() {
    return this.name;
  }

  getModulo() {
    return this.modulo;
  }

  setModulo(modulo: string) {
    this.modulo = modulo;
  }
}
