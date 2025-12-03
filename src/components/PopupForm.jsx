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

  useEffect(() => {
    setFormValues(buildInitialValues(normalizedFields, initialValues));
    setStatus({ state: "idle" });
  }, [normalizedFields, initialValues]);

  const handleChange = (field, event) => {
    const type = field.dataType.toLowerCase();
    let value = event.target.value;
    if (type === "boolean") {
      value = event.target.checked;
    } else if (type === "number" || type === "integer" || type === "float") {
      value = event.target.value === "" ? "" : Number(event.target.value);
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

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formValues),
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
