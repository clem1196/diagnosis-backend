import { Router } from "express";
/* CONTROLLERS*/
import { diagnosisOne, diagnosisCreate, diagnosisEdit, diagnosisRemove, diagnosisAll } from "../controller/diagnosis";
import { diagnosisFields } from "../middleware/diagnosis";
import { treatmentAll, treatmentCreate, treatmentEdit, treatmentOne, treatmentRemove } from "../controller/treatment";
import { treatmentFields } from "../middleware/treatment";



const router = Router();

//paths diagnosis
router.get("/diagnosis", diagnosisAll);
router.get("/diagnosis/:id", diagnosisOne);
router.post("/diagnosis", diagnosisFields, diagnosisCreate);
router.put("/diagnosis/:id", diagnosisFields, diagnosisEdit);
router.delete("/diagnosis/:id", diagnosisRemove);
//paths treatment
router.get("/treatment", treatmentAll);
router.get("/treatment/:id", treatmentOne);
router.post("/treatment", treatmentFields, treatmentCreate);
router.put("/treatment/:id", treatmentFields, treatmentEdit);
router.delete("/treatment/:id", treatmentRemove);

export default router;
