import { useOidc } from '@axa-fr/react-oidc';
import { useState } from "react";
import {
  Flex,
  Heading,
  Button,
  Stack, 
  chakra,
  Box
} from "@chakra-ui/react";
import { FaUserAlt, FaLock } from "react-icons/fa";

const CFaUserAlt = chakra(FaUserAlt);
const CFaLock = chakra(FaLock);

const App = () => {
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useOidc();
    const handleShowClick = () => setShowPassword(!showPassword);

    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const handleSubmit = (e:React.SyntheticEvent) => {
        e.preventDefault();
        console.log(email, password);
        setEmail("");
        setPassword("");
        login('/');
    }

  return (
    <Flex flexDirection="column" width="100wh" height="100vh" backgroundColor="black" justifyContent="center" alignItems="center">
      <Stack
        flexDir="column"
        mb="2"
        justifyContent="center"
        alignItems="center"
      >
        <Heading color="cyan.400">Classee Cloud</Heading>
        <Box minW={{ base: "90%", md: "468px" }}>
          <form>
            <Stack spacing={4} p="1rem" backgroundColor="black" boxShadow="md">
              <Button
                borderRadius={0}
                type="submit"
                variant="solid"
                colorScheme="cyan"
                width="full"
                onClick={handleSubmit}>
                Login
              </Button>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default App;
