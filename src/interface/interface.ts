import {
  sexType,
  conditionType,  
  testType,
  levelType,
} from "../entity/NutrigeneticsEntity";
//treatment

export class _treatment {
  treatment_id!: number;   
  test!: testType;   
  level!: levelType;    
  recip?: string;
  created!: Date;
  updated?: Date;
}
//diagnosis

export class _diagnosis {
  diagnosis_id!: number;
  /* patient:_patient */
  patient!: string;
  sex!: sexType;
  test!: testType;
  pi!: number;
  p1!: number;
  p2!: number;
  p3!: number;
  pf!: number;
  ideal!: number;
  result!: string;  
  interpretation!: string;
  treatment?:string;  
  condition!: conditionType;
  observation?: string;
  created!: Date;
  updated?: Date;
}

