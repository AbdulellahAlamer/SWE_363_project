// LogoUpload component for uploading and previewing a logo image
export default function LogoUpload({ logoPreview, setLogoPreview, setLogoFile }) {
  return (
    <label
      htmlFor="logoInput"
      className="group relative flex flex-col items-center justify-center gap-2 w-full h-40 border-2 border-dashed border-gray-300 rounded-lg bg-white hover:border-blue-300 cursor-pointer p-4 text-center"
    >
      <input
        id="logoInput"
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files && e.target.files[0];
          if (!file) return;
          setLogoFile(file);
          // revoke previous preview if exists
          if (logoPreview) URL.revokeObjectURL(logoPreview);
          const url = URL.createObjectURL(file);
          setLogoPreview(url);
        }}
        className="hidden"
      />
      {logoPreview ? (
        <img
          src={logoPreview}
          alt="logo preview"
          className="w-24 h-24 object-cover rounded-lg border"
        />
      ) : (
        <>
          <svg
            className="w-8 h-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16V4m0 0L3 8m4-4 4 4M17 8v12m0 0l4-4m-4 4-4-4"
            ></path>
          </svg>
          <div className="text-sm text-gray-500">
            Click or tap to upload a logo (or take a photo)
          </div>
          <div className="text-xs text-gray-400">Show more</div>
        </>
      )}
    </label>
  );
}
