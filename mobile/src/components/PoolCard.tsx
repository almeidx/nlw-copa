import { Heading, HStack, Text, VStack } from "native-base";
import { TouchableOpacity, type TouchableOpacityProps } from "react-native";
import { Participants, type ParticipantProps } from "./Participants";

export interface PoolCardPros {
	_count: {
		participants: number;
	};
	code: string;
	createdAt: string;
	id: string;
	owner: {
		name: string;
	};
	ownerId: string;
	participants: ParticipantProps[];
	title: string;
}

interface Props extends TouchableOpacityProps {
	data: PoolCardPros;
}

export function PoolCard({ data, ...rest }: Props) {
	return (
		<TouchableOpacity {...rest}>
			<HStack
				w="full"
				h={20}
				bgColor="gray.800"
				borderBottomWidth={3}
				borderBottomColor="yellow.500"
				justifyContent="space-between"
				alignItems="center"
				rounded="sm"
				mb={3}
				p={4}
			>
				<VStack>
					<Heading color="white" fontSize="md" fontFamily="heading">
						{data.title}
					</Heading>

					<Text color="gray.200" fontSize="xs">
						Criado por {data.owner.name}
					</Text>
				</VStack>

				<Participants count={data._count.participants} participants={data.participants} />
			</HStack>
		</TouchableOpacity>
	);
}
