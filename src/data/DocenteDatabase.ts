import moment from "moment";
import { Docente } from "../model/Docente";
import { BaseDatabase } from "./BaseDatabase";

export class DocenteDatabase extends BaseDatabase {

    private static TABLE_NAME = "docente"

    public insertDocente = async (docente: Docente): Promise<void> => {
        try {
            await BaseDatabase.connection()
                .insert({
                    id: docente.getId(),
                    nome: docente.getNome(),
                    email: docente.getEmail(),
                    data_nasc: docente.getDataNasc(),
                    turma_id: docente.getTurmaId()
                })
                .into(DocenteDatabase.TABLE_NAME)

            const especialidades = docente.getEspecialidades()

            const especialidadeId = (): string => {
                return Date.now().toString()
            }

            const docenteEspecialidadeId = (): string => {
                return Date.now().toString()
            }

            for (const especialidade of especialidades) {
                const id = especialidadeId()

                const listaDeEspecialidades = await BaseDatabase.connection()
                    .select("*")
                    .from("especialidade")
                    .where("nome", "like", `%${especialidade}%`)

                if (listaDeEspecialidades.length === 0) {
                    await BaseDatabase.connection()
                        .insert({
                            id: id,
                            nome: especialidade
                        })
                        .into("especialidade")

                    await BaseDatabase.connection()
                        .insert({
                            id: docenteEspecialidadeId(),
                            docente_id: docente.getId(),
                            especialidade_id: id
                        })
                        .into("docente_especialidade")
                } else {
                    await BaseDatabase.connection()
                        .insert({
                            id: docenteEspecialidadeId(),
                            docente_id: docente.getId(),
                            especialidade_id: listaDeEspecialidades[0].id
                        })
                        .into("docente_especialidade")
                }

            }

        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public selectDocentes = async (): Promise<Docente[]> => {
        try {
            const result = await BaseDatabase.connection()
                .select("*")
                .from(DocenteDatabase.TABLE_NAME)

            return result.map(docente => {
                return new Docente(
                    docente.id,
                    docente.nome,
                    docente.email,
                    moment(docente.data_nasc, "YYYY-MM-DD").format("DD/MM/YYYY"),
                    docente.turma_id,
                    docente.especialidades
                )
            }
            )

        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public updateDocenteDeTurma = async (id: string, turma_id: string): Promise<void> => {
        try {
            await BaseDatabase.connection()
                .update({
                    turma_id
                })
                .into(DocenteDatabase.TABLE_NAME)
                .where({ id })

        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public selectDocentesEspecialistasEmPoo = async (): Promise<Docente[]> => {
        try {
            const result = await BaseDatabase.connection()
                .select("*")
                .from(DocenteDatabase.TABLE_NAME)
                .innerJoin("docente_especialidade", "docente.id", "docente_especialidade.docente_id")
                .innerJoin("especialidade", "docente_especialidade.especialidade_id", "especialidade.id")
                .where("especialidade.nome", "like", `%POO%`)

            return result

        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

    public selectDocenteSigno = async (dataInicial: string | undefined, dataFinal: string | undefined): Promise<Docente[]> => {
        try {
            const result = await BaseDatabase.connection.raw(`
            SELECT * FROM docente
            WHERE RIGHT(data_nasc,5) BETWEEN '${dataInicial}' AND '${dataFinal}'
            `)

            const estudantes = result[0].map((estudante: any) => {
                return new Docente(
                    estudante.id,
                    estudante.nome,
                    estudante.email,
                    moment(estudante.data_nasc, "YYYY-MM-DD").format("DD/MM/YYYY"),
                    estudante.turma_id,
                    estudante.hobbies
                )
            })

            return estudantes

        } catch (error: any) {
            console.log(error)
            throw new Error(error.sqlMessage || error.message)
        }
    }

}