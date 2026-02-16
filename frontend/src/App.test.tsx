import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";

describe("App", () => {
  it("renders without crashing", () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>,
    );
    expect(document.body).toBeInTheDocument();
  });
});
