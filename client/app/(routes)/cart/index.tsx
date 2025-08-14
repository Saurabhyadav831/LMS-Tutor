import CartScreen from "@/screens/cart/cart.screen";
import { Platform } from "react-native";

export default function index() {
  // Only wrap with StripeProvider on native platforms
  if (Platform.OS === 'web') {
    return <CartScreen />;
  }

  try {
    // Dynamic import for native platforms only
    const { StripeProvider } = require("@stripe/stripe-react-native");
    
    return (
      <StripeProvider
        publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
      >
        <CartScreen />
      </StripeProvider>
    );
  } catch (error) {
    // Fallback if Stripe is not available
    console.warn('Stripe not available:', error);
    return <CartScreen />;
  }
}
