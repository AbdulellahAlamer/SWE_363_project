// ButtonGroup component for rendering a group of action buttons
export default function ButtonGroup({ buttons, className = "" }) {
  return (
    <div className={`flex justify-end gap-4 ${className}`}>
      {buttons.map(({ label, onClick, type = "button", ...rest }, idx) => (
        <button key={idx} type={type} onClick={onClick} {...rest}>
          {label}
        </button>
      ))}
    </div>
  );
}
