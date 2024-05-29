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
exports.diagnosisFields = void 0;
const class_validator_1 = require("class-validator");
const dataSource_1 = require("../dataSource");
const NutrigeneticsEntity_1 = require("../entity/NutrigeneticsEntity");
const treatmentRepository = dataSource_1.myDataSource.getRepository(NutrigeneticsEntity_1.Treatment);
//const diagnosisRepository=myDataSource.getRepository(Diagnosis)
const namesRegex = /^[A-ZÑa-zñáéíóúÁÉÍÓÚ'° ]{2,36}$/; /*solo letras y espacios*/
const diagnosisFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let reqBody = req.body;
    //patient
    if (reqBody.patient === undefined || reqBody.patient.length === 0) {
        return res.status(400).send({ Message: "El 'paciente' es requerido" });
    }
    else if (!(0, class_validator_1.isNumber)(parseInt(reqBody.patient)) &&
        !namesRegex.test(reqBody.patient)) {
        return res.status(400).send({
            Message: "Ingrese en 'paciente' solo letras y espacios mínimo 2 o máximo 36 caracteres.",
        });
    }
    else if ((0, class_validator_1.isNumber)(parseInt(reqBody.patient)) &&
        reqBody.patient.length !== 8) {
        return res.status(400).send({
            Message: "Ingrese en 'paciente' numeros de 8 digitos.",
        });
    }
    //test
    else if (reqBody.test === undefined || reqBody.test.length === 0) {
        return res.status(400).send({
            Message: "El campo 'test' es requerido.",
        });
    }
    else if (reqBody.test !== undefined &&
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
        reqBody.test !== "VCM") {
        return res.status(400).send({
            Message: "Ingrese un 'test' válido.",
        });
    }
    //sex
    else if (reqBody.sex !== undefined &&
        reqBody.sex.length > 0 &&
        reqBody.sex !== "F" &&
        reqBody.sex !== "M") {
        return res.status(400).send({ Message: "El campo 'sex' no es válido" });
    }
    //result
    else if (reqBody.result === undefined || reqBody.result.length === 0) {
        return res.status(400).send({
            Message: "el campo 'result' es requerido.",
        });
    }
    else if (!(0, class_validator_1.isNumber)(parseFloat(reqBody.result))) {
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
    else if (reqBody.condition !== undefined &&
        reqBody.condition.length > 0 &&
        reqBody.condition !== "activo" &&
        reqBody.condition !== "inactivo") {
        return res.status(400).send({ Message: "La 'condición' no es válido" });
    }
    //observation
    else if (reqBody.observation !== undefined &&
        reqBody.observation.length > 200) {
        return res.status(400).send({
            Message: "No more characters are allowed in the 'observation' field.",
        });
    }
    else {
        return next();
    }
});
exports.diagnosisFields = diagnosisFields;
