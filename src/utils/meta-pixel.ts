// src/utils/meta-pixel.ts
export const trackQuizStart = () => {
    if (window.fbq) {
      window.fbq('track', 'StartQuiz');
    }
  };
  
  export const trackQuizComplete = () => {
    if (window.fbq) {
      window.fbq('track', 'CompleteQuiz');
    }
  };
  
  export const trackLead = (value?: number, currency?: string) => {
    if (window.fbq) {
      window.fbq('track', 'Lead', {
        value: value,
        currency: currency || 'USD',
      });
    }
  };