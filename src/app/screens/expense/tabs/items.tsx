import Button from "@/components/Button/Button";
import { SELF_PERSON_ID } from "@/constants/people";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { usePeopleStore } from "@/state/stores";
import { MaterialDesignIcons } from "@react-native-vector-icons/material-design-icons";
import { Pressable, StyleSheet, View } from "react-native";
import Avatar from "@/components/Avatar/Avatar";
import { Item } from "@/types/models";

interface ItemsTabProps {
  total: string;
  items: Item[];
  addItem: (id?: string) => void;
}

export default function ItemsTab({ total, items, addItem }: ItemsTabProps) {
  const people = usePeopleStore((state) => state.people);

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeading}>
        <Typography variant="h5">Items ({items.length})</Typography>
      </View>

      {items.length ? (
        items.map((item) => {
          const sharedPeople = [...new Set(item.sharedBy)].map((personId) => {
            const person = people.find(
              (candidate) => candidate.id === personId,
            );
            return {
              id: personId,
              name:
                personId === SELF_PERSON_ID
                  ? "You"
                  : (person?.name ?? personId),
              avatarColor: person?.avatarColor ?? colors.avatarPeach,
            };
          });

          return (
            <View style={styles.itemCard}>
              <Avatar
                icon={(color, size) => (
                  <MaterialDesignIcons
                    name="food-outline"
                    size={size}
                    color={color}
                  />
                )}
                avatarColor={colors.avatarBlue}
              />
              <View style={styles.itemDetails}>
                <Typography variant="h7" numberOfLines={1}>
                  {item.name}
                </Typography>
                <Typography variant="bodySmall">
                  ${(item.amount * item.quantity).toFixed(2)}
                </Typography>
                {sharedPeople.length ? (
                  <View
                    style={styles.sharedAvatars}
                    accessibilityLabel={`Shared by ${sharedPeople
                      .map((person) => person.name)
                      .join(", ")}`}
                  >
                    {sharedPeople.map((person) => (
                      <Avatar
                        key={person.id}
                        name={person.name}
                        avatarColor={person.avatarColor}
                        size="small"
                      />
                    ))}
                  </View>
                ) : (
                  <Typography variant="caption" color={colors.textSecondary}>
                    No one assigned
                  </Typography>
                )}
              </View>
              <View style={styles.itemRight}>
                <Typography variant="caption" color={colors.textSecondary}>
                  {item.sharedBy.length
                    ? `$${(
                        (item.amount * item.quantity) /
                        new Set(item.sharedBy).size
                      ).toFixed(2)} each`
                    : ""}
                </Typography>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Edit ${item.name}`}
                  onPress={() => addItem(item.id)}
                  style={styles.editButton}
                >
                  <MaterialDesignIcons
                    name="pencil-outline"
                    size={22}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>
            </View>
          );
        })
      ) : (
        <View style={styles.emptyState}>
          <Typography variant="bodySmall" color={colors.textSecondary}>
            No items yet. Add the first item to split this expense.
          </Typography>
        </View>
      )}

      <Button
        variant="primary"
        fullWidth
        title="+  Add item"
        onPress={addItem}
      />

      <View style={styles.subtotalCard}>
        <Typography variant="bodySmall" color={colors.textSecondary}>
          Subtotal
        </Typography>
        <Typography variant="h6">${total}</Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: spacing.s,
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxxs,
    paddingHorizontal: spacing.xxs,
  },
  sectionHeading: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xxxs,
  },
  itemCard: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.xs,
    borderRadius: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  itemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  itemDetails: {
    flex: 1,
    gap: 1,
  },
  sharedAvatars: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: spacing.xxxs,
  },
  itemRight: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: spacing.xxxs,
  },
  emptyState: {
    padding: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  subtotalCard: {
    minHeight: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
});
