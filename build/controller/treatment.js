"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.treatmentRemove = exports.treatmentEdit = exports.treatmentCreate = exports.treatmentOne = exports.treatmentAll = void 0;
const NutrigeneticsEntity_1 = require("../entity/NutrigeneticsEntity");
const dataSource_1 = require("../dataSource");
const treatmentRepository = dataSource_1.myDataSource.getRepository(NutrigeneticsEntity_1.Treatment);
//get treatment all
const treatmentAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const treatment = yield treatmentRepository.find();
        if (treatment.length > 0) {
            return res.status(200).send({ Message: "OK", results: treatment });
        }
        else {
            return res.status(404).send({ Message: "No data" });
        }
    }
    catch (error) {
        return res.send(error.sqlMessage);
    }
});
exports.treatmentAll = treatmentAll;
//get treatment one
const treatmentOne = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const treatment = yield treatmentRepository.find({
            where: { treatment_id: parseInt(req.params.id) },
        });
        if (treatment.length > 0) {
            return res.status(200).send({ Message: "OK", results: treatment });
        }
        return res.status(404).send({ Message: "The 'treatment' does not exist" });
    }
    catch (error) {
        return res.send(error.sqlMessage);
    }
});
exports.treatmentOne = treatmentOne;
//post treatment
const treatmentCreate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reqBody = req.body;
        //find by test and level
        const testAndLevelExists = yield treatmentRepository
            .createQueryBuilder("treatment")
            .where("treatment.test=:test", { test: reqBody.test })
            .andWhere("treatment.level=:level", { level: reqBody.level })
            .getOne();
        if (testAndLevelExists !== null) {
            return res
                .status(409)
                .send({ Message: "The 'test' already has that 'level'!" });
        }
        else {
            reqBody.updated = new Date("");
            const newTreatment = treatmentRepository.create(req.body);
            const results = yield treatmentRepository.save(newTreatment);
            return res
                .status(201)
                .send({ Message: "Successfull created", results: results });
        }
    }
    catch (error) {
        return res.send(error.sqlMessage);
    }
});
exports.treatmentCreate = treatmentCreate;
//edit treatment
const treatmentEdit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let reqBody = req.body;
        const treatment = yield treatmentRepository.find({
            where: { treatment_id: parseInt(req.params.id) },
        });
        if (treatment.length > 0) {
            //find by test and patient and diferent id
            const testAndLevelExists = yield treatmentRepository
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
            }
            else {
                //comparing treatment
                if ((reqBody.test !== undefined && reqBody.test !== treatment[0].test) ||
                    (reqBody.level !== undefined && reqBody.level !== treatment[0].level) ||
                    (reqBody.recip !== undefined && reqBody.recip !== treatment[0].recip)) {
                    //update
                    treatmentRepository.merge(treatment[0], req.body);
                    const results = yield treatmentRepository.save(treatment);
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
    }
    catch (error) {
        return res.send(error.sqlMessage);
    }
});
exports.treatmentEdit = treatmentEdit;
//delete treatment
const treatmentRemove = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const treatment = yield treatmentRepository.find({
            where: { treatment_id: parseInt(req.params.id) },
        });
        if (treatment.length > 0) {
            const results = yield treatmentRepository.delete(req.params.id);
            if (results.affected === 1) {
                return res.status(200).send({ Message: "Was successfully removed" });
            }
            return res.send({ Message: "Could not delete" });
        }
        return res
            .status(400)
            .send({ Message: "The 'treatment' does not exist or was deleted" });
    }
    catch (error) {
        return res.send(error.sqlMessage);
    }
});
exports.treatmentRemove = treatmentRemove;
