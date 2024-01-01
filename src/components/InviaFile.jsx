import React from 'react';

function InviaFile({
  fields,
  title,
  selectedCV,
  setSelectedCV,
  selectedCF,
  setSelectedCF,
  formValues,
  setFormValues,
  onSubmit
}) {

  // Gestisce il cambiamento nei campi di input
  const handleChange = (e) => {
    const { name, value, files, type, cv } = e.target;

    if (type === 'file') {
      // Gestisce i file
      if(name === 'cv') {
        setSelectedCV(value);
      } else if(name === 'cf') {
        setSelectedCF(value);
      }
    } else {
      // Gestisce gli altri campi
      setFormValues({ ...formValues, [name]: value, [cv]: value });
    }
  };

  // Gestisce la selezione multipla
  const handleSelectChange = (e) => {
    setFormValues({
      ...formValues,
      skill: [...e.target.selectedOptions].map(o => o.value)
    });
  };

  // Renderizza i campi di input in base alla loro configurazione
  const renderField = (field) => {
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            name={field.name}
            value={formValues[field.name]}
            onChange={handleChange}
          />
        );
      case 'multipleSelect':
        return (
          <select multiple name={field.name} onChange={handleSelectChange}>
            {field.options.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'file':
        return (
          <input
            type="file"
            name={field.name}
            onChange={handleChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <h2>{title}</h2>
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(formValues); }}>
        {fields.map(field => (
          <div key={field.name}>
            <label>{field.label}</label>
            {renderField(field)}
          </div>
        ))}
        <button type="submit">Invia</button>
      </form>
    </div>
  );
}

export default InviaFile;
