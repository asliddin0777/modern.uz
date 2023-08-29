import React, { ChangeEvent, FC, useCallback, useEffect, useState, useRef } from 'react';
import styles from '@/styles/multiSlider.module.css'

interface MultiRangeSliderProps {
  min: number;
  max: number;
}

const MultiRangeSlider: FC<MultiRangeSliderProps> = ({ min, max }) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback((value: number) =>
    Math.round(((value - min) / (max - min)) * 100), [min, max])


  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);


  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <div className={styles.range}>
      <div className={styles.thumb}>
        <div>
          <input
            type="range"
            min={min}
            max={max}
            value={minVal}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              const value = Math.min(Number(event.target.value), maxVal - 1);
              setMinVal(value);
              minValRef.current = value;
            }}
            className={styles.thumb__left}
          />
        </div>
      </div>
      <div className={styles.slider}>
        <div className={styles.slider__track}></div>
        <div ref={range} className={styles.slider__range}></div>
        <div className={styles.slider__left_value}>{minVal}млн</div>
        <div className={styles.slider__right_value}>{maxVal}млн</div>
      </div>
    </div>
  );
};

export default MultiRangeSlider;
