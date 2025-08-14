// Stripe web stub - provides empty implementations for web platform
export const StripeProvider = ({ children }) => children;

export const useStripe = () => ({
  initPaymentSheet: () => Promise.resolve({ error: null }),
  presentPaymentSheet: () => Promise.resolve({ error: null }),
});

export default {
  StripeProvider,
  useStripe,
};
