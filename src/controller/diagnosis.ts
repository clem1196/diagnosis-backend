import { Request, Response } from "express";
import { Diagnosis, Treatment } from "../entity/NutrigeneticsEntity";
import { myDataSource } from "../dataSource";
import { _diagnosis, _treatment } from "../interface/interface";

const diagnosisRepository = myDataSource.getRepository(Diagnosis);
const treatmentRepository = myDataSource.getRepository(Treatment);

//get diagnosis all
export const diagnosisAll = async (req: Request, res: Response) => {
  try {
   
    const diagnosis: Array<_diagnosis> = await diagnosisRepository.find();
    
    const patients: object | null = await diagnosisRepository
      .createQueryBuilder("diagnosis")
      .select("DISTINCT(patient)")
      .getRawMany();
      console.log(patients);
    if (patients !== null || diagnosis.values.length > 0) {
      
      return res
        .status(200)
        .send({ Message: "OK", results: diagnosis, patients: patients });
    }
    return res.status(404).send({ Message: "No data" });
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
//get diagnosis one
export const diagnosisOne = async (req: Request, res: Response) => {
  try {
    const diagnosis: Array<_diagnosis> = await diagnosisRepository.find({
      where: { diagnosis_id: parseInt(req.params.id) },
    });
    if (diagnosis.length > 0) {
      return res.status(200).send({ Message: "OK", results: diagnosis });
    }
    return res.status(404).send({ Message: "The 'diagnosis' does not exist" });
  } catch (error:any) {
    return res.send(error.sqlMessage);
  }
};

//create diagnosis
export const diagnosisCreate = async (req: Request, res: Response) => {
  try {
    /*MyFunction consulta a la tabla Treatment si la receta para el tipo de 'test' y 'level'
    exite, si no existe la crea*/
    let reqBody: _diagnosis = req.body;
    let myFunction = async (repository: any, te: string, le: string) => {
      let treatmentExists = await repository
        .createQueryBuilder("treatment")
        .where("treatment.test=:test", { test: te })
        .andWhere("treatment.level=:level", { level: le })
        .getOne();
      console.log(treatmentExists);
      if (treatmentExists === null) {
        //create treatment
        const newTreatment: _treatment = repository.create({
          test: te,
          level: le,
          recip: `Esta es la receta de ${te} y ${le}`,
        });
        await repository.save(newTreatment);

        reqBody.treatment = newTreatment.recip;
      } else {
        reqBody.treatment = treatmentExists.recip;
      }
    };

    //find by test and patient
    const testAndPatientExists: object | null = await diagnosisRepository
      .createQueryBuilder("diagnosis")
      .where("diagnosis.test=:test", { test: req.body.test })
      .andWhere("diagnosis.patient=:patient", { patient: req.body.patient })
      .getOne();

    if (testAndPatientExists !== null) {
      return res
        .status(409)
        .send({ Message: "The 'patient' already has that 'test'!" });
    } else {
      if (reqBody.test === "LDH/DHL") {
        reqBody.pi = 115.0;
        reqBody.pf = 240.0;
        reqBody.p1 = (reqBody.pi + reqBody.pf) / 2 - 10;
        reqBody.p2 = (reqBody.pi + reqBody.pf) / 2;
        reqBody.p3 = (reqBody.pi + reqBody.pf) / 2 + 10;
        reqBody.ideal = reqBody.p2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Peligro inicial";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) < reqBody.p1
        ) {
          reqBody.interpretation = "Riesgo inicial";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.p1 &&
          parseFloat(reqBody.result) <= reqBody.p3
        ) {
          reqBody.interpretation = "Saludable";

          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) > reqBody.p3 &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Riesgo final";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Peligro final";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "GLUCOSA") {
        reqBody.pi = 0.0;
        reqBody.pf = 100.0;
        reqBody.p1 = 125.0;
        reqBody.p2 = 0.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pf) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pf &&
          parseFloat(reqBody.result) <= reqBody.p1
        ) {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Muy alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "COL. TOTAL") {
        reqBody.pi = 0.0;
        reqBody.pf = 200.0;
        reqBody.p1 = 240.0;
        reqBody.p2 = 0.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pf) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pf &&
          parseFloat(reqBody.result) <= reqBody.p1
        ) {
          reqBody.interpretation = "Moderado";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "TRIGLICERIDOS") {
        reqBody.pi = 0.0;
        reqBody.pf = 150.0;
        reqBody.p1 = 200.0;
        reqBody.p2 = 500;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pf) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pf &&
          parseFloat(reqBody.result) < reqBody.p1
        ) {
          reqBody.interpretation = "Moderado";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.p1 &&
          parseFloat(reqBody.result) < reqBody.p2
        ) {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Muy alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "UREA") {
        reqBody.pi = 18.0;
        reqBody.pf = 55.0;
        if (reqBody.sex === "F") {
          reqBody.pi = 17.0;
          reqBody.pf = 43.0;
        }
        reqBody.p1 = 0.0;
        reqBody.p2 = 0.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Bajo";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "Co2") {
        //en mmol/l milimoles por litro
        reqBody.pi = 23.0;
        reqBody.pf = 29.0;
        reqBody.p1 = 0.0;
        reqBody.p2 = 0.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Bajo";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "VCM") {
        // en fl
        reqBody.pi = 80.0;
        reqBody.pf = 100.0;
        reqBody.p1 = 0.0;
        reqBody.p2 = 0.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Bajo";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "RDW ADE IDE") {
        //en porcentaje %: variacion porcentual o desviacion estandar del volumen corpuscular
        reqBody.pi = 11.0;
        reqBody.pf = 15.0;
        reqBody.p1 = 18.0;
        reqBody.p2 = 26.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Bajo";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) < reqBody.pf
        ) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pf &&
          parseFloat(reqBody.result) <= reqBody.p1
        ) {
          reqBody.interpretation = "Leve";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Severo";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "GGTP") {
        reqBody.pi = 8.0;
        reqBody.pf = 38.0;
        if (reqBody.sex === "F") {
          reqBody.pi = 5.0;
          reqBody.pf = 27.0;
        }
        reqBody.p1 = reqBody.pi + (reqBody.pf - reqBody.pi) / 4;
        reqBody.p2 = reqBody.p1 + (reqBody.pf - reqBody.pi) / 4;
        reqBody.p3 = reqBody.p2 + (reqBody.pf - reqBody.pi) / 4;
        reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Peligro inicial";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) < reqBody.p1
        ) {
          reqBody.interpretation = "Saludable";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.p1 &&
          parseFloat(reqBody.result) <= reqBody.p2
        ) {
          reqBody.interpretation = "Leve";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) > reqBody.p2 &&
          parseFloat(reqBody.result) <= reqBody.p3
        ) {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) > reqBody.p3 &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Muy alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Peligro final";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "TGO AST") {
        reqBody.pi = 5.0;
        reqBody.pf = 40.0;
        reqBody.p1 = reqBody.pi + (reqBody.pf - reqBody.pi) / 4;
        reqBody.p2 = reqBody.p1 + (reqBody.pf - reqBody.pi) / 4;
        reqBody.p3 = reqBody.p2 + (reqBody.pf - reqBody.pi) / 4;
        reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Peligro inicial";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) < reqBody.p1
        ) {
          reqBody.interpretation = "Saludable";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.p1 &&
          parseFloat(reqBody.result) <= reqBody.p2
        ) {
          reqBody.interpretation = "Leve";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) > reqBody.p2 &&
          parseFloat(reqBody.result) <= reqBody.p3
        ) {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) > reqBody.p3 &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Muy alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Peligro final";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "TGP ALT") {
        reqBody.pi = 5.0;
        reqBody.pf = 35.0;
        reqBody.p1 = reqBody.pi + (reqBody.pf - reqBody.pi) / 4;
        reqBody.p2 = reqBody.p1 + (reqBody.pf - reqBody.pi) / 4;
        reqBody.p3 = reqBody.p2 + (reqBody.pf - reqBody.pi) / 4;
        reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
        console.log(reqBody.ideal);
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Peligro inicial";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) < reqBody.p1
        ) {
          reqBody.interpretation = "Saludable";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.p1 &&
          parseFloat(reqBody.result) <= reqBody.p2
        ) {
          reqBody.interpretation = "Leve";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) > reqBody.p2 &&
          parseFloat(reqBody.result) <= reqBody.p3
        ) {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) > reqBody.p3 &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Muy alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Peligro final";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "ACIDO URICO") {
        reqBody.pi = 3.0;
        reqBody.pf = 8.0;
        reqBody.p1 = reqBody.pi + 1.5;
        if (reqBody.sex === "F") {
          reqBody.pi = 2.4;
          reqBody.pf = 7.0;
          reqBody.p1 = reqBody.pi + 1.0;
        }
        reqBody.p2 = 0.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Peligro inicial";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) < reqBody.p1
        ) {
          reqBody.interpretation = "Saludable";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.p1 &&
          parseFloat(reqBody.result) <= reqBody.pf
        ) {
          reqBody.interpretation = "Leve";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Peligro final";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else if (reqBody.test === "HEMOGLOBINA") {
        //en g/dl gramos por decilitros
        reqBody.pi = 13.8;
        reqBody.pf = 17.2 - 1; //punto final disminui don en 1
        if (reqBody.sex === "F") {
          reqBody.pi = 12.1;
          reqBody.pf = 15.1 - 2; //punto final disminuido en 2
        }
        reqBody.p1 = 0.0;
        reqBody.p2 = 0.0;
        reqBody.p3 = 0.0;
        reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
        if (parseFloat(reqBody.result) < reqBody.pi) {
          reqBody.interpretation = "Bajo";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else if (
          parseFloat(reqBody.result) >= reqBody.pi &&
          parseFloat(reqBody.result) < reqBody.pf
        ) {
          reqBody.interpretation = "Normal";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        } else {
          reqBody.interpretation = "Alto";
          await myFunction(
            treatmentRepository,
            reqBody.test,
            reqBody.interpretation
          );
        }
      } else {
        return res.send({ Message: "Enter 'test' type" });
      }
      reqBody.updated = new Date("");

      const newdiagnosis: object = diagnosisRepository.create(req.body);
      const results: object = await diagnosisRepository.save(newdiagnosis);
      return res
        .status(201)
        .send({ Message: "Successfull created", results: results });
    }
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
//edit diagnosis
export const diagnosisEdit = async (req: Request, res: Response) => {
  try {
    let reqBody: _diagnosis = req.body;
    /*MyFunction consulta a la tabla Treatment si la receta para el tipo de 'test' y 'level'
    exite, si no existe la crea*/
    let myFunction = async (repository: any, te: string, le: string) => {
      let treatmentExists = await repository
        .createQueryBuilder("treatment")
        .where("treatment.test=:test", { test: te })
        .andWhere("treatment.level=:level", { level: le })
        .getOne();
      //console.log(treatmentExists);
      if (treatmentExists === null) {
        //create treatment
        const newTreatment: _treatment = repository.create({
          test: te,
          level: le,
          recip: `Esta es la receta de ${te} y ${le}`,
        });
        await repository.save(newTreatment);
        reqBody.treatment = newTreatment.recip;
      } else {
        if (reqBody.treatment !== treatmentExists.recip) {
          //editamos treatment
          treatmentExists.recip = reqBody.treatment;
          await repository.save(treatmentExists);
          reqBody.treatment = treatmentExists.recip;
        }
        reqBody.treatment = treatmentExists.recip;
      }
    };
    const diagnosis: Array<_diagnosis> | undefined =
      await diagnosisRepository.find({
        where: { diagnosis_id: parseInt(req.params.id) },
      });

    if (diagnosis.length > 0) {
      //find by test and patient and diferent id
      const testAndPatientExists: object | null = await diagnosisRepository
        .createQueryBuilder("diagnosis")
        .where("diagnosis.test=:test", { test: reqBody.test })
        .andWhere("diagnosis.patient=:patient", { patient: reqBody.patient })
        .andWhere("diagnosis.diagnosis_id!=:diagnosis_id", {
          diagnosis_id: req.params.id,
        })
        .getOne();

      if (testAndPatientExists !== null) {
        return res
          .status(409)
          .send({ Message: "The 'patient' already has that 'test'!" });
      } else {
        if (reqBody.test === "LDH/DHL") {
          reqBody.pi = 115.0;
          reqBody.pf = 240.0;
          reqBody.p1 = (reqBody.pi + reqBody.pf) / 2 - 10;
          reqBody.p2 = (reqBody.pi + reqBody.pf) / 2;
          reqBody.p3 = (reqBody.pi + reqBody.pf) / 2 + 10;
          reqBody.ideal = reqBody.p2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Peligro inicial";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) < reqBody.p1
          ) {
            reqBody.interpretation = "Riesgo inicial";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.p1 &&
            parseFloat(reqBody.result) <= reqBody.p3
          ) {
            reqBody.interpretation = "Saludable";

            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) > reqBody.p3 &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Riesgo final";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Peligro final";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "GLUCOSA") {
          reqBody.pi = 0.0;
          reqBody.pf = 100.0;
          reqBody.p1 = 125.0;
          reqBody.p2 = 0.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pf) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pf &&
            parseFloat(reqBody.result) <= reqBody.p1
          ) {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Muy alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "COL. TOTAL") {
          reqBody.pi = 0.0;
          reqBody.pf = 200.0;
          reqBody.p1 = 240.0;
          reqBody.p2 = 0.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pf) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pf &&
            parseFloat(reqBody.result) <= reqBody.p1
          ) {
            reqBody.interpretation = "Moderado";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "TRIGLICERIDOS") {
          reqBody.pi = 0.0;
          reqBody.pf = 150.0;
          reqBody.p1 = 200.0;
          reqBody.p2 = 500;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pf) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pf &&
            parseFloat(reqBody.result) < reqBody.p1
          ) {
            reqBody.interpretation = "Moderado";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.p1 &&
            parseFloat(reqBody.result) < reqBody.p2
          ) {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Muy alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "UREA") {
          reqBody.pi = 18.0;
          reqBody.pf = 55.0;
          if (reqBody.sex === "F") {
            reqBody.pi = 17.0;
            reqBody.pf = 43.0;
          }
          reqBody.p1 = 0.0;
          reqBody.p2 = 0.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Bajo";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "Co2") {
          //en mmol/l milimoles por litro
          reqBody.pi = 23.0;
          reqBody.pf = 29.0;
          reqBody.p1 = 0.0;
          reqBody.p2 = 0.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Bajo";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "VCM") {
          // en fl
          reqBody.pi = 80.0;
          reqBody.pf = 100.0;
          reqBody.p1 = 0.0;
          reqBody.p2 = 0.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Bajo";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "RDW ADE IDE") {
          //en porcentaje %: variacion porcentual o desviacion estandar del volumen corpuscular
          reqBody.pi = 11.0;
          reqBody.pf = 15.0;
          reqBody.p1 = 18.0;
          reqBody.p2 = 26.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Bajo";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) < reqBody.pf
          ) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pf &&
            parseFloat(reqBody.result) <= reqBody.p1
          ) {
            reqBody.interpretation = "Leve";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Severo";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "GGTP") {
          reqBody.pi = 8.0;
          reqBody.pf = 38.0;
          if (reqBody.sex === "F") {
            reqBody.pi = 5.0;
            reqBody.pf = 27.0;
          }
          reqBody.p1 = reqBody.pi + (reqBody.pf - reqBody.pi) / 4;
          reqBody.p2 = reqBody.p1 + (reqBody.pf - reqBody.pi) / 4;
          reqBody.p3 = reqBody.p2 + (reqBody.pf - reqBody.pi) / 4;
          reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Peligro inicial";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) < reqBody.p1
          ) {
            reqBody.interpretation = "Saludable";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.p1 &&
            parseFloat(reqBody.result) <= reqBody.p2
          ) {
            reqBody.interpretation = "Leve";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) > reqBody.p2 &&
            parseFloat(reqBody.result) <= reqBody.p3
          ) {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) > reqBody.p3 &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Muy alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Peligro final";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "TGO AST") {
          reqBody.pi = 5.0;
          reqBody.pf = 40.0;
          reqBody.p1 = reqBody.pi + (reqBody.pf - reqBody.pi) / 4;
          reqBody.p2 = reqBody.p1 + (reqBody.pf - reqBody.pi) / 4;
          reqBody.p3 = reqBody.p2 + (reqBody.pf - reqBody.pi) / 4;
          reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Peligro inicial";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) < reqBody.p1
          ) {
            reqBody.interpretation = "Saludable";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.p1 &&
            parseFloat(reqBody.result) <= reqBody.p2
          ) {
            reqBody.interpretation = "Leve";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) > reqBody.p2 &&
            parseFloat(reqBody.result) <= reqBody.p3
          ) {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) > reqBody.p3 &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Muy alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Peligro final";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "TGP ALT") {
          reqBody.pi = 5.0;
          reqBody.pf = 35.0;
          reqBody.p1 = reqBody.pi + (reqBody.pf - reqBody.pi) / 4;
          reqBody.p2 = reqBody.p1 + (reqBody.pf - reqBody.pi) / 4;
          reqBody.p3 = reqBody.p2 + (reqBody.pf - reqBody.pi) / 4;
          reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
          console.log(reqBody.ideal);
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Peligro inicial";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) < reqBody.p1
          ) {
            reqBody.interpretation = "Saludable";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.p1 &&
            parseFloat(reqBody.result) <= reqBody.p2
          ) {
            reqBody.interpretation = "Leve";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) > reqBody.p2 &&
            parseFloat(reqBody.result) <= reqBody.p3
          ) {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) > reqBody.p3 &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Muy alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Peligro final";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "ACIDO URICO") {
          reqBody.pi = 3.0;
          reqBody.pf = 8.0;
          reqBody.p1 = reqBody.pi + 1.5;
          if (reqBody.sex === "F") {
            reqBody.pi = 2.4;
            reqBody.pf = 7.0;
            reqBody.p1 = reqBody.pi + 1.0;
          }
          reqBody.p2 = 0.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.p1) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Peligro inicial";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) < reqBody.p1
          ) {
            reqBody.interpretation = "Saludable";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.p1 &&
            parseFloat(reqBody.result) <= reqBody.pf
          ) {
            reqBody.interpretation = "Leve";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Peligro final";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else if (reqBody.test === "HEMOGLOBINA") {
          //en g/dl gramos por decilitros
          reqBody.pi = 13.8;
          reqBody.pf = 17.2 - 1; //punto final disminui don en 1
          if (reqBody.sex === "F") {
            reqBody.pi = 12.1;
            reqBody.pf = 15.1 - 2; //punto final disminuido en 2
          }
          reqBody.p1 = 0.0;
          reqBody.p2 = 0.0;
          reqBody.p3 = 0.0;
          reqBody.ideal = (reqBody.pi + reqBody.pf) / 2;
          if (parseFloat(reqBody.result) < reqBody.pi) {
            reqBody.interpretation = "Bajo";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else if (
            parseFloat(reqBody.result) >= reqBody.pi &&
            parseFloat(reqBody.result) < reqBody.pf
          ) {
            reqBody.interpretation = "Normal";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          } else {
            reqBody.interpretation = "Alto";
            await myFunction(
              treatmentRepository,
              reqBody.test,
              reqBody.interpretation
            );
          }
        } else {
          return res.send({ Message: "Enter 'test' type" });
        }

        /*console.log(
          {
            patient1: reqBody.patient,
            patient2: diagnosis[0].patient,
          },

          { sex1: reqBody.sex, sex2: diagnosis[0].sex },
          { test1: reqBody.test, test2: diagnosis[0].test },
          {
            result1: parseFloat(reqBody.result),
            result2: parseInt(diagnosis[0].result.toString()),
          },
          { condition1: reqBody.condition, condition2: diagnosis[0].condition },
          {
            observation1: reqBody.observation,
            observation2: diagnosis[0].observation,
          }
        );*/
        //comparing diagnosis
        if (
          (reqBody.patient !== undefined && reqBody.patient !== diagnosis[0].patient) ||
          (reqBody.sex !== undefined && reqBody.sex !== diagnosis[0].sex) ||
          (reqBody.test !== undefined && reqBody.test !== diagnosis[0].test) ||
          (reqBody.result !== undefined && reqBody.result !== diagnosis[0].result) ||
          (reqBody.treatment !== undefined && reqBody.treatment !== diagnosis[0].treatment) ||
          (reqBody.condition !== undefined && reqBody.condition !== diagnosis[0].condition) ||
          (reqBody.observation !== undefined && reqBody.observation !== diagnosis[0].observation)
        ) {
          //update
          diagnosisRepository.merge(diagnosis[0], req.body);
          const results = await diagnosisRepository.save(diagnosis);
          return res
            .status(201)
            .send({ Message: "Updated succesfully", results: results });
        }
        return res.send({ Message: "No hubo cambios" });
      }
    }
    return res
      .status(400)
      .send({ Message: "The 'diagnosis' does not exist or is deleted" });
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
//delete diagnosis
export const diagnosisRemove = async (req: Request, res: Response) => {
  try {
    const diagnosis: Array<_diagnosis> = await diagnosisRepository.find({
      where: { diagnosis_id: parseInt(req.params.id) },
    });
    if (diagnosis.length > 0) {
      const results = await diagnosisRepository.delete(req.params.id);
      if (results.affected === 1) {
        return res.status(200).send({ Message: "Was successfully removed" });
      }
      return res.send({ Message: "Could not delete" });
    }
    return res
      .status(400)
      .send({ Message: "The 'diagnosis' does not exist or was deleted" });
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
