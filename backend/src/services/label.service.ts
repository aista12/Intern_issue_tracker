import { LabelRepository } from "../repositories/label.repository";
import { Label } from "../types";
import { count } from "node:console";

export class LabelService {
    private label: LabelRepository;

    constructor(labelRepository: LabelRepository) {
        this.label = labelRepository;
    }



    async getAllLabels(): Promise<Label[]> {
        return await this.label.findAll();
    }

    async createLabel(name: string, color: string): Promise<Label> {
        const finalName = name.trim();
        return await this.label.createLabel(finalName, color);   
    }

    async deleteLabel(id: string): Promise<void> {
        const used =  await this.label.getUsageCount(id);
        if (used > 0) {
          throw {
            status: 409,
            message: "cant delete this label, it is used in some issues",
            used
          }
        }
        await this.label.deleteById(id)
    }

}