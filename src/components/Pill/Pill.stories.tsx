import React from 'react';
import type { Meta, StoryObj } from "@storybook/react";
import { Pill } from "./Pill";
import { View } from "react-native";

const PillMeta: Meta<typeof Pill> = {
    title: "Pill",
    component: Pill,
    decorators: [
        (Story) => (
            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                <Story />
            </View>
        ),
    ]
}

export default PillMeta

type Story = StoryObj<typeof PillMeta>

export const Basic: Story = {}

export const WithEmptyText: Story = {
    render: (props) => {
        return <Pill {...props} />
    },
    args: {
        text: ""
    }
}

export const WithLongText: Story = {
    render: (props) => {
        return <Pill {...props} />
    },
    args: {
        text: "Hello World ".repeat(4)
    }
}

export const WithLengthOne: Story = {
    render: (props) => {
        return <Pill {...props} />
    },
    args: {
        text: "H"
    }
}

export const WithLengthTwo: Story = {
    render: (props) => {
        return <Pill {...props} />
    },
    args: {
        text: "He"
    }
}