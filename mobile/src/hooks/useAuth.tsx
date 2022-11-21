import { useContext } from "react";
import { AuthContext, type AuthContextDataProps } from "../contexts/AuthContext";

export function useAuth(): AuthContextDataProps {
	return useContext(AuthContext);
}
