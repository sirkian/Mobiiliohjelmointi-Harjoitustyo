import React from "react";
import { AuthenticatedUserProvider } from "./AuthenticatedUserProvider";
import Root from "./Root";

export default function Routes() {
  return (
    <AuthenticatedUserProvider>
      <Root />
    </AuthenticatedUserProvider>
  );
}
