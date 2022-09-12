import { Request, Response } from "express"
import moment from "moment"
import { DocenteDatabase } from "../data/DocenteDatabase"
import { Docente } from "../model/Docente"


export class DocenteController {
    static getDocentes(arg0: string, getDocentes: any) {
        throw new Error("Method not implemented.")
    }
    static getDocentesEspecialistasEmPoo(arg0: string, getDocentesEspecialistasEmPoo: any) {
        throw new Error("Method not implemented.")
    }
    static createDocente(arg0: string, createDocente: any) {
        throw new Error("Method not implemented.")
    }
    static changeDocenteDeTurma(arg0: string, changeDocenteDeTurma: any) {
        throw new Error("Method not implemented.")
    }
    
    createDocente = async (req: Request, res: Response) => {
        try {

            const { nome, email, data_nasc, turma_id, especialidades } = req.body

            if (!nome || !email || !data_nasc || !turma_id) {
                res.statusCode = 400
                throw new Error("Nome, email, data de nascimento e turma são obrigatórios")
            }

            const dataSeparada = data_nasc.split("/").reverse().join("-")
            console.log(dataSeparada)

            const id = Date.now().toString()

            const novoDocente = new Docente(id, nome, email, dataSeparada, turma_id, especialidades)

            const docenteDB = new DocenteDatabase()

            await docenteDB.insertDocente(novoDocente)

            res.status(201).send({message: "Docente criado com sucesso"})


        } catch (error: any) {
            if (res.statusCode === 200) {
                res.status(500).send({message: error.message})
            } else {
                res.status(res.statusCode).send({ message: error.sqlMessage || error.message })
            }
        }
    }

    getDocentes = async (req: Request, res: Response) => {
        try {

            const docenteDB = new DocenteDatabase()

            const docentes = await docenteDB.selectDocentes()

            res.status(200).send({docentes})
        } catch (error: any) {
            res.status(500).send({message: error.message})
        }
    }

    changeDocenteDeTurma = async (req: Request, res: Response) => {
        try {

            const { id } = req.params
            const { turma_id } = req.body

            if (!id || !turma_id) {
                res.statusCode = 400
                throw new Error("Id e turma são obrigatórios")
            }
            
            const docenteDB = new DocenteDatabase()

            await docenteDB.updateDocenteDeTurma(id, turma_id)

            res.status(200).send({message: "Docente atualizado com sucesso"})

        } catch (error: any) {
            res.status(500).send({message: error.message})
        }
    }
    

    getDocentesEspecialistasEmPoo = async (req: Request, res: Response) => {
        try {

            const docenteDB = new DocenteDatabase()

            const docentes = await docenteDB.selectDocentesEspecialistasEmPoo()

            if (!docentes) {
                res.statusCode = 404
                throw new Error("Nenhum docente encontrado")
            }

            docentes.forEach((element: any) => {
                element.data_nasc = moment(element.data_nasc,"YYYY-MM-DD").format("DD/MM/YYYY")
            })

            res.status(200).send({docentes})
        } catch (error: any) {
            res.status(500).send({message: error.message})
        }
    }
}