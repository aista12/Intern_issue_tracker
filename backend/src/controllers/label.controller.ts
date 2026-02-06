import { Request, Response } from "express";
import { LabelService } from "../services/label.service";


export class LabelController {
    private labelService: LabelService;

    constructor(labelService: LabelService) {
        this.labelService = labelService;
    }

    getAllLabels = async (req: Request, res: Response) => {
        const labels = await this.labelService.getAllLabels();
        res.status(200).json(labels);
    };

    createLabel = async (req: Request, res: Response) => {
        const { name, color } = req.body;

        if (
            typeof name !== "string" ||
            name.trim().length < 1 ||
            name.trim().length > 15
        ) {
            return res
                .status(400)
                .json({ error: { message: "Invalid name" } });
        }
        if (
            typeof color !== "string" ||
            !/^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)
        ) {
            return res
                .status(400)
                .json({ error: { message: "Invalid color" } });
        }

        const label = await this.labelService.createLabel(
            name,
            color,
        );
        res.status(200).json(label);
    };

    deleteLabel = async (req: Request<{ id: string }>, res: Response) => {
        try {
            await this.labelService.deleteLabel(req.params.id);
            return res.status(204).send();
        } catch (e: any) {
            return res.status(e.status ?? 500).json({
            error: {
                message: e.message ?? "Internal error",
                used: e.used,
            },
            });
        }
    };
}
