import React from "react";
import LoginUI from "../../../module/auth/components/login-ui";
import { requireUnAuth } from "../../../module/auth/utils/auth-utils";

const LoginPage = async () => {
  // Runs safely inside the request scope when a user visits the page
  await requireUnAuth();

  return (
    <div>
      <LoginUI />
    </div>
  );
};

export default LoginPage;
