import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { TextInput, TextInputProps, View } from "react-native";
import { styles } from "./styles/styles";

interface TextFieldProps extends TextInputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeValue: (val: string) => void;
  disabled?: boolean;
  leftElement?: React.ReactNode;
}

export default function TextField({
  label,
  value,
  placeholder,
  onChangeValue,
  disabled = false,
  leftElement,
  ...props
}: TextFieldProps) {
  const isDisabled = disabled;

  return (
    <View>
      <Typography variant="label">{label}</Typography>
      <View style={styles.inputExterior}>
        {leftElement && <View> {leftElement}</View>}

        <TextInput
          onChangeText={onChangeValue}
          value={value}
          placeholder={placeholder || ""}
          placeholderTextColor={colors.textDisabled}
          style={[styles.textInput, { width: leftElement ? "85%" : "100%" }]}
          {...props}
        />
      </View>
    </View>

    // <Pressable
    //   onPress={onPress}
    //   disabled={isDisabled}
    //   accessibilityRole="button"
    //   accessibilityState={{
    //     disabled: isDisabled,
    //     busy: loading,
    //   }}
    //   style={({ pressed }) => [
    //     styles.base,
    //     styles[variant],
    //     styles[size],
    //     fullWidth && styles.fullWidth,
    //     isDisabled && styles.disabled,
    //     pressed && !isDisabled && styles.pressed,
    //   ]}
    // >
    //   {loading ? (
    //     <ActivityIndicator
    //       color={variant === "primary" ? colors.white : colors.primary}
    //     />
    //   ) : (
    //     <Text
    //       style={[
    //         styles.label,
    //         styles[`${variant}Label`],
    //         styles[`${size}Label`],
    //       ]}
    //     >
    //       {title}
    //     </Text>
    //   )}
    // </Pressable>
  );
}
