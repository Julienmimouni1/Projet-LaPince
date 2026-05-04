import { Router } from "express"

import { getAllCategory, getOneCategory } from "../controllers/category.controller.ts"


//import { authMiddleware } from "../middlewares/access.controller.middleware.ts";


const router = Router();

router.get("/",  getAllCategory);
router.get("/:id",  getOneCategory);



export default router;
