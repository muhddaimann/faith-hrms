import Ionicons from '@expo/vector-icons/Ionicons';
import { Text, View, StyleSheet } from 'react-native';

import { about } from '../src/constants/about';

const colors = {
  background: '#F8F7FF',
  primary: '#6D28D9',
  primaryDeep: '#4C1D95',
  primarySoft: '#EDE9FE',
  text: '#1F1538',
  mutedText: '#675C7A',
  card: '#FFFFFF',
};

export default function LandingScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.hero}>
        <View style={styles.iconWrap}>
          <Ionicons accessibilityLabel="Faith" color={colors.primary} name="sparkles" size={34} />
        </View>
        <Text style={styles.eyebrow}>YOUR WORKDAY, CLOSER</Text>
        <Text style={styles.title}>{about.appName}</Text>
        <Text style={styles.description}>{about.appAbout}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.cardIconWrap}>
          <Ionicons color={colors.primaryDeep} name="briefcase-outline" size={22} />
        </View>
        <View style={styles.cardContent}>
          <Text style={styles.cardTitle}>Built for your workday</Text>
          <Text style={styles.cardText}>
            A focused native foundation for the people, tasks, and updates that matter.
          </Text>
        </View>
      </View>

      <Text style={styles.version}>Version {about.version}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 36,
    backgroundColor: colors.background,
  },
  hero: {
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 24,
    backgroundColor: colors.primarySoft,
  },
  eyebrow: {
    marginTop: 40,
    color: colors.primary,
    fontFamily: 'Manrope_700Bold',
    fontSize: 12,
    letterSpacing: 1.4,
  },
  title: {
    marginTop: 12,
    color: colors.text,
    fontFamily: 'Manrope_700Bold',
    fontSize: 48,
    letterSpacing: -2,
    lineHeight: 58,
  },
  description: {
    marginTop: 8,
    color: colors.mutedText,
    fontFamily: 'Manrope_500Medium',
    fontSize: 19,
    lineHeight: 29,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E9E4F2',
    borderRadius: 24,
    backgroundColor: colors.card,
    shadowColor: '#27124D',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.06,
    shadowRadius: 22,
    elevation: 2,
  },
  cardIconWrap: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
    backgroundColor: colors.primarySoft,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    color: colors.text,
    fontFamily: 'Manrope_700Bold',
    fontSize: 16,
    lineHeight: 24,
  },
  cardText: {
    marginTop: 4,
    color: colors.mutedText,
    fontFamily: 'Manrope_400Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  version: {
    alignSelf: 'center',
    color: colors.mutedText,
    fontFamily: 'Manrope_500Medium',
    fontSize: 12,
  },
});