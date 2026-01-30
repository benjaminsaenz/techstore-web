import { useEffect, useId, useRef } from "react";

// CKEditor 4 is loaded via CDN in index.html.
// This component wires a CKEditor instance to a textarea and returns HTML via onChange.

// Optional: pass instanceKey to make the instance addressable (e.g. to flush data on submit).
// When provided, the instance is stored in window.__techstoreCkEditors[instanceKey].
export default function CKEditor4({ value, onChange, height = 220, instanceKey }) {
  // If we have a key, use a stable DOM id so React strict-mode remounts don't confuse CKEditor.
  const autoId = useId().replace(/:/g, "-");
  const domId = (instanceKey ? `ck4_${instanceKey}` : autoId);
  const editorRef = useRef(null);

  useEffect(() => {
    const CKEDITOR = window.CKEDITOR;
    if (!CKEDITOR) return;

    const instance = CKEDITOR.replace(domId, {
      height,
      // Allow rich HTML pasted from elsewhere (images, tables, inline styles, etc.)
      allowedContent: true,
    });
    editorRef.current = instance;

    // Expose instance for callers that need to force-read current HTML on submit.
    if (instanceKey) {
      window.__techstoreCkEditors = window.__techstoreCkEditors || {};
      window.__techstoreCkEditors[instanceKey] = instance;
    }

    instance.on("change", () => {
      const html = instance.getData();
      onChange?.(html);
    });

    // Also flush on blur (sometimes users click "Guardar" without triggering a change event)
    instance.on("blur", () => {
      const html = instance.getData();
      onChange?.(html);
    });

    // set initial value
    instance.setData(value || "");

    return () => {
      try {
        if (instanceKey && window.__techstoreCkEditors?.[instanceKey] === instance) {
          delete window.__techstoreCkEditors[instanceKey];
        }
        instance.destroy(true);
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // external updates
  useEffect(() => {
    const inst = editorRef.current;
    if (!inst) return;
    const current = inst.getData();
    if ((value || "") !== current) {
      inst.setData(value || "");
    }
  }, [value]);

  return <textarea id={domId} defaultValue={value || ""} />;
}
