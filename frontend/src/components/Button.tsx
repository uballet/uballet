import { Pressable, PressableProps, StyleSheet, Text, TextProps, ViewProps } from "react-native";
import { theme } from "../styles/color";


type ButtonVariant = "primary" | "inverse"

type ButtonProps = PressableProps & {
    variant?: ButtonVariant
    style?: ViewProps["style"]
}

export function Button({
    children,
    variant = 'primary',
    style = {},
    disabled,
    ...rest
}: ButtonProps) {
    let buttonStyles = styles.primary
    if (variant === 'inverse') {
        buttonStyles = styles.inverse
    }
    if (disabled) {
        buttonStyles = styles.disabled
    }    
    return (
        <Pressable
            style={[
                buttonStyles,
                style
            ]}
            {...rest}
        >
            {children}
        </Pressable>
    )
}

type ButtonTextProps = TextProps & {
    disabled?: boolean
    variant?: ButtonVariant
}
export function ButtonText({ children, disabled, style = {}, variant = 'primary' }: ButtonTextProps) {
    let buttonStyles = styles.primaryButtonText
    if (variant === 'inverse') {
        buttonStyles = styles.inverseButtonText
    }
    if (disabled) {
        buttonStyles = styles.disabledText
    }
    return (
        <Text style={[buttonStyles, style]}>
            {children}
        </Text>
    )
}

const baseStyles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        paddingVertical: 12,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
})

const styles = StyleSheet.create({
    primary: {
        ...baseStyles.container,
        backgroundColor: theme.colors.primaryContainer
    },
    inverse: {
        ...baseStyles.container,
        backgroundColor: theme.colors.onPrimary,
        borderColor: theme.colors.primary,
        borderWidth: 1
    },
    disabled: {
        ...baseStyles.container,
        backgroundColor: theme.colors.surfaceDisabled,
        borderWidth: 0
    },
    primaryButtonText: {
        color: theme.colors.onPrimary
    },
    inverseButtonText: {
        color: theme.colors.primary
    },
    disabledText: {
        color: theme.colors.onSurfaceDisabled
    }
})

