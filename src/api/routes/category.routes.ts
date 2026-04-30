import { Router } from "express"

import { getAllCategory } from "../controllers/category.controller.ts"
import { getOneCategory } from "../controllers/category.controller.ts";
import { createCategory } from "../controllers/category.controller.ts";
import { updateCategory } from "../controllers/category.controller.ts";
import { deleteCategory } from "../controllers/category.controller.ts";
//import { authMiddleware } from "../middlewares/access.controller.middleware.ts";


const router = Router();

router.get("/",  getAllCategory);
router.get("/:id",  getOneCategory);

router.post("/", createCategory);

router.patch("/:id",  updateCategory)

router.delete("/:id",  deleteCategory)

export default router;
