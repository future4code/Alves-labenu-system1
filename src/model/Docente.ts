import { Usuario } from "./Usuario";

export class Docente extends Usuario {
    private especialidades: string[] = []

    constructor(
        id: string, nome: string, email: string, data_nasc: string, turma_id: string, especialidades: string[]
    ) {
        super(id, nome, email, data_nasc, turma_id)
        this.especialidades = especialidades
    }

    public getEspecialidades(): string[] {
        return this.especialidades
    }

    public setEspecialidades(especialidades: string[]): void {
        this.especialidades = especialidades
    }
    
}