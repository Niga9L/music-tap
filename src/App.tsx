import './App.css';
import { useWavesurfer } from '@wavesurfer/react';
import { useEffect, useRef, useState } from 'react';
import file from './assets/audio.mp3';

const ctx = document.createElement('canvas').getContext('2d');
const gradient = ctx?.createLinearGradient(200, 0, 1000, 0);
gradient?.addColorStop(0, '#F6A290');
gradient?.addColorStop(1, '#8141F8');

function createRandomString() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function useDebounce(value: string, delay: number) {
  // Состояние и сеттер для отложенного значения
  const [debValue, setDebouncedValue] = useState(false);

  useEffect(
    () => {
      // Выставить debouncedValue равным value (переданное значение)
      // после заданной задержки
      if (value) {
        setDebouncedValue(true);
      }
      const handler = setTimeout(() => {
        setDebouncedValue(false);
      }, delay);

      // Вернуть функцию очистки, которая будет вызываться каждый раз, когда ...
      // ... useEffect вызван снова. useEffect будет вызван снова, только если ...
      // ... value будет изменено (смотри ниже массив зависимостей).
      // Так мы избегаем изменений debouncedValue, если значение value ...
      // ... поменялось в рамках интервала задержки.
      // Таймаут очищается и стартует снова.
      // Что бы сложить это воедино: если пользователь печатает что-то внутри ...
      // ... нашего приложения в поле поиска, мы не хотим, чтобы debouncedValue...
      // ... не менялось до тех пор, пока он не прекратит печатать дольше, чем 500ms.
      return () => {
        clearTimeout(handler);
      };
    },
    // Вызывается снова, только если значение изменится
    // мы так же можем добавить переменную "delay" в массива зависимостей ...
    // ... если вы собираетесь менять ее динамически.
    [value, delay],
  );

  return debValue;
}

function App() {
  const waveFormRef = useRef(null);
  const [play, setPlay] = useState('');

  const playing = useDebounce(play, 400);

  const { wavesurfer } = useWavesurfer({
    container: waveFormRef,
    height: 40,
    waveColor: '#D9D9D9',
    backend: 'WebAudio',
    cursorColor: 'transparent',
    normalize: true,
    barWidth: 4,
    barGap: 1,
    // dragToSeek: false,
    cursorWidth: 0,
    barRadius: 1,
    sampleRate: 20000,
    // barAlign: 'bottom',
    progressColor: gradient,
    interact: false,
    url: file,
  });

  useEffect(() => {
    if (playing) {
      wavesurfer && wavesurfer.play();
    } else {
      wavesurfer && wavesurfer.pause();
    }
  }, [playing, wavesurfer]);

  const clickHandler = () => {
    setPlay(createRandomString());
  };

  return (
    <>
      <div id={'waveform'} ref={waveFormRef} style={{ width: '100%' }}></div>
      <div className="text-box">
        <a href="#" className="btn btn-white btn-animate" onClick={clickHandler}>
          Играть
        </a>
      </div>
    </>
  );
}

export default App;
