
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4f5600a6c49e473bbf57b5d448863137',
  appName: 'T-List',
  webDir: 'dist',
  server: {
    url: 'https://4f5600a6-c49e-473b-bf57-b5d448863137.lovableproject.com',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#FFFFFF",
      showSpinner: true,
      spinnerColor: "#6366F1",
    },
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      releaseType: "APK"
    }
  }
};

export default config;
