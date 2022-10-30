import { render, fireEvent, screen } from "@testing-library/react";
import FighterCard from "../components/FighterCard";
import React, { useState } from 'react';

describe("FighterCard", () => {

  const player1 = {
    "name": "PORKKANA",
    "hp": 33,
    "damage": 5.6,
    "defense": 0.63,
    "fat": 0,
    "wait": 3,
    "aps": 0.16,
    "dps": 0.871,
    "selected": true
  }


  test("Renders properly", () => {
    render(<FighterCard
      player={player1}
      playerNo="1"
    />);
  });

  test("Updates parent player on button press", () => {
    const mockUpdateParentPlayer = jest.fn()
    render(<FighterCard
      player={player1}
      playerNo="1"
      updateParentPlayer={mockUpdateParentPlayer}
    />)
    const changeButton = screen.getByTestId("changeButton")
    fireEvent.click(changeButton);
    expect(mockUpdateParentPlayer).toHaveBeenCalled()
  })

})