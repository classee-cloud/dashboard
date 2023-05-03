import React, { useEffect } from "react";
import { OidcProvider, OidcSecure, useOidcUser } from "@axa-fr/react-oidc";

import HomePage from "../components/HomePage";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { Configuration } from "./Configuration";
import DashboardController, {
  ClasseCloudDecodedToken,
  DashboardControllerContext,
} from "../classes/DashboardController";

// function to handle login using oidc
const LoggedIn = () => {
  const oidcUser = useOidcUser();
  const [dashboardController, setDashboardController] = React.useState<DashboardController>();

  useEffect(() => {
    if (oidcUser.oidcUserLoadingState === "User loaded") {
      setDashboardController( (oldDashboardController) =>{
        //console.log("----------", oldDashboardController);

        if(oldDashboardController){
          return oldDashboardController;
        }
        return new DashboardController({ userProfile: oidcUser.oidcUser as unknown as ClasseCloudDecodedToken});
        }
      );
    } else {
      setDashboardController(undefined);
    }
  }, [oidcUser]);

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
