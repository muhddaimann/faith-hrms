import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View } from 'react-native';

import { getLeaveType, type LeaveBalance } from '../../constants/leave';
import { useTheme } from '../../hooks/useTheme';

export function LeaveBalanceCard({ balance }: { balance: LeaveBalance }) {
  const { theme } = useTheme();
  const type = getLeaveType(balance.typeId);
  if (!type) return null;
  const lowBalance = balance.entitlement > 0 && balance.remaining <= 2;
  const tone = lowBalance ? theme.colors.warning : theme.colors.primary;
  const softTone = lowBalance ? theme.colors.warningSoft : theme.colors.primarySoft;

  return (
    <View style={{ gap: theme.spacing.md, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.radius.xl, backgroundColor: theme.colors.surface, padding: theme.spacing.lg, ...theme.shadow.card }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: theme.spacing.md }}>
        <View style={{ width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: theme.radius.lg, backgroundColor: softTone }}>
          <Ionicons color={tone} name={type.icon} size={24} />
        </View>
        <View style={{ flex: 1, gap: theme.spacing.xxs }}>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{type.label}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textSecondary }}>{balance.remaining} days remaining</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: theme.spacing.sm }}>
        <BalanceMetric label="Entitled" value={`${balance.entitlement}`} />
        <BalanceMetric label="Used" value={`${balance.used}`} />
        <BalanceMetric label="Pending" value={`${balance.pending}`} />
      </View>
    </View>
  );
}

function BalanceMetric({ label, value }: { label: string; value: string }) {
  const { theme } = useTheme();
  return <View style={{ flex: 1, gap: theme.spacing.xxs, borderRadius: theme.radius.md, backgroundColor: theme.colors.surfaceMuted, padding: theme.spacing.sm }}><Text style={{ ...theme.typography.label, color: theme.colors.textMuted }}>{label}</Text><Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{value}</Text></View>;
}