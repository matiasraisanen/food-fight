import { render, screen } from "@testing-library/react";
import Header from "../components/Header";

describe("Header", () => {
  test("Renders properly", () => {
    render(
      <Header />
    );

    const header = screen.getByTestId("header")

    expect(header).toBeInTheDocument()
    expect(header).toHaveTextContent("FOOD FIGHT 2022")
  });

})