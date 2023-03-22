import { OidcProvider, OidcSecure, useOidcUser } from "@axa-fr/react-oidc";
import React, { useEffect } from "react";

import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import DashboardController, {
  ClasseCloudDecodedToken,
  DashboardControllerContext
} from "../classes/DashboardController";
import HomePage from "../components/HomePage";
import { Configuration } from "./Configuration";

const LoggedIn = () => {
  const oidcUser = useOidcUser();
  const [dashboardController, setDashboardController] =
    React.useState<DashboardController>();
  useEffect(() => {
    if (!dashboardController) {
      if (oidcUser.oidcUserLoadingState === "User loaded") {
        setDashboardController(
          new DashboardController({
            userProfile:
              oidcUser.oidcUser as unknown as ClasseCloudDecodedToken,
          }));
      } else {
        setDashboardController(undefined);
      }
    }
  }, [oidcUser, dashboardController]);
  if (!dashboardController) {
    return <div>Loading...</div>;
  }
  return (
    <DashboardControllerContext.Provider value={dashboardController}>
      <HomePage />
    </DashboardControllerContext.Provider>
  );
};

function AuthPage() {
  return (
    <OidcProvider configuration={Configuration}>
      <BrowserRouter>
        <ChakraProvider>
          <OidcSecure>
            <LoggedIn />
          </OidcSecure>
        </ChakraProvider>
      </BrowserRouter>
    </OidcProvider>
  );
}

export default AuthPage;
