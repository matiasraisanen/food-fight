import { render, screen, fireEvent } from "@testing-library/react";
import FightLog from "../components/FightLog";
import React from 'react';

describe("FightLog", () => {

  const fightLogMessages = [
    "--------------------------",
    "Welcome to food fight!",
    'Press "CHANGE" to change fighters',
    'Press "FIGHT" to begin',
    'Hover over a stat to get its description',
  ]




  test("Renders properly", () => {
    render(
      <FightLog
        messages={fightLogMessages}
      />);

    const fightLog = screen.getByTestId("logMessages");

    expect(fightLog).toHaveTextContent(...fightLogMessages)
  });

  test("Clear button gets called properly", () => {
    const mockClear = jest.fn()

    render(
      <FightLog
        messages={fightLogMessages}
        clearLog={mockClear}
      />);

    const clearButton = screen.getByTestId("clearButton")
    fireEvent.click(clearButton);

    expect(mockClear).toHaveBeenCalled()

  });






})