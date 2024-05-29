import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
} from "typeorm";
export type conditionType = "activo" | "inactivo";
export type sexType = "M" | "F";
export type testType =
  | "LDH/DHL"
  | "GLUCOSA"
  | "COL. TOTAL"
  | "TRIGLICERIDOS"
  | "UREA"
  | "Co2"
  | "VCM"
  | "RDW ADE IDE"
  | "GGTP"
  | "TGO AST"
  | "TGP ALT"
  | "ACIDO URICO"
  | "HEMOGLOBINA";
export type levelType =
  | "Peligro inicial"
  | "Riesgo inicial"
  | "Bajo"
  | "Moderado"
  | "Leve"
  | "Saludable"
  | "Normal"
  | "Alto"
  | "Muy alto"
  | "Severo"
  | "Riesgo final"
  | "Peligro final";

//treatment
@Entity({
  synchronize: true,
  orderBy: {
    treatment_id: "DESC",
    created: "DESC",
  },
})
export class Treatment {
  @PrimaryGeneratedColumn()
  treatment_id!: number;
  @Column({
    type: "enum",
    enum: [
      "LDH/DHL",
      "GLUCOSA",
      "COL. TOTAL",
      "TRIGLICERIDOS",
      "UREA",
      "Co2",
      "VCM",
      "RDW ADE IDE",
      "GGTP",
      "TGO AST",
      "TGP ALT",
      "ACIDO URICO",
      "HEMOGLOBINA",
    ],
    default: "LDH/DHL",
  })
  test!: testType;
  @Column({
    type: "enum",
    enum: [
      "Peligro inicial",
      "Riesgo inicial",
      "Bajo",
      "Moderado",
      "Leve",
      "Saludable",
      "Normal",
      "Alto",
      "Muy alto",
      "Severo",
      "Riesgo final",
      "Peligro final",
    ],
    default: "Saludable",
  })
  level!: levelType;
  @Column({ type: "varchar", nullable: true, length: 2083 })
  recip?: string;
  @CreateDateColumn()
  created!: Date;
  @UpdateDateColumn({ nullable: true })
  updated?: Date;
}
//diagnosis
@Entity({
  synchronize: true,
  orderBy: {
    diagnosis_id: "DESC",
    created: "DESC",
  },
})
export class Diagnosis {
  @PrimaryGeneratedColumn()
  diagnosis_id!: number;
  /*@ManyToOne(() => Patient, (patient) => patient.patient_id)
  patient: Patient; */ 
  @Column({ type: "varchar" })
  patient!: string;
  @Column({ type: "enum", enum: ["F", "M"], default: "F" })
  sex!: sexType;
  @Column({
    type: "enum", enum: ["LDH/DHL", "GLUCOSA", "COL. TOTAL", "TRIGLICERIDOS", "UREA", "Co2",
      "VCM", "RDW ADE IDE", "GGTP", "TGO AST", "TGP ALT", "ACIDO URICO", "HEMOGLOBINA",], default: "LDH/DHL"
  })
  test!: testType;
  @Column({ type: "decimal", precision: 4, scale: 1, default: 0 })
  pi!: number;
  @Column({ type: "decimal", precision: 4, scale: 1, default: 0 })
  p1!: number;
  @Column({ type: "decimal", precision: 4, scale: 1, default: 0 })
  p2!: number;
  @Column({ type: "decimal", precision: 4, scale: 1, default: 0 })
  p3!: number;
  @Column({ type: "decimal", precision: 4, scale: 1, default: 0 })
  pf!: number;
  @Column({ type: "decimal", precision: 4, scale: 1, default: 0 })
  ideal!: number;
  @Column({ type: "varchar" })
  result!: string;
  @Column({ type: "varchar", default: "Saludable" })
  interpretation!: string; 
  @Column({ type: "varchar", nullable: true, length: 2083 })
  treatment?: string;
  @Column({ type: "enum", enum: ["activo", "inactivo"], default: "activo" })
  condition!: conditionType;  
  @Column({ type: "varchar", nullable: true, length: 200 })
  observation?: string;
  @CreateDateColumn()
  created!: Date;
  @UpdateDateColumn({ nullable: true })
  updated?: Date;
}
