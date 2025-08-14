const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add platform-specific resolver
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Add resolver for web platform
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Custom resolver to handle Stripe on web
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Block Stripe imports on web platform
  if (platform === 'web' && moduleName.includes('@stripe/stripe-react-native')) {
    return {
      filePath: require.resolve('./stripe-web-stub.js'),
      type: 'sourceFile',
    };
  }
  
  // Let Metro handle all other modules normally
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
