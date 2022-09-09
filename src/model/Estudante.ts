import { Usuario } from "./Usuario"

export class Estudante extends Usuario {
    private hobbies: string[] = []

    constructor(
        id: string, nome: string, email: string, data_nasc: string, turma_id: string, hobbies: string[]
    ) {
        super(id, nome, email, data_nasc, turma_id)
        this.hobbies = hobbies
    }

    public getHobbies(): string[] {
        return this.hobbies
    }
}