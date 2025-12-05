import { useEffect, useMemo, useState } from "react";
import { API_BASE_URL } from "../api/client.js";

const INPUT_TYPE_MAP = {
  string: "text",
  text: "text",
  number: "number",
  integer: "number",
  float: "number",
  email: "email",
  password: "password",
  date: "date",
  "date-time": "datetime-local",
  boolean: "checkbox",
  file: "file",
};

const DEFAULT_VALUE_BY_TYPE = {
  string: "",
  text: "",
  number: "",
  integer: "",
  float: "",
  email: "",
  password: "",
  date: "",
  "date-time": "",
  boolean: false,
  file: null,
};

const normalizeField = (field) => {
  if (typeof field === "string") {
    return {
      name: field,
      label: field
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      dataType: "string",
      required: true,
      optional: false,
    };
  }
  return {
    name: field.name || field.label,
    label:
      field.label ||
      field.name.replace(/[_-]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
    dataType: field.dataType || field.type || "string",
    placeholder: field.placeholder,
    required: field.optional ? false : (field.required ?? true),
    options: field.options,
    optional: field.optional ?? false,
  };
};

const buildInitialValues = (fields, initialValues = {}) =>
  fields.reduce((acc, field) => {
    const fieldType = field.dataType.toLowerCase();

    if (
      initialValues[field.name] !== undefined &&
      initialValues[field.name] !== null
    ) {
      acc[field.name] =
        fieldType === "boolean"
          ? Boolean(initialValues[field.name])
          : String(initialValues[field.name]);
    } else {
      acc[field.name] = DEFAULT_VALUE_BY_TYPE[fieldType] ?? "";
    }
    return acc;
  }, {});

function PopupForm({
  method = "POST",
  endpoint,
  fields = [],
  initialValues,
  submitLabel,
  onClose,
  onSubmit,
}) {
  const normalizedFields = useMemo(
    () => fields.map((field) => normalizeField(field)),
    [fields]
  );

  const [formValues, setFormValues] = useState(() =>
    buildInitialValues(normalizedFields, initialValues)
  );
  const [status, setStatus] = useState({ state: "idle" });
  const [filePreview, setFilePreview] = useState({});

  useEffect(() => {
    setFormValues(buildInitialValues(normalizedFields, initialValues));
    setStatus({ state: "idle" });
    setFilePreview({});
  }, [normalizedFields, initialValues]);

  const handleChange = (field, event) => {
    const type = field.dataType.toLowerCase();
    let value = event.target.value;
    
    if (type === "boolean") {
      value = event.target.checked;
    } else if (type === "number" || type === "integer" || type === "float") {
      value = event.target.value === "" ? "" : Number(event.target.value);
    } else if (type === "file") {
      const file = event.target.files[0];
      value = file;
      
      // Create preview for image files
      if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(prev => ({
            ...prev,
            [field.name]: reader.result
          }));
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(prev => ({
          ...prev,
          [field.name]: null
        }));
      }
    }
    
    setFormValues((prev) => ({ ...prev, [field.name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (onSubmit) {
      setStatus({ state: "submitting" });
      try {
        await onSubmit(formValues);
        setStatus({ state: "success" });
        onClose?.();
      } catch (error) {
        setStatus({ state: "error", message: error.message });
      }
      return;
    }
    if (!endpoint) return;
    setStatus({ state: "submitting" });
    try {
      const url =
        endpoint.startsWith("http") || endpoint.startsWith("https")
          ? endpoint
          : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

      // Check if we have file uploads
      const hasFiles = Object.values(formValues).some(value => value instanceof File);
      
      let body;
      let headers = {};
      
      if (hasFiles) {
        // Use FormData for file uploads
        const formData = new FormData();
        Object.entries(formValues).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append('image', value); // Backend expects 'image' field name
          } else if (value !== null && value !== undefined && value !== '') {
            formData.append(key, value);
          }
        });
        body = formData;
        // Don't set Content-Type header for FormData, let browser handle it
      } else {
        // Use JSON for regular data
        headers["Content-Type"] = "application/json";
        body = JSON.stringify(formValues);
      }

      const response = await fetch(url, {
        method,
        headers,
        body,
      });
      
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const payload = await response
        .json()
        .catch(() => ({ ok: true, message: "No JSON response body." }));
      setStatus({ state: "success" });
      console.info("PopupForm success:", payload);
      onClose?.();
    } catch (error) {
      setStatus({ state: "error", message: error.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {submitLabel ||
                (method === "POST" ? "Create Record" : "Update Record")}
            </h2>
          </div>
          <button
            type="button"
            className="rounded-full p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
            onClick={onClose}
            aria-label="Close popup form"
          >
            ✕
          </button>
        </header>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {normalizedFields.map((field) => {
            if (field.dataType === "hidden") return null;
            const inputType =
              INPUT_TYPE_MAP[field.dataType?.toLowerCase()] || "text";
            const value = formValues[field.name];

            if (field.options && Array.isArray(field.options)) {
              return (
                <label
                  key={field.name}
                  className="flex flex-col gap-2 text-sm font-medium text-slate-700"
                >
                  <span>{field.label}</span>
                  <select
                    value={value ?? ""}
                    onChange={(event) => handleChange(field, event)}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                  >
                    {field.options.map((option) => (
                      <option
                        key={option.value ?? option}
                        value={option.value ?? option}
                      >
                        {option.label ?? option}
                      </option>
                    ))}
                  </select>
                </label>
              );
            }

            if (inputType === "checkbox") {
              return (
                <label
                  key={field.name}
                  className="flex items-center gap-3 text-sm font-medium text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(event) => handleChange(field, event)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  {field.label}
                </label>
              );
            }

            if (field.dataType?.toLowerCase() === "textarea") {
              return (
                <label
                  key={field.name}
                  className="flex flex-col gap-2 text-sm font-medium text-slate-700"
                >
                  <span>{field.label}</span>
                  <textarea
                    value={value ?? ""}
                    onChange={(event) => handleChange(field, event)}
                    placeholder={field.placeholder}
                    required={field.required}
                    rows={4}
                    className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100 resize-vertical"
                  />
                </label>
              );
            }

            if (inputType === "file") {
              return (
                <div key={field.name} className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    <span>{field.label}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => handleChange(field, event)}
                      required={field.required}
                      className="mt-2 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                  </label>
                  {filePreview[field.name] && (
                    <div className="mt-2">
                      <img
                        src={filePreview[field.name]}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg border border-slate-300"
                      />
                    </div>
                  )}
                </div>
              );
            }

            return (
              <label
                key={field.name}
                className="flex flex-col gap-2 text-sm font-medium text-slate-700"
              >
                <span>{field.label}</span>
                <input
                  type={inputType}
                  value={value ?? ""}
                  onChange={(event) => handleChange(field, event)}
                  placeholder={field.placeholder}
                  required={field.required}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-100"
                />
              </label>
            );
          })}

          {status.state === "error" && (
            <p className="text-sm text-red-600">{status.message}</p>
          )}

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
              disabled={status.state === "submitting"}
            >
              {status.state === "submitting"
                ? "Saving..."
                : submitLabel || (method === "POST" ? "Create" : "Update")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default PopupForm;
