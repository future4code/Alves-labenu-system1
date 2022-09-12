import { Turma } from "../model/Turma"
import { BaseDatabase } from "./BaseDatabase"


export class TurmaDatabase extends BaseDatabase {
    private static TABLE_NAME = "turma"

    public insertTurma = async (turma: Turma): Promise<void> => {
        try {
            await this.BaseDatabase.connection()
                .insert({
                    id: turma.getId(),
                    nome: turma.getNome(),
                    modulo: turma.getModulo()
                })
                .into(TurmaDatabase.TABLE_NAME)
        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public selectTurmas = async (): Promise<Turma[]> => {
        try {

            const result = await this.BaseDatabase.connection()
                .select("*")
                .from(TurmaDatabase.TABLE_NAME)
                .where("modulo", ">" , "0")

            return result

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
    

    public selectTurmaById = async (id: string): Promise<Turma> => {
        try {

            const result = await this.BaseDatabase.connection()
                .select("*")
                .from(TurmaDatabase.TABLE_NAME)
                .where({ id })

            return new Turma(result[0].id, result[0].nome, result[0].modulo)

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }

    }

    public updateModulo = async (id: string, modulo: string): Promise<void> => {
        try {

            await this.BaseDatabase.connection()
                .update({
                    modulo
                })
                .into(TurmaDatabase.TABLE_NAME)
                .where({ id })

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public selectDocentesByTurma = async (id: string): Promise<any> => {
        try {

            const result = await this.BaseDatabase.connection()
                .select("docente.id as docente_id", "docente.nome as docente_nome", "docente.email as docente_email", "docente.data_nasc as docente_nascimento")
                .from(TurmaDatabase.TABLE_NAME)
                .join("docente", "docente.turma_id", "=", "turma.id")
                .where("turma.id", "=", id)

            return result

        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public selectEstudantesByTurma = async (id: string): Promise<any> => {
        try {

            const result = await this.BaseDatabase.connection()
                .select("estudante.id as estudante_id", "estudante.nome as estudante_nome", "estudante.email as estudante_email", "estudante.data_nasc as estudante_nascimento")
                .from(TurmaDatabase.TABLE_NAME)
                .join("estudante", "estudante.turma_id", "=", "turma.id")
                .where("turma.id", "=", id)

            return result

        } catch (error: any) {
            throw new Error(error.sqlMessage || error.message)
        }
    }
    BaseDatabase: any
}