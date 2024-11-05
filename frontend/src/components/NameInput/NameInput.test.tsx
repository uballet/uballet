import React from "react";
import { render, screen, fireEvent } from "@testing-library/react-native";
import NameInput from "./NameInput";

jest.useFakeTimers();

describe("NameInput Component", () => {
  const mockHandleNameChange = jest.fn();

  it("renders correctly with given props", () => {
    render(
      <NameInput
        name="John Doe"
        handleNameChange={mockHandleNameChange}
        helperText="Enter your name"
        testID="name-input"
      />
    );

    const input = screen.getByTestId("name-input");
    expect(input.props.value).toBe("John Doe");
    expect(input.props.placeholder).toBe("Enter your name");
  });

  it("calls handleNameChange when text is changed", () => {
    render(
      <NameInput
        name=""
        handleNameChange={mockHandleNameChange}
        helperText="Enter your name"
        testID="name-input"
      />
    );

    const input = screen.getByTestId("name-input");
    fireEvent.changeText(input, "Jane Doe");
    expect(mockHandleNameChange).toHaveBeenCalledWith("Jane Doe");
  });

  it("renders with default props", () => {
    render(<NameInput name="" testID="name-input"  handleNameChange={mockHandleNameChange} />);

    const input = screen.getByTestId("name-input");
    expect(input.props.value).toBe("");
    expect(input.props.placeholder).toBeUndefined();
  });
});
