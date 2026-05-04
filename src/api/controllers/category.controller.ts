import type { Request, Response } from "express"
import { prisma } from "../lib/prisma.js";


//recupérer toutes les catégories
export async function getAllCategory(req:Request, res: Response ) {

  try {

    const categories = await prisma.category.findMany();
   
 //retourne la liste de catégories  
    return res.status(200).json(categories);
        
  } catch (error) {
   
    //retourne une erreur si echec
    return res.status(500).json({
      message: "Erreur lors de la récupération des catégories",
    });
  }; 
}

//récuperer une catégorie
export async function getOneCategory(req:Request, res: Response) {

try {

// recupère le paramètre "id" dans l'URL
    const { id } = req.params;

    const categoryId = Number(id); // conversion en nombre 

    if (isNaN(categoryId)) { // verification de la conversion , si elle a échoué
      return res.status(400).json({ // erreur 400 si ce n'est pas un nombre valide 
        message: "ID invalide"
      });
    }

    const oneCategory = await prisma.category.findUnique({
    where: {
        id: categoryId
      },
    });

    if (!oneCategory) {
    return res.status(404).json({
        message: "Catégorie introuvable",
    });
    }

    //retourne la catégorie demandée
    return res.status(200).json(oneCategory);

}   catch (error) {
  console.error("GET ONE CATEGORY ERROR:", error);


    //gestion des erreurs serveurs
    return res.status(500).json({
        message: " Erreur lors de la récupération d'une catégorie"
    })
}
}

