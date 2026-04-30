import type { Request, Response } from "express"
import { prisma } from "../lib/prisma.js";


//recupérer toutes les catégories
export async function getAllCategory(req:Request, res: Response ) {

  try {
    // recupère le paramètre "default" dans l'URL (?default = true)
    const isDefault = req.query.default === "true";
    const id_user = req.query.id_user ? Number(req.query.id_user) : undefined;

// personnalisation des catégories pour les utilisateurs
    const categories = await prisma.category.findMany({
    where:isDefault
        ? { is_default: true }
        : {
             OR:  [
              { is_default: true },
              ...(id_user ? [{ id_user }] : []),
            ],
          },
    });


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

export async function createCategory(req: Request, res: Response) {
  const { name, color, icon, type, is_default, id_user } = req.body;

  try {
    const category = await prisma.category.create({
      data: {
        name,
        color,
        icon,
        type,
        is_default,
        id_user, 
      },
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur création catégorie",
    });
  }
}

export async function updateCategory(req: Request, res: Response) {
  const { id } = req.params;

  try {
    const updated = await prisma.category.update({
      where: { id: Number(id) },
      data: req.body, 
    });

    return res.json(updated);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur update catégorie",
    });
  }
}

export async function deleteCategory(req: Request, res: Response) {
const { id } = req.params;

try {
    // 1. récupérer la catégorie en base
    const category = await prisma.category.findUnique({
    where: {
        id: Number(id),
    },
    });

    // 2. vérifier si elle existe
    if (!category) {
    return res.status(404).json({
        message: "Catégorie introuvable",
    });
    }

    // 3. bloquer si c'est une catégorie par défaut
    if (category.is_default === true) {
    return res.status(403).json({
        message: "Suppression non autorisée",
    });
    }

    // 4. supprimer la catégorie
    await prisma.category.delete({
    where: {
        id: Number(id),
    },
    });

    return res.sendStatus(204);
  } catch (error) {
    return res.status(500).json({
      message: "Erreur lors de la suppression de la catégorie",
    });
  }
}
