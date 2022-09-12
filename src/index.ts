import { app } from "./app";
import { DocenteController } from "./endpoints/DocenteController";




// Docentes
app.get("/docente", DocenteController.getDocentes)
app.get("/docente/poo", DocenteController.getDocentesEspecialistasEmPoo)
app.post("/docente", DocenteController.createDocente)
app.put("/docente/:id", DocenteController.changeDocenteDeTurma)
