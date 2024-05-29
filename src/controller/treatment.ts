import { Request, Response } from "express";
import { Treatment } from "../entity/NutrigeneticsEntity";
import { myDataSource } from "../dataSource";
import { _diagnosis, _treatment } from "../interface/interface";


const treatmentRepository = myDataSource.getRepository(Treatment);

//get treatment all
export const treatmentAll = async (req: Request, res: Response) => {
  try {
    const treatment: Array<_treatment> = await treatmentRepository.find();
    if (treatment.length > 0) {
      return res.status(200).send({ Message: "OK", results: treatment });
    } else {
      return res.status(404).send({ Message: "No data" });
    }
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
//get treatment one
export const treatmentOne = async (req: Request, res: Response) => {
  try {
    const treatment: Array<_treatment> = await treatmentRepository.find({
      where: { treatment_id: parseInt(req.params.id) },
    });
    if (treatment.length > 0) {
      return res.status(200).send({ Message: "OK", results: treatment });
    }
    return res.status(404).send({ Message: "The 'treatment' does not exist" });
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};

//post treatment
export const treatmentCreate = async (req: Request, res: Response) => {
  try {
    let reqBody: _treatment = req.body;
    //find by test and level
    const testAndLevelExists: object | null = await treatmentRepository
      .createQueryBuilder("treatment")
      .where("treatment.test=:test", { test: reqBody.test })
      .andWhere("treatment.level=:level", { level: reqBody.level })
      .getOne();

    if (testAndLevelExists !== null) {
      return res
        .status(409)
        .send({ Message: "The 'test' already has that 'level'!" });
    } else {
      reqBody.updated = new Date("");
      const newTreatment: object = treatmentRepository.create(req.body);
      const results: object = await treatmentRepository.save(newTreatment);
      return res
        .status(201)
        .send({ Message: "Successfull created", results: results });
    }
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
//edit treatment
export const treatmentEdit = async (req: Request, res: Response) => {
  try {
    let reqBody: _treatment = req.body;
    const treatment: Array<_treatment> | undefined =
      await treatmentRepository.find({
        where: { treatment_id: parseInt(req.params.id) },
      });

    if (treatment.length > 0) {
      //find by test and patient and diferent id
      const testAndLevelExists: object | null = await treatmentRepository
        .createQueryBuilder("treatment")
        .where("treatment.test=:test", { test: reqBody.test })
        .andWhere("treatment.level=:level", { level: reqBody.level })
        .andWhere("treatment.treatment_id!=:treatment_id", {
          treatment_id: req.params.id,
        })
        .getOne();

      if (testAndLevelExists !== null) {
        return res
          .status(409)
          .send({ Message: "The 'test' already has that 'level'!!" });
      } else {
        //comparing treatment
        if (
          (reqBody.test !== undefined && reqBody.test !== treatment[0].test) ||
          (reqBody.level !== undefined && reqBody.level !== treatment[0].level) ||
          (reqBody.recip !== undefined && reqBody.recip !== treatment[0].recip)
        ) {
          //update
          treatmentRepository.merge(treatment[0], req.body);
          const results = await treatmentRepository.save(treatment);
          return res
            .status(201)
            .send({ Message: "Updated succesfully", results: results });
        }
        return res.send({ Message: "No hubo cambios" });
      }
    }
    return res
      .status(400)
      .send({ Message: "The 'treatment' does not exist or is deleted" });
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
//delete treatment
export const treatmentRemove = async (req: Request, res: Response) => {
  try {
    const treatment: Array<_treatment> = await treatmentRepository.find({
      where: { treatment_id: parseInt(req.params.id) },
    });
    if (treatment.length > 0) {
      const results = await treatmentRepository.delete(req.params.id);
      if (results.affected === 1) {
        return res.status(200).send({ Message: "Was successfully removed" });
      }
      return res.send({ Message: "Could not delete" });
    }
    return res
      .status(400)
      .send({ Message: "The 'treatment' does not exist or was deleted" });
  } catch (error: any) {
    return res.send(error.sqlMessage);
  }
};
