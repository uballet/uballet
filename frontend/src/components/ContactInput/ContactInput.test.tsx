import { render, screen, fireEvent } from "@testing-library/react-native";
import ContactInput from "./ContactInput";

jest.useFakeTimers();

describe("ContactInput Component", () => {
  const mockHandleAddressChange = jest.fn();
  const mockHandleInputEndEditing = jest.fn();

  it("renders the input field and error message when invalid", () => {
    render(
      <ContactInput
        toAddress="invalidAddress"
        handleAddressChange={mockHandleAddressChange}
        handleInputEndEditing={mockHandleInputEndEditing}
        isAddressValid={false}
        isResolving={false}
        inputType="address"
      />
    );

    const addressInput = screen.getByPlaceholderText("Address or ENS name");
    expect(addressInput).toBeTruthy();

    const errorText = screen.getByText("Invalid address");
    expect(errorText).toBeTruthy();
  });

  it("calls handleAddressChange when the address input changes", () => {
    render(
      <ContactInput
        toAddress=""
        handleAddressChange={mockHandleAddressChange}
        handleInputEndEditing={mockHandleInputEndEditing}
        isAddressValid={true}
        isResolving={false}
        inputType="address"
      />
    );

    const addressInput = screen.getByPlaceholderText("Address or ENS name");
    fireEvent.changeText(
      addressInput,
      "3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2"
    );

    expect(mockHandleAddressChange).toHaveBeenCalledWith(
      "3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2"
    );
  });

  it("calls handleInputEndEditing when the input ends editing", () => {
    render(
      <ContactInput
        toAddress=""
        handleAddressChange={mockHandleAddressChange}
        handleInputEndEditing={mockHandleInputEndEditing}
        isAddressValid={true}
        isResolving={false}
        inputType="address"
      />
    );

    const addressInput = screen.getByPlaceholderText("Address or ENS name");
    fireEvent(addressInput, "onEndEditing", {
      nativeEvent: { text: "3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2" },
    });

    expect(mockHandleInputEndEditing).toHaveBeenCalled();
  });

  it("does not display error message when address is valid", () => {
    render(
      <ContactInput
        toAddress="3fE98C2F9C7D2aF4B5e2dFbFd146579E6F4D58F2"
        handleAddressChange={mockHandleAddressChange}
        handleInputEndEditing={mockHandleInputEndEditing}
        isAddressValid={true}
        isResolving={false}
        inputType="address"
      />
    );

    const errorText = screen.queryByText("Invalid address");
    expect(errorText).toBeNull();
  });

  it("displays resolving indicator when isResolving is true", () => {
    render(
      <ContactInput
        toAddress=""
        handleAddressChange={mockHandleAddressChange}
        handleInputEndEditing={mockHandleInputEndEditing}
        isAddressValid={true}
        isResolving={true}
        inputType="address"
      />
    );

    const activityIndicator = screen.getByTestId("activity-indicator");
    expect(activityIndicator).toBeTruthy();
  });

  it("displays resolved address when inputType is ens and address is valid", () => {
    render(
      <ContactInput
        toAddress="resolvedAddress"
        handleAddressChange={mockHandleAddressChange}
        handleInputEndEditing={mockHandleInputEndEditing}
        isAddressValid={true}
        isResolving={false}
        inputType="ens"
      />
    );

    const resolvedText = screen.getByText("Address resolved: resolvedAddress");
    expect(resolvedText).toBeTruthy();
  });
});
