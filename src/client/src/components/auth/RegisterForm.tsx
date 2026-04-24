import type { RegisterFormData, ApiError } from '../../types/auth'

// On déclare une interface TypeScript qui décrit les "props" attendues par le composant.
// Les props, c'est ce que le composant parent (RegisterPage) peut lui passer.
interface RegisterFormProps {

  // onSubmit est une prop OPTIONNELLE (le ? signifie qu'elle peut ne pas être fournie).
  // Si elle est fournie, c'est une FONCTION qui :
  //   - prend en paramètre "data" de type RegisterFormData (les 4 champs du formulaire)
  //   - ne retourne rien (void)
  // Concrètement : quand l'utilisateur valide le formulaire, RegisterForm appellera cette fonction en lui passant les données saisies.
  onSubmit?: (data: RegisterFormData) => void
  isLoading : boolean
  error : ApiError | null

}
// On déclare le composant RegisterForm.
// Entre les accolades { onSubmit }, on "destructure" les props :
// au lieu d'écrire props.onSubmit partout dans le composant,
// on extrait directement onSubmit depuis l'objet props.
// ": RegisterFormProps" dit à TypeScript que les props doivent respecter l'interface qu'on vient de définir au-dessus.
export default function RegisterForm({ onSubmit, isLoading, error }: RegisterFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      const data: RegisterFormData = {
        first_name: formData.get('first_name') as string,
        last_name: formData.get('last_name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string
      };
      onSubmit?.(data);
    }}>
      <div>
        <label htmlFor="first_name">Prénom</label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          placeholder="Votre prénom"
        />
      </div>

      <div>
        <label htmlFor="last_name">Nom</label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          placeholder="Votre nom"
        />
      </div>

      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="votre@email.com"
        />
      </div>

      <div>
        <label htmlFor="password">Mot de passe</label>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
        />
      </div>

      <button type="submit">Créer mon compte</button>
      {isLoading && <p>Chargement...</p>} // Affiche "Chargement..." pendant que l'appel API est en cours
      {error && <p style={{ color: 'red' }}>{error.message}</p>} // Affiche le message d'erreur en rouge si une erreur est présente
    </form>
  )
}