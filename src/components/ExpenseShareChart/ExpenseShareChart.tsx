import Avatar from "@/components/Avatar/Avatar";
import { colors } from "@/foundation/colors";
import { spacing } from "@/foundation/spacing";
import { Typography } from "@/foundation/Typography";
import type { PersonBalance } from "@/types/models";
import { StyleSheet, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface ExpenseShareChartProps {
  balances: PersonBalance[];
  totalAmount: number;
  getPersonColor: (personId: string) => string;
}

const CHART_SIZE = 136;
const CHART_RADIUS = 52;
const STROKE_WIDTH = 18;
const CIRCUMFERENCE = 2 * Math.PI * CHART_RADIUS;

export default function ExpenseShareChart({
  balances,
  totalAmount,
  getPersonColor,
}: ExpenseShareChartProps) {
  const shares = balances
    .filter((balance) => balance.owes > 0)
    .map((balance) => ({
      ...balance,
      shareCents: Math.round(balance.owes * 100),
    }));
  const totalShareCents = shares.reduce(
    (total, balance) => total + balance.shareCents,
    0,
  );
  let chartOffset = 0;

  return (
    <View style={styles.card}>
      <View style={styles.chart}>
        {totalShareCents > 0 ? (
          <>
            <Svg width={CHART_SIZE} height={CHART_SIZE}>
              <Circle
                cx={CHART_SIZE / 2}
                cy={CHART_SIZE / 2}
                r={CHART_RADIUS}
                fill="none"
                stroke={colors.divider}
                strokeWidth={STROKE_WIDTH}
              />
              {shares.map((share) => {
                const segmentLength =
                  (share.shareCents / totalShareCents) * CIRCUMFERENCE;
                const dashOffset = chartOffset;
                chartOffset += segmentLength;

                return (
                  <Circle
                    key={share.personId}
                    cx={CHART_SIZE / 2}
                    cy={CHART_SIZE / 2}
                    r={CHART_RADIUS}
                    fill="none"
                    stroke={getPersonColor(share.personId)}
                    strokeWidth={STROKE_WIDTH}
                    strokeDasharray={`${segmentLength} ${CIRCUMFERENCE}`}
                    strokeDashoffset={-dashOffset}
                    rotation={-90}
                    origin={`${CHART_SIZE / 2}, ${CHART_SIZE / 2}`}
                  />
                );
              })}
            </Svg>
            <View style={styles.chartCenter}>
              <Typography variant="h7">${totalAmount.toFixed(2)}</Typography>
              <Typography variant="caption" color={colors.textSecondary}>
                Total
              </Typography>
            </View>
          </>
        ) : (
          <View style={styles.emptyChart}>
            <Typography variant="caption" color={colors.textSecondary}>
              No shares
            </Typography>
          </View>
        )}
      </View>
      <View style={styles.legend}>
        {shares.map((share) => {
          const percentage = Math.round(
            (share.shareCents / (totalShareCents || 1)) * 100,
          );
          const personColor = getPersonColor(share.personId);

          return (
            <View key={share.personId} style={styles.legendRow}>
              <Avatar
                name={share.personName}
                avatarColor={personColor}
                size="small"
              />
              <View style={styles.personName}>
                <Typography variant="h7" numberOfLines={1}>
                  {share.personName}
                </Typography>
              </View>
              <View style={styles.amount}>
                <Typography variant="h7">
                  ${(share.shareCents / 100).toFixed(2)}
                </Typography>
                <Typography variant="caption" color={colors.textSecondary}>
                  {percentage}%
                </Typography>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    padding: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.s,
    backgroundColor: colors.surface,
  },
  chart: {
    width: CHART_SIZE,
    height: CHART_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyChart: {
    width: CHART_SIZE - STROKE_WIDTH,
    height: CHART_SIZE - STROKE_WIDTH,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: (CHART_SIZE - STROKE_WIDTH) / 2,
    backgroundColor: colors.background,
  },
  legend: {
    flex: 1,
    gap: spacing.xs,
  },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xxs,
  },
  personName: {
    flex: 1,
  },
  amount: {
    alignItems: "flex-end",
  },
});
