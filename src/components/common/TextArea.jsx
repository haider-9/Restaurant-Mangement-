
const TextArea = ({ label, placeholder, value, onChange }) => {
  return (
    <div>
      {label && <label className="block text-sm font-medium mb-1">{label}</label>}
      <textarea
        rows={2}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-3 py-2 rounded-xl resize-none"
      />
    </div>
  );
};

export default TextArea;
