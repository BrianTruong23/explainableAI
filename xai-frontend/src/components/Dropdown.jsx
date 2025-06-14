import React from 'react';

const Dropdown = ({ options, value, onChange, placeholder = "Select an option" }) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="dropdown-select"
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Dropdown; 