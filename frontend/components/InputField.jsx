import React from 'react';

export default function InputField({ label, type = "text", name, placeholder, value, onChange, required = true, min, max }) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
      />
    </div>
  );
}