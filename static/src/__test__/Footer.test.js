import { render, screen } from "@testing-library/react";
import Footer from "../components/Footer";

describe("Footer", () => {

  test("Renders properly", () => {
    render(
      <Footer />);

    const header = screen.getByTestId("footer")

    expect(header).toBeInTheDocument()
    expect(header).toHaveTextContent("source @github")
  });

})