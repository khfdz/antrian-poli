import { useEffect } from 'react';

const TextToSpeech = ({ queue }) => {
  useEffect(() => {
    // Only proceed if queue exists and has required properties
    if (!queue || !queue.no_reg || !queue.nm_poli) return;

    // Create the announcement text
    const announcement = `Ding dong. Kepada nomor registrasi ${queue.no_reg}, silahkan menuju ke ${queue.nm_poli}`;

    // Use Web Speech API
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(announcement);

    // Configure utterance
    utterance.lang = 'id-ID'; // Set language to Indonesian
    utterance.volume = 1; // Volume (0 to 1)
    utterance.rate = 1; // Speed (0.1 to 10)
    utterance.pitch = 1; // Pitch (0 to 2)

    // Optional: Select an Indonesian voice if available
    const voices = synth.getVoices();
    const indonesianVoice = voices.find(
      (voice) => voice.lang === 'id-ID' || voice.lang.startsWith('id')
    );
    if (indonesianVoice) {
      utterance.voice = indonesianVoice;
    }

    // Speak the announcement
    synth.speak(utterance);

    // Cleanup: Cancel any ongoing speech when component unmounts or queue changes
    return () => {
      synth.cancel();
    };
  }, [queue]); // Trigger when queue changes

  return null; // This component doesn't render anything
};

export default TextToSpeech;