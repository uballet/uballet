import type { Meta, StoryObj } from '@storybook/react';
import SponsorshipCard from './SponsorshipCard';

const meta: Meta<typeof SponsorshipCard> = {
  title: 'Components/SponsorshipCard',
  component: SponsorshipCard,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SponsorshipCard>;

export const Default: Story = {
  args: {
    loadingSponsorship: false,
    isSponsored: false,
  },
};

export const Loading: Story = {
  args: {
    loadingSponsorship: true,
    isSponsored: false,
  },
};

export const Sponsored: Story = {
  args: {
    loadingSponsorship: false,
    isSponsored: true,
  },
};