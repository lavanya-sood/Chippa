import {
  StyleSheet,
  Text,
  type StyleProp,
  type TextProps,
  type TextStyle,
} from "react-native";
import { colors } from "./colors";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "h7"
  | "bodyLarge"
  | "body"
  | "bodySmall"
  | "label"
  | "caption"
  | "button";

type TypographyProps = TextProps & {
  variant?: TypographyVariant;
  color?: string;
  style?: StyleProp<TextStyle>;
};

export function Typography({
  variant = "body",
  color,
  style,
  children,
  ...textProps
}: TypographyProps) {
  return (
    <Text
      {...textProps}
      style={[
        styles.base,
        styles[variant],
        color ? { color } : undefined,
        style,
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  base: {
    fontFamily: "Fredoka-Regular",
    color: colors.textBase,
  },

  // Headings
  h1: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: 40,
    lineHeight: 48,
  },
  h2: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: 32,
    lineHeight: 40,
  },
  h3: {
    fontFamily: "Fredoka-Medium",
    fontSize: 24,
    fontWeight: "500",
    lineHeight: 32,
  },
  h4: {
    fontFamily: "Fredoka-Medium",
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 28,
  },
  h5: {
    fontFamily: "Fredoka-Medium",
    fontSize: 18,
    fontWeight: "500",
    lineHeight: 24,
  },
  h6: {
    fontFamily: "Fredoka-Medium",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
  },
  h7: {
    fontFamily: "Fredoka-Medium",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },

  // Body text
  bodyLarge: {
    fontSize: 20,
    fontWeight: "400",
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 24,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: "400",
    lineHeight: 18,
  },

  // UI text
  label: {
    fontFamily: "Fredoka-Medium",
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 20,
    letterSpacing: 0.5,
  },
  caption: {
    fontSize: 10,
    fontWeight: "400",
    lineHeight: 16,
  },
  button: {
    fontFamily: "Fredoka-SemiBold",
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 24,
  },
});
