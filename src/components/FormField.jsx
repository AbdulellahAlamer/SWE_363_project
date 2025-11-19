// A reusable form field with label and input/select/textarea
export default function FormField({ label, children, className = "", ...props }) {
  return (
    <div className={className} {...props}>
      <label className="block text-gray-600 mb-2">{label}</label>
      {children}
    </div>
  );
}
