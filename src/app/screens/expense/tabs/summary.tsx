import ExpenseShareChart from "@/components/ExpenseShareChart/ExpenseShareChart";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import type { PersonBalance } from "@/types/models";
import { StyleSheet, View } from "react-native";
import Avatar from "@/components/Avatar/Avatar";

interface SummaryTabProps {
  total: number;
  personBalances: PersonBalance[];
  getPersonColor: (personId: string) => string;
}

export default function SummaryTab({
  total,
  personBalances,
  getPersonColor,
}: SummaryTabProps) {
  return (
    <View>
      <Typography variant="h5">Expense summary</Typography>
      <View style={styles.totalCard}>
        <Typography variant="bodySmall" color={colors.textSecondary}>
          Total expense
        </Typography>
        <Typography variant="h3">${total.toFixed(2)}</Typography>
      </View>
      <ExpenseShareChart
        balances={personBalances}
        totalAmount={total}
        getPersonColor={getPersonColor}
      />
      <View style={styles.sectionHeading}>
        <Typography variant="h5">Balances</Typography>
      </View>
      {personBalances.map((personBalance) => (
        <View key={personBalance.personId} style={styles.balanceCard}>
          <View style={styles.balanceHeading}>
            <Avatar
              avatarColor={getPersonColor(personBalance.personId)}
              name={personBalance.personName}
            />

            <Typography variant="h7" style={styles.balanceName}>
              {personBalance.personName}
            </Typography>
            <Typography variant="h7">
              {personBalance.balance < 0 ? "Owes" : "Gets back"} $
              {Math.abs(personBalance.balance).toFixed(2)}
            </Typography>
          </View>
          <View style={styles.balanceDetails}>
            <Typography variant="caption" color={colors.textSecondary}>
              Paid ${personBalance.paid.toFixed(2)}
            </Typography>
            <Typography variant="caption" color={colors.textSecondary}>
              Share ${personBalance.owes.toFixed(2)}
            </Typography>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  sectionHeading: {
    minHeight: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.xxxs,
  },
  totalCard: {
    gap: spacing.xxxs,
    padding: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.primaryPale,
  },
  balanceCard: {
    gap: spacing.xxs,
    padding: spacing.s,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  balanceHeading: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  balanceName: {
    flex: 1,
  },
  balanceDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 40,
  },
  personCard: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  personAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  personDetails: {
    flex: 1,
    gap: spacing.xxxs,
  },
});
