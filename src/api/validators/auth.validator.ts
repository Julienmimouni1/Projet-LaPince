import { z } from "zod";

export const registerSchema = z.object({
  first_name: z.string().min(1, "Le prénom est requis"),
  last_name:  z.string().min(1, "Le nom est requis"),
  photo:      z.string().optional(),
  email:      z.email({ pattern: z.regexes.rfc5322Email }), //This is the regex for canonical email addresses according to RFC 5322
  password:   z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});

