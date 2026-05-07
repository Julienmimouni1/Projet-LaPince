import { Outlet } from "react-router-dom";
import LogoutButton from "../Logout/LogoutButton";
import { useAuth } from "../../context/AuthContext";

export default function PrivateLayout() {
  const { user } = useAuth();

  const avatar = (size: string) => (
    <div
      className={`${size} rounded-full border-2 border-white shadow-lg overflow-hidden shrink-0`}
    >
      <img
        src={user?.photo ?? "/WEBP/Desktop/Lapince-Profil-Picture-Desktop.webp"}
        className="w-full h-full object-cover"
        alt="Photo de profil"
      />
    </div>
  );

  const namePill = (textSize: string, px: string, py: string) => (
    <div
      className={`bg-white/80 backdrop-blur-sm rounded-full ${px} ${py} text-[#002b49] font-bold ${textSize} whitespace-nowrap shadow-sm`}
    >
      {user?.first_name} {user?.last_name}
    </div>
  );

  return (
    <>
      {/* MOBILE < md : déconnexion en haut, avatar + nom côte à côte en dessous */}
      <div className="md:hidden fixed top-4 right-4 z-[60] flex flex-col items-end gap-2">
        <LogoutButton />
        <div className="flex items-center gap-2">
          {avatar("w-9 h-9")}
          {namePill("text-xs", "px-4", "py-2")}
        </div>
      </div>

      {/* TABLETTE md → lg : avatar moyen + nom, position ajustée */}
      <div className="hidden md:flex lg:hidden fixed top-6 right-40 z-[60] items-center gap-3">
        {avatar("w-12 h-12")}
        {namePill("text-xs", "px-4", "py-2")}
      </div>
      <div className="hidden md:block lg:hidden fixed top-6 right-4 z-[60]">
        <LogoutButton />
      </div>

      {/* DESKTOP lg+ : grand avatar + nom, déconnexion tout à droite */}
      <div className="hidden lg:flex fixed top-10 right-50 z-[60] items-center gap-4">
        {avatar("w-16 h-16")}
        {namePill("text-sm", "px-6", "py-2.5")}
      </div>
      <div className="hidden lg:block fixed top-10 right-6 z-[60]">
        <LogoutButton />
      </div>

      <Outlet />
    </>
  );
}
