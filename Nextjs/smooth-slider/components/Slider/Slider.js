'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import sliderData from './slider_json';
import './Slider.css';

function Slider() {
  // console.log('sliderData.length', sliderData.length);
  const activeItem = Math.floor(sliderData.length / 2);

  const [slider, setSlider] = useState(sliderData);
  const [selectedItem, setSelectedItem] = useState(activeItem);
  // console.log('selectedItem', selectedItem + 4);

  useEffect(() => {
    // console.log('in effe', selectedItem);
    updateSliderData();
  }, [selectedItem]);

  const updateSliderData = () => {
    let tempData = [...slider];

    let selectedIndex = tempData?.findIndex(
      (x, index) => index === selectedItem - 1
    );
    console.log('selectedIndex', selectedIndex);
    tempData[selectedIndex] = { ...tempData[selectedIndex], class: 'selected' };

    const prevData = tempData.slice(0, selectedItem - 1);
    const nextData = tempData.slice(selectedItem, sliderData?.length);

    console.log('prevData?.length', prevData?.length);
    for (let i = prevData?.length - 1; i >= 0; i--) {
      // for (let i = 0; i < prevData?.length; i++) {

      if (selectedIndex >= slider?.length - 3) {
        console.log('i', i);
        if (i >= prevData?.length + nextData?.length - 7) {
          prevData[i].class = `itemPreview`;
          if (!(i - 1 > prevData?.length + nextData?.length - 7)) {
            if (prevData[i - 1]) {
              prevData[i - 1].class = `itemShortPreview`;
            }
          }
        } else {
          if (prevData[i - 1]) {
            prevData[i - 1].class = ``;
          }
        }
      } else if (i >= prevData?.length - 3) {
        prevData[i].class = `itemPreview`;
      } else if (i === prevData?.length - 4) {
        prevData[i].class = `itemShortPreview`;
      } else {
        prevData[i].class = '';
      }
    }

    for (let i = 0; i < nextData?.length; i++) {
      if (selectedIndex <= 3) {
        if (i < 7 - selectedIndex) {
          nextData[i].class = `itemPreview`;
          if (!(i + 1 < 7 - selectedIndex)) {
            if (nextData[i + 1]) {
              nextData[i + 1].class = `itemShortPreview`;
            }
          }
        } else {
          if (nextData[i + 1]) {
            nextData[i + 1].class = ``;
          }
        }
      } else if (i < 3) {
        nextData[i].class = `itemPreview`;
      } else if (i === 3) {
        nextData[i].class = `itemShortPreview`;
      } else {
        nextData[i].class = '';
      }
    }
    console.log('tempData', tempData);
    setSlider(tempData);
  };

  const handleItemClick = (index) => {
    // console.log('index', index);
    setSelectedItem(index + 1);
  };
  console.log('slider', slider?.length);
  return (
    <div className='sliderWrapper'>
      <div className='sliderMain'>
        {slider.map((item, index) => (
          <div
            className={`sliderItem ${item?.class}`}
            key={index}
            onClick={() => handleItemClick(index)}
          >
            <div className='itemWrapper'>
              <div className='content'>
                <div className='title'>{item.title}</div>
                <div className='description'>{item.description}</div>
              </div>
              <div className='image'>
                <Image
                  src={item.image}
                  alt='image'
                  className='sliderImage'
                  priority
                  fill
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Slider;
