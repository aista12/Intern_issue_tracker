import { Router } from "express";
import { LabelController } from "../controllers/label.controller";
import { LabelService } from "../services/label.service";
import { LabelRepository } from "../repositories/label.repository";



const router = Router();

const labelRepository = new LabelRepository();
const labelService = new LabelService(labelRepository);
const labelController = new LabelController(labelService);

router.get("/", labelController.getAllLabels);
router.post("/", labelController.createLabel);
router.delete("/:id", labelController.deleteLabel);

export default router;