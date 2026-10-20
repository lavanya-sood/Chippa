import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "small" | "medium" | "large";

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
};

export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  loading = false,
  fullWidth = false,
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === "primary" ? "#FFFFFF" : "#2563EB"}
        />
      ) : (
        <Text
          style={[
            styles.label,
            styles[`${variant}Label`],
            styles[`${size}Label`],
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 10,
  },

  primary: {
    backgroundColor: "#2563EB",
  },
  secondary: {
    backgroundColor: "#EFF6FF",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#2563EB",
  },
  ghost: {
    backgroundColor: "transparent",
  },

  small: {
    minHeight: 32,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  medium: {
    minHeight: 44,
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  large: {
    minHeight: 52,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },

  label: {
    fontWeight: "600",
  },
  primaryLabel: {
    color: "#FFFFFF",
  },
  secondaryLabel: {
    color: "#1D4ED8",
  },
  outlineLabel: {
    color: "#2563EB",
  },
  ghostLabel: {
    color: "#2563EB",
  },

  smallLabel: {
    fontSize: 13,
  },
  mediumLabel: {
    fontSize: 15,
  },
  largeLabel: {
    fontSize: 17,
  },

  fullWidth: {
    width: "100%",
  },
  disabled: {
    opacity: 0.45,
  },
  pressed: {
    opacity: 0.8,
  },
});
