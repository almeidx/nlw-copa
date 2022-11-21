import { FlatList, useToast } from "native-base";
import { useEffect, useState } from "react";
import { Game, type GameProps } from "../components/Game";
import { api } from "../services/api";
import { EmptyMyPoolList } from "./EmptyMyPoolList";
import { Loading } from "./Loading";

interface Props {
	code: string;
	poolId: string;
}

export function Guesses({ poolId, code }: Props) {
	const [isLoading, setIsLoading] = useState(true);
	const [games, setGames] = useState<GameProps[]>([]);
	const [firstTeamPoints, setFirstTeamPoints] = useState("");
	const [secondTeamPoints, setSecondTeamPoints] = useState("");

	const toast = useToast();

	async function fetchGames() {
		try {
			setIsLoading(true);

			const response = await api.get(`/pools/${poolId}/games`);
			setGames(response.data.games);
		} catch {
			toast.show({
				title: "Não foi possível listar os jogos",
				placement: "top",
				bgColor: "red.500",
			});
		} finally {
			setIsLoading(false);
		}
	}

	async function handleGuessConfirm(gameId: string) {
		try {
			if (!firstTeamPoints.trim() || !secondTeamPoints.trim()) {
				return toast.show({
					title: "Informe o placar para palpitar",
					placement: "top",
					bgColor: "red.500",
				});
			}

			await api.post(`/pools/${poolId}/games/${gameId}/guesses`, {
				firstTeamPoints: Number(firstTeamPoints),
				secondTeamPoints: Number(secondTeamPoints),
			});

			toast.show({
				title: "Palpite realizado com sucesso!",
				placement: "top",
				bgColor: "green.500",
			});

			await fetchGames();
		} catch (error) {
			console.log(error);

			toast.show({
				title: "Não foi possível enviar o palpite",
				placement: "top",
				bgColor: "red.500",
			});
		}
	}

	useEffect(() => {
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		fetchGames();
	}, []);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<FlatList
			data={games}
			keyExtractor={(item) => item.id}
			renderItem={({ item }) => (
				<Game
					data={item}
					setFirstTeamPoints={setFirstTeamPoints}
					setSecondTeamPoints={setSecondTeamPoints}
					onGuessConfirm={async () => handleGuessConfirm(item.id)}
				/>
			)}
			_contentContainerStyle={{ pb: 10 }}
			ListEmptyComponent={() => <EmptyMyPoolList code={code} />}
		/>
	);
}
