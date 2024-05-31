import React from 'react';

const Clear = () => {
  const clearLocalStorage = () => {
    localStorage.clear();
  };
  return (
    <button
      onClick={clearLocalStorage}
      style={{
        width: '100px',
        backgroundColor: '#D6D9DC',
        textAlign: 'center',
      }}
    >
      Очистить localStorage
    </button>
  );
};

export default Clear;
