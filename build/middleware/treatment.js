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
exports.treatmentFields = void 0;
const treatmentFields = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let reqBody = req.body;
    //level
    if (reqBody.level !== undefined && reqBody.level.length === 0) {
        return res.status(400).send({
            Message: "El campo 'level' is required.",
        });
    }
    else if (reqBody.test === "LDH/DHL") {
        if (reqBody.level !== "Peligro inicial" &&
            reqBody.level !== "Riesgo inicial" &&
            reqBody.level !== "Saludable" &&
            reqBody.level !== "Riesgo final" &&
            reqBody.level !== "Peligro final") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    else if (reqBody.test === "GLUCOSA") {
        if (reqBody.level !== "Normal" &&
            reqBody.level !== "Alto" &&
            reqBody.level !== "Muy alto") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    else if (reqBody.test === "COL. TOTAL") {
        if (reqBody.level !== "Normal" &&
            reqBody.level !== "Moderado" &&
            reqBody.level !== "Alto") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    else if (reqBody.test === "TRIGLICERIDOS") {
        if (reqBody.level !== "Normal" &&
            reqBody.level !== "Moderado" &&
            reqBody.level !== "Alto" &&
            reqBody.level !== "Muy alto") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    else if (reqBody.test === "UREA" ||
        reqBody.test === "Co2" ||
        reqBody.test === "VCM" ||
        reqBody.test === "HEMOGLOBINA") {
        if (reqBody.level !== "Bajo" &&
            reqBody.level !== "Normal" &&
            reqBody.level !== "Alto") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    else if (reqBody.test === "RDW ADE IDE") {
        if (reqBody.level !== "Bajo" &&
            reqBody.level !== "Normal" &&
            reqBody.level !== "Leve" &&
            reqBody.level !== "Severo") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    else if (reqBody.test === "GGTP" ||
        reqBody.test === "TGO AST" ||
        reqBody.test === "TGP ALT") {
        if (reqBody.level !== "Peligro inicial" &&
            reqBody.level !== "Saludable" &&
            reqBody.level !== "Leve" &&
            reqBody.level !== "Alto" &&
            reqBody.level !== "Muy alto" &&
            reqBody.level !== "Peligro final") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    else if (reqBody.test === "ACIDO URICO") {
        if (reqBody.level !== "Peligro inicial" &&
            reqBody.level !== "Saludable" &&
            reqBody.level !== "Leve" &&
            reqBody.level !== "Peligro final") {
            return res.status(400).send({
                Message: "El nivel no es válido",
            });
        }
    }
    //recip
    if (reqBody.recip !== undefined && reqBody.recip.length > 2083) {
        return res.status(400).send({
            Message: "No more characters are allowed in the 'recip' field.",
        });
    }
    else {
        return next();
    }
});
exports.treatmentFields = treatmentFields;
