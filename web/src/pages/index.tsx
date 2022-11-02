import type { GetServerSideProps, InferGetServerSidePropsType } from "next";
import Image from "next/image";
import { useRef, type FormEvent } from "react";
import appPreviewImg from "../assets/app-nlw-copa-preview.png";
import iconCheckSvg from "../assets/icon-check.svg";
import logoSvg from "../assets/logo.svg";
import usersAvatarExampleImg from "../assets/users-avatar-example.png";
import { API_BASE_URL } from "../utils/constants";

interface HomeProps {
	guessCount: number;
	poolCount: number;
	userCount: number;
}

async function fetchWrapper<T>(url: string): Promise<T> {
	const response = await fetch(API_BASE_URL + url);
	return response.json() as Promise<T>;
}

export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
	const [{ count: poolCount }, { count: guessCount }, { count: userCount }] = await Promise.all([
		fetchWrapper<{ count: number }>("/guesses/count"),
		fetchWrapper<{ count: number }>("/pools/count"),
		fetchWrapper<{ count: number }>("/users/count"),
	]);

	return {
		props: {
			guessCount,
			poolCount,
			userCount,
		},
	};
};

export default function Home({
	guessCount,
	poolCount,
	userCount,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const titleInputRef = useRef<HTMLInputElement>(null);

	async function onPoolCreate(event: FormEvent) {
		event.preventDefault();

		if (!titleInputRef.current) return;

		const title = titleInputRef.current.value;

		const response = await fetch(API_BASE_URL + "/pools", {
			body: JSON.stringify({ title }),
			headers: { "Content-Type": "application/json" },
			method: "POST",
		});

		const data = (await response.json()) as { code: string };

		if (!response.ok) {
			console.error(data as unknown);

			alert("Failed to create pool. Please, try again later.");
			return;
		}

		await navigator.clipboard.writeText(data.code);

		// eslint-disable-next-line require-atomic-updates
		titleInputRef.current.value = "";

		alert("Pool created. Code copied to clipboard.");
	}

	return (
		<div className="max-w-[1124px] mx-auto gap-28 grid grid-cols-2 items-center h-screen">
			<main>
				<Image alt="NLW Cup logo" quality={100} src={logoSvg} />

				<h1 className="mt-14 text-white text-5xl font-bold leading-tight">
					Create your own cup pool and share it with friends!
				</h1>

				<div className="mt-10 flex items-center gap-2">
					<Image alt="Examples of user avatars" quality={100} src={usersAvatarExampleImg} />

					<strong className="text-gray-100 text-xl">
						<span className="text-ignite-500">+{userCount}</span> people are already using it
					</strong>
				</div>

				<form className="mt-10 flex gap-2" onSubmit={onPoolCreate}>
					<input
						className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100"
						placeholder="What is the name of your pool?"
						ref={titleInputRef}
						required
						type="text"
					/>
					<button
						className="bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700"
						type="submit"
					>
						Create my pool
					</button>
				</form>

				<p className="mt-4 text-sm text-gray-300 leading-relaxed">
					After creating your pool, you will receive a unique code that you can use to invite others 🚀
				</p>

				<div className="mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100">
					<div className="flex items-center gap-6">
						<Image alt="Checkmark icon" src={iconCheckSvg} />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{poolCount}</span>
							<span>Pools created</span>
						</div>
					</div>

					<hr className="w-px h-14 bg-gray-600" />

					<div className="flex items-center gap-6">
						<Image alt="Checkmark icon" src={iconCheckSvg} />
						<div className="flex flex-col">
							<span className="font-bold text-2xl">+{guessCount}</span>
							<span>Guesses sent</span>
						</div>
					</div>
				</div>
			</main>

			<Image
				alt="Two cell phones showing a preview of the NLW Cup mobile application"
				quality={100}
				src={appPreviewImg}
			/>
		</div>
	);
}
