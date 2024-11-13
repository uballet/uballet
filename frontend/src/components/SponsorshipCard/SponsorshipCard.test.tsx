import React from "react";
import { render, screen } from "@testing-library/react-native";
import SponsorshipCard from "./SponsorshipCard";

describe("SponsorshipCard", () => {
  it("renders loading state correctly", () => {
    render(<SponsorshipCard loadingSponsorship={true} isSponsored={false} />);
    expect(screen.getByTestId("sponsorship-loading")).toBeTruthy();
  });

  it("renders sponsored state correctly", () => {
    render(<SponsorshipCard loadingSponsorship={false} isSponsored={true} />);
    expect(screen.getByText(/We'll pay for gas/i)).toBeTruthy();
  });

  it("renders non-sponsored state correctly", () => {
    render(<SponsorshipCard loadingSponsorship={false} isSponsored={false} />);
    expect(screen.getByText(/You'll have to pay for gas/i)).toBeTruthy();
  });
});
