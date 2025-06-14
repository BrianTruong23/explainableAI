import React from 'react';

const TextInputForm = ({ onSubmit, placeholder = "Enter text..." }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit(formData.get('text'));
  };

  return (
    <form onSubmit={handleSubmit} className="text-input-form">
      <input
        type="text"
        name="text"
        placeholder={placeholder}
        className="text-input"
      />
      <button type="submit" className="submit-button">
        Submit
      </button>
    </form>
  );
};

export default TextInputForm; 