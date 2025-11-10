// The `web-vitals` package no longer exports a `ReportHandler` type in some
// versions. Define a compatible local type to avoid type errors while keeping
// the same runtime behavior.
type ReportHandler = (metric: any) => void;

const reportWebVitals = (onPerfEntry?: ReportHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // Use a loose `any` import here because some versions of `web-vitals`
    // have different export shapes. This keeps runtime behavior stable
    // while avoiding strict type mismatches.
    import('web-vitals').then((wv: any) => {
      wv.getCLS?.(onPerfEntry);
      wv.getFID?.(onPerfEntry);
      wv.getFCP?.(onPerfEntry);
      wv.getLCP?.(onPerfEntry);
      wv.getTTFB?.(onPerfEntry);
    });
  }
};

export default reportWebVitals;
