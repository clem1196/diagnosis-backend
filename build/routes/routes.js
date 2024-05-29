"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
/* CONTROLLERS*/
const diagnosis_1 = require("../controller/diagnosis");
const diagnosis_2 = require("../middleware/diagnosis");
const treatment_1 = require("../controller/treatment");
const treatment_2 = require("../middleware/treatment");
const router = (0, express_1.Router)();
//paths diagnosis
router.get("/diagnosis", diagnosis_1.diagnosisAll);
router.get("/diagnosis/:id", diagnosis_1.diagnosisOne);
router.post("/diagnosis", diagnosis_2.diagnosisFields, diagnosis_1.diagnosisCreate);
router.put("/diagnosis/:id", diagnosis_2.diagnosisFields, diagnosis_1.diagnosisEdit);
router.delete("/diagnosis/:id", diagnosis_1.diagnosisRemove);
//paths treatment
router.get("/treatment", treatment_1.treatmentAll);
router.get("/treatment/:id", treatment_1.treatmentOne);
router.post("/treatment", treatment_2.treatmentFields, treatment_1.treatmentCreate);
router.put("/treatment/:id", treatment_2.treatmentFields, treatment_1.treatmentEdit);
router.delete("/treatment/:id", treatment_1.treatmentRemove);
exports.default = router;
