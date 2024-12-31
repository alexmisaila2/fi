import { useEffect } from 'react';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const AdBanner = () => {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('Error loading AdSense:', err);
    }
  }, []);

  return (
    <div className="w-full mt-8">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6912858030138840"
        data-ad-slot="8142966283"
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};