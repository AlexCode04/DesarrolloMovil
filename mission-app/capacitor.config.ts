import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.missionquest.app',
  appName: 'MissionQuest',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#FF4D00',
    },
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;