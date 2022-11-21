import * as AuthSessions from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import { createContext, useState, useEffect, type ReactNode } from "react";
import { api } from "../services/api";

WebBrowser.maybeCompleteAuthSession();

interface UserProps {
	avatarUrl: string;
	name: string;
}

export interface AuthContextDataProps {
	isUserLoading: boolean;
	singIn(): Promise<void>;
	user: UserProps;
}

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
	const [isUserLoading, setIsUserLoading] = useState(false);
	const [user, setUser] = useState<UserProps>({} as UserProps);

	const [_request, response, promptAsync] = Google.useAuthRequest({
		clientId: process.env.CLIENT_ID,
		redirectUri: AuthSessions.makeRedirectUri({ useProxy: true }),
		scopes: ["profile", "email"],
	});

	async function singIn() {
		try {
			setIsUserLoading(true);
			await promptAsync();
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsUserLoading(false);
		}
	}

	async function singInWithGoogle(access_token: string) {
		try {
			setIsUserLoading(true);

			const tokenResponse = await api.post("/users", { access_token });
			api.defaults.headers.common.Authorization = `Bearer ${tokenResponse.data.token}`;

			const userInfoResponse = await api.get("/me");
			setUser(userInfoResponse.data.user);
		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsUserLoading(false);
		}
	}

	useEffect(() => {
		if (response?.type === "success" && response.authentication?.accessToken) {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			singInWithGoogle(response.authentication.accessToken);
		}
	}, [response]);

	return <AuthContext.Provider value={{ singIn, isUserLoading, user }}>{children}</AuthContext.Provider>;
}
