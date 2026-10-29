import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { colors } from "@/foundation/colors";
import { Typography } from "@/foundation/Typography";
import { useState, type ReactNode } from "react";
import { Pressable, View } from "react-native";
import { styles } from "./styles";

export interface DropdownOption {
  value: string;
  label: string;
  description?: string;
  icon?: ReactNode;
}

interface DropdownProps {
  label: string;
  subheading?: string;
  value: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function Dropdown({
  label,
  subheading,
  value,
  options,
  onChange,
  placeholder = "Select an option",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View style={styles.container}>
      <Typography variant="h4">{label}</Typography>
      {subheading && (
        <Typography variant="bodySmall" color={colors.textSecondary}>
          {subheading}
        </Typography>
      )}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={
          selectedOption ? `${label}: ${selectedOption.label}` : placeholder
        }
        accessibilityState={{ expanded: isOpen }}
        onPress={() => setIsOpen((open) => !open)}
        style={styles.dropdown}
      >
        {selectedOption?.icon}
        <View style={styles.selectedText}>
          <Typography variant="body">
            {selectedOption?.label ?? placeholder}
          </Typography>
          {selectedOption?.description ? (
            <Typography variant="bodySmall" color={colors.textSecondary}>
              {selectedOption.description}
            </Typography>
          ) : null}
        </View>
        <MaterialDesignIcons
          name={isOpen ? "chevron-up" : "chevron-down"}
          size={24}
          color={colors.textSecondary}
        />
      </Pressable>

      {isOpen && (
        <View style={styles.options}>
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                onPress={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                style={[styles.option, isSelected && styles.optionSelected]}
              >
                {option.icon}
                <Typography variant="body">{option.label}</Typography>
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}
