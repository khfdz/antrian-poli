import { useEffect, useState } from "react";

const TextToSpeech = ({ queue }) => {
  const [lastQueueId, setLastQueueId] = useState(null);

  const speakAnnouncement = (announcement) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(announcement);

    utterance.lang = "id-ID";
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel(); // clear antrean lama

    let voices = synth.getVoices();
    const assignAndSpeak = () => {
      voices = synth.getVoices();
      const idVoice = voices.find(v => v.lang.startsWith("id"));
      if (idVoice) utterance.voice = idVoice;
      synth.speak(utterance);
    };

    if (voices.length === 0) {
      synth.onvoiceschanged = assignAndSpeak;
    } else {
      assignAndSpeak();
    }
  };

  useEffect(() => {
    if (!queue || !queue.no_reg || !queue.nm_poli) return;
    if (queue.no_rawat === lastQueueId) return; // biar ga dobel

    setLastQueueId(queue.no_rawat);

    const text = `Ding dong. Kepada nomor registrasi ${queue.no_reg}, silahkan menuju ke ${queue.nm_poli}`;
    speakAnnouncement(text);
  }, [queue]);

  return null;
};

export default TextToSpeech;
