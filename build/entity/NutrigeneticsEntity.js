"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Diagnosis = exports.Treatment = void 0;
const typeorm_1 = require("typeorm");
//treatment
let Treatment = class Treatment {
};
exports.Treatment = Treatment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Treatment.prototype, "treatment_id", void 0);
__decorate([
    (0, typeorm_1.Column)({
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
    }),
    __metadata("design:type", String)
], Treatment.prototype, "test", void 0);
__decorate([
    (0, typeorm_1.Column)({
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
    }),
    __metadata("design:type", String)
], Treatment.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true, length: 2083 }),
    __metadata("design:type", String)
], Treatment.prototype, "recip", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Treatment.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], Treatment.prototype, "updated", void 0);
exports.Treatment = Treatment = __decorate([
    (0, typeorm_1.Entity)({
        synchronize: true,
        orderBy: {
            treatment_id: "DESC",
            created: "DESC",
        },
    })
], Treatment);
//diagnosis
let Diagnosis = class Diagnosis {
};
exports.Diagnosis = Diagnosis;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Diagnosis.prototype, "diagnosis_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], Diagnosis.prototype, "patient", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["F", "M"], default: "F" }),
    __metadata("design:type", String)
], Diagnosis.prototype, "sex", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum", enum: ["LDH/DHL", "GLUCOSA", "COL. TOTAL", "TRIGLICERIDOS", "UREA", "Co2",
            "VCM", "RDW ADE IDE", "GGTP", "TGO AST", "TGP ALT", "ACIDO URICO", "HEMOGLOBINA",], default: "LDH/DHL"
    }),
    __metadata("design:type", String)
], Diagnosis.prototype, "test", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Diagnosis.prototype, "pi", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Diagnosis.prototype, "p1", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Diagnosis.prototype, "p2", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Diagnosis.prototype, "p3", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Diagnosis.prototype, "pf", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "decimal", precision: 4, scale: 1, default: 0 }),
    __metadata("design:type", Number)
], Diagnosis.prototype, "ideal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], Diagnosis.prototype, "result", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", default: "Saludable" }),
    __metadata("design:type", String)
], Diagnosis.prototype, "interpretation", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true, length: 2083 }),
    __metadata("design:type", String)
], Diagnosis.prototype, "treatment", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "enum", enum: ["activo", "inactivo"], default: "activo" }),
    __metadata("design:type", String)
], Diagnosis.prototype, "condition", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: true, length: 200 }),
    __metadata("design:type", String)
], Diagnosis.prototype, "observation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Diagnosis.prototype, "created", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ nullable: true }),
    __metadata("design:type", Date)
], Diagnosis.prototype, "updated", void 0);
exports.Diagnosis = Diagnosis = __decorate([
    (0, typeorm_1.Entity)({
        synchronize: true,
        orderBy: {
            diagnosis_id: "DESC",
            created: "DESC",
        },
    })
], Diagnosis);
