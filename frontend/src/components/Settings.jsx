
import React from 'react';
import '../css/Settings.css';

const Settings = ({ settings, onSettingsChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    const newSettings = {
      ...settings,
      [name]: name === 'topK' ? parseInt(value) : value
    };
    console.log('Sending settings update:', newSettings);
    onSettingsChange(newSettings);
  };

  return (
    <div className="settings-panel">
      <h3>AI Settings</h3>
      <div className="setting-item">
        <label>Top K:</label>
        <input
          type="number"
          name="topK"
          value={settings.topK}
          onChange={handleChange}
          min="1"
          max="100"
        />
      </div>
      <div className="setting-item">
        <label>Model:</label>
        <select name="model" value={settings.model} onChange={handleChange}>
          <option value="gpt-4o">GPT-4</option>
          <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
        </select>
      </div>
      <div className="setting-item">
        <label>Temperature:</label>
        <input
          type="range"
          name="temperature"
          value={settings.temperature}
          onChange={handleChange}
          min="0"
          max="1"
          step="0.1"
        />
        <span>{settings.temperature}</span>
      </div>
    </div>
  );
};

export default Settings;
