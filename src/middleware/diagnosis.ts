import { Request, Response, NextFunction } from "express";
import { _diagnosis, _treatment } from "../interface/interface";
import { isNumber } from "class-validator";
import { myDataSource } from "../dataSource";
import { Diagnosis, Treatment } from "../entity/NutrigeneticsEntity";
const treatmentRepository = myDataSource.getRepository(Treatment);
//const diagnosisRepository=myDataSource.getRepository(Diagnosis)

const namesRegex = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]{2,36}$/; /*solo letras y espacios*/

export const diagnosisFields = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let reqBody: _diagnosis = req.body;
  //patient
  if (reqBody.patient === undefined || reqBody.patient.length === 0) {
    return res.status(400).send({ Message: "El 'paciente' es requerido" });
  } else if (
    !isNumber(parseInt(reqBody.patient)) &&
    !namesRegex.test(reqBody.patient)
  ) {
    return res.status(400).send({
      Message:
        "Ingrese en 'paciente' solo letras y espacios mínimo 2 o máximo 36 caracteres.",
    });
  } else if (
    isNumber(parseInt(reqBody.patient)) &&
    reqBody.patient.length !== 8
  ) {
    return res.status(400).send({
      Message: "Ingrese en 'paciente' numeros de 8 digitos.",
    });
  }
  //test
  else if (reqBody.test === undefined || reqBody.test.length === 0) {
    return res.status(400).send({
      Message: "El campo 'test' es requerido.",
    });
  } else if (
    reqBody.test !== undefined &&
    reqBody.test !== "LDH/DHL" &&
    reqBody.test !== "ACIDO URICO" &&
    reqBody.test !== "COL. TOTAL" &&
    reqBody.test !== "Co2" &&
    reqBody.test !== "GGTP" &&
    reqBody.test !== "GLUCOSA" &&
    reqBody.test !== "HEMOGLOBINA" &&
    reqBody.test !== "RDW ADE IDE" &&
    reqBody.test !== "TGO AST" &&
    reqBody.test !== "TGP ALT" &&
    reqBody.test !== "TRIGLICERIDOS" &&
    reqBody.test !== "UREA" &&
    reqBody.test !== "VCM"
  ) {
    return res.status(400).send({
      Message: "Ingrese un 'test' válido.",
    });
  }
  //sex
  else if (
    reqBody.sex !== undefined &&
    reqBody.sex.length > 0 &&
    reqBody.sex !== "F" &&
    reqBody.sex !== "M"
  ) {
    return res.status(400).send({ Message: "El campo 'sex' no es válido" });
  }
  //result
  else if (reqBody.result === undefined || reqBody.result.length === 0) {
    return res.status(400).send({
      Message: "el campo 'result' es requerido.",
    });
  } else if (!isNumber(parseFloat(reqBody.result))) {
    return res.status(400).send({
      Message: "Ingrese en 'result' un número válido.",
    });
  }
  //treatment
  else if (reqBody.treatment !== undefined && reqBody.treatment.length > 2083) {
    return res.status(400).send({
      Message: "No more characters are allowed in the 'treatment' field.",
    });
  }
  //condition
  else if (
    reqBody.condition !== undefined &&
    reqBody.condition.length > 0 &&
    reqBody.condition !== "activo" &&
    reqBody.condition !== "inactivo"
  ) {
    return res.status(400).send({ Message: "La 'condición' no es válido" });
  }

  //observation
  else if (
    reqBody.observation !== undefined &&
    reqBody.observation.length > 200
  ) {
    return res.status(400).send({
      Message: "No more characters are allowed in the 'observation' field.",
    });
  } else {
    return next();
  }
};
