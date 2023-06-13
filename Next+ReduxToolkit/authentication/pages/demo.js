import React, { useEffect, useState } from 'react';

export default function Demo() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('effect');
    setCount(1);
  });

  console.log('called');

  return <div>{count}</div>;
}
