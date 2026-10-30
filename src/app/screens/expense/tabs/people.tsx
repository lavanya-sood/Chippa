import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import { SELF_PERSON_ID } from "@/constants/people";
import type { PersonBalance, PersonDebt } from "@/types/models";
import Avatar from "@/components/Avatar/Avatar";
import { StyleSheet, View } from "react-native";

interface PeopleTabProps {
  participantIds: string[];
  personBalances: PersonBalance[];
  personDebts: PersonDebt[];
  getPersonColor: (personId: string) => string;
  getPersonName: (personId: string) => string;
}

export default function PeopleTab({
  participantIds,
  personBalances,
  personDebts,
  getPersonColor,
  getPersonName,
}: PeopleTabProps) {
  return (
    <View>
      <View style={styles.sectionHeading}>
        <Typography variant="h5">People</Typography>
        <Typography variant="bodySmall" color={colors.textSecondary}>
          {participantIds.length} total
        </Typography>
      </View>
      <View style={styles.peopleList}>
        {participantIds.map((personId) => {
          const balance = personBalances.find(
            (person) => person.personId === personId,
          );
          const name = getPersonName(personId);
          const debtsForPerson = personDebts.filter(
            (debt) => debt.debtorId === personId,
          );

          return (
            <View key={personId} style={styles.personCard}>
              <Avatar avatarColor={getPersonColor(personId)} name={name} />
              <View style={styles.personDetails}>
                <Typography variant="h7">{name}</Typography>
                <View style={styles.amountRow}>
                  <Typography variant="bodySmall" color={colors.textSecondary}>
                    Total share
                  </Typography>
                  <Typography variant="bodySmall">
                    ${(balance?.owes ?? 0).toFixed(2)}
                  </Typography>
                </View>
                <View style={styles.amountRow}>
                  <Typography variant="bodySmall" color={colors.textSecondary}>
                    Amount paid
                  </Typography>
                  <Typography variant="bodySmall">
                    ${(balance?.paid ?? 0).toFixed(2)}
                  </Typography>
                </View>
                <View style={styles.divider} />
                <Typography variant="bodySmall" color={colors.textSecondary}>
                  Balance
                </Typography>
                {debtsForPerson.length ? (
                  debtsForPerson.map((debt) => {
                    const label = personId === SELF_PERSON_ID
                      ? `You owe ${getPersonName(debt.creditorId)}`
                      : `${name} owes ${getPersonName(debt.creditorId)}`;

                    return (
                      <View
                        key={`${debt.debtorId}-${debt.creditorId}`}
                        style={styles.amountRow}
                      >
                        <Typography
                          variant="bodySmall"
                          color={colors.textSecondary}
                          style={styles.debtLabel}
                        >
                          {label}
                        </Typography>
                        <Typography
                          variant="h7"
                          color={colors.error}
                        >
                          ${debt.amount.toFixed(2)}
                        </Typography>
                      </View>
                    );
                  })
                ) : (
                  <Typography variant="bodySmall" color={colors.textSecondary}>
                    Settled up
                  </Typography>
                )}
              </View>
            </View>
          );
        })}
      </View>
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
  personCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: spacing.xs,
    padding: spacing.s,
    borderRadius: spacing.s,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  peopleList: {
    gap: spacing.xs,
  },
  personDetails: {
    flex: 1,
    gap: spacing.xxxs,
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.xs,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.divider,
    marginVertical: spacing.xxxs,
  },
  debtLabel: {
    flex: 1,
  },
});
