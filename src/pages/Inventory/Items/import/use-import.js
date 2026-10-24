import { useEffect, useRef, useState } from "react";
import ImportService, { importFailure } from "@services/ItemImportService";
import { suggestMapping } from "./model";

export const isRunning = session => Boolean(session && ["queued", "processing"].includes(session.state));
export const isEditable = session => Boolean(session && session.resumeSupported && !session.jobId && ["mapping_required", "validation_failed", "ready_to_commit"].includes(session.state));
const sameSettings = (left, right) => {
  if (!left || !right) return left === right;
  return JSON.stringify(Object.keys(left).filter(key => key !== "mapping").sort().map(key => [key, left[key]])) === JSON.stringify(Object.keys(right).filter(key => key !== "mapping").sort().map(key => [key, right[key]])) &&
    JSON.stringify(Object.entries(left.mapping || {}).sort()) === JSON.stringify(Object.entries(right.mapping || {}).sort());
};

export default function useImport(history) {
  const [capabilities, setCapabilities] = useState(null);
  const [capabilityError, setCapabilityError] = useState(null);
  const [session, setSession] = useState(null);
  const [draft, setDraft] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rows, setRows] = useState({ data: [], total: 0 });
  const [rowPage, setRowPage] = useState(1);
  const [rowFilter, setRowFilter] = useState("");
  const [rowLoading, setRowLoading] = useState(false);
  const [rowError, setRowError] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState(null);
  const [uncertain, setUncertain] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(null);
  const [logs, setLogs] = useState({ data: [], total: 0 });
  const [logPage, setLogPage] = useState(1);
  const [search, setSearch] = useState("");
  const [logLoading, setLogLoading] = useState(false);
  const [logError, setLogError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dataRefresh, setDataRefresh] = useState(0);
  const mounted = useRef(true);
  const lock = useRef(false);
  const currentId = useRef(null);
  const initialLoad = useRef(false);
  const dirty = Boolean(session && draft && !sameSettings(session.settings, draft));

  useEffect(() => () => { mounted.current = false; }, []);

  const run = async (name, work) => {
    if (lock.current) return;
    lock.current = true;
    setBusy(name); setError(null);
    try { return await work(); }
    catch (failure) { if (mounted.current) setError(await importFailure(failure)); }
    finally { lock.current = false; if (mounted.current) setBusy(""); }
  };

  const loadCapabilities = async () => {
    setCapabilityError(null);
    try {
      const result = await ImportService.capabilities();
      if (mounted.current) setCapabilities(result);
    } catch (failure) { if (mounted.current) setCapabilityError(await importFailure(failure)); }
  };
  useEffect(() => { loadCapabilities(); }, []);

  const saveURL = id => {
    const location = history.location || window.location;
    const params = new URLSearchParams(location.search || "");
    if (id) params.set("session", id); else params.delete("session");
    history.replace({ pathname: location.pathname, search: params.toString() ? `?${params}` : "" });
  };
  const acceptSession = (next, nextStep) => {
    if (!mounted.current) return;
    currentId.current = next.id;
    setSession(next); setDraft(next.settings); setUncertain(false);
    setRowPage(1); setRowFilter(""); setRows({ data: [], total: 0 });
    setPreview(null); setPreviewError(null);
    setStep(nextStep == null ? isRunning(next) || ["completed", "failed", "expired", "discarded"].includes(next.state) ? 3 : next.validationId ? 2 : 1 : nextStep);
    saveURL(next.id);
  };

  const resume = id => run("session", async () => {
    const next = await ImportService.session(id);
    if (!mounted.current) return;
    acceptSession(next);
  });
  useEffect(() => {
    if (!capabilities || initialLoad.current || !capabilities.actions.view) return;
    initialLoad.current = true;
    const id = new URLSearchParams((history.location || window.location).search).get("session");
    if (id) resume(id);
  }, [capabilities]);

  useEffect(() => {
    if (!session || ["expired", "discarded"].includes(session.state)) return;
    let active = true;
    setPreviewError(null);
    ImportService.preview(session.id).then(result => {
      if (!active) return;
      setPreview(result);
      // Suggest only for an unconfigured session; saved mappings remain authoritative on resume.
      if (isEditable(session) && !Object.keys(session.settings.mapping).length) {
        setDraft(current => current && !Object.keys(current.mapping).length ? { ...current, mapping: suggestMapping(result.headers) } : current);
      }
    }).catch(async failure => { if (active) setPreviewError(await importFailure(failure)); });
    return () => { active = false; };
  }, [session && session.id, session && session.revision, dataRefresh]);

  useEffect(() => {
    if (!session || !session.validationId || !["ready_to_commit", "validation_failed", "completed", "failed", "queued", "processing"].includes(session.state)) return;
    let active = true;
    setRowLoading(true); setRowError(null);
    ImportService.rows(session.id, { limit: 10, offset: (rowPage - 1) * 10, ...(rowFilter ? { action: rowFilter } : {}) }).then(result => {
      if (active && result.revision === session.revision && result.validationId === session.validationId) setRows(result);
    }).catch(async failure => { if (active) setRowError(await importFailure(failure)); })
      .finally(() => { if (active) setRowLoading(false); });
    return () => { active = false; };
  }, [session && session.id, session && session.revision, session && session.validationId, session && session.state, rowPage, rowFilter, dataRefresh]);

  useEffect(() => {
    if (!capabilities || !capabilities.actions.view) return;
    let active = true;
    const timer = setTimeout(async () => {
      setLogLoading(true); setLogError(null);
      try {
        const result = await ImportService.history({ offset: (logPage - 1) * 10, search: search.trim() });
        if (active) setLogs(result);
      } catch (failure) { if (active) setLogError(await importFailure(failure)); }
      finally { if (active) setLogLoading(false); }
    }, 250);
    return () => { active = false; clearTimeout(timer); };
  }, [capabilities, logPage, search, refreshKey]);

  useEffect(() => {
    if (!session || !isRunning(session) && !uncertain) return;
    let active = true;
    let timer;
    const poll = async () => {
      try {
        const next = await ImportService.session(session.id);
        if (!active || currentId.current !== next.id) return;
        setSession(next);
        if (!isRunning(next)) {
          setUncertain(false);
          if (next.state === "completed") { setError(null); setRefreshKey(key => key + 1); }
          return;
        }
      } catch (failure) { if (active) setError(await importFailure(failure)); }
      if (active) timer = setTimeout(poll, 3000);
    };
    timer = setTimeout(poll, 1000);
    return () => { active = false; clearTimeout(timer); };
  }, [session && session.id, session && session.state, uncertain]);

  const upload = (file, encoding, delimiter) => run("upload", async () => {
    const limits = capabilities.limits;
    const extension = file.name.split(".").pop().toLowerCase();
    if (!capabilities.actions.upload) throw new Error("Upload permission required");
    if (!file.size || file.size > limits.uploadBytes || !capabilities.formats.includes(extension)) {
      setError({ message: `Choose a supported, non-empty file up to ${Math.floor(limits.uploadBytes / 1024 / 1024)} MB.` }); return;
    }
    setUploadPercent(null);
    const next = await ImportService.upload(file, encoding, delimiter, progress => {
      if (mounted.current && progress.total) setUploadPercent(Math.round(progress.loaded / progress.total * 100));
    });
    acceptSession(next, 0); setRefreshKey(key => key + 1);
  });

  const configure = () => run("configure", async () => {
    const next = await ImportService.configure(session.id, { ...draft, revision: session.revision });
    if (mounted.current) { acceptSession(next, 1); }
  });
  const validate = () => run("validate", async () => {
    let saved = session;
    if (dirty) {
      saved = await ImportService.configure(session.id, { ...draft, revision: session.revision });
      if (mounted.current) { setSession(saved); setDraft(saved.settings); }
    }
    const next = await ImportService.validate(saved.id, saved.revision);
    acceptSession(next, 2); setRefreshKey(key => key + 1);
  });
  const commit = () => run("commit", async () => {
    if (!session || session.state !== "ready_to_commit" || dirty || !session.validationId || !capabilities.actions.commit) return;
    try {
      const next = await ImportService.commit(session.id, session.revision, session.validationId);
      if (mounted.current) { setSession(next); setStep(3); setRefreshKey(key => key + 1); }
    } catch (failure) {
      if (mounted.current && (!failure.response || failure.response.status >= 500)) setUncertain(true);
      throw failure;
    }
  });
  const refreshSession = () => run("refresh", async () => {
    const next = await ImportService.session(session.id);
    acceptSession(next); setDataRefresh(key => key + 1); setRefreshKey(key => key + 1);
  });
  const clear = () => {
    currentId.current = null; setSession(null); setDraft(null); setPreview(null); setRows({ data: [], total: 0 });
    setStep(0); setError(null); setUncertain(false); saveURL(null);
  };
  const discard = () => run("discard", async () => {
    await ImportService.discard(session.id, session.revision);
    if (mounted.current) { clear(); setRefreshKey(key => key + 1); }
    return true;
  });
  const download = (type, id) => run("download", async () => {
    const blob = type === "report" ? await ImportService.report(id || session.id) : await ImportService.template(type);
    if (!mounted.current) return;
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url; anchor.download = type === "report" ? "item-import-report.xlsx" : `items-template.${type}`;
    document.body.appendChild(anchor); anchor.click(); anchor.remove(); URL.revokeObjectURL(url);
  });

  return { capabilities, capabilityError, loadCapabilities, session, draft, setDraft, preview, previewError, rows, rowPage, setRowPage, rowFilter, setRowFilter, rowLoading, rowError,
    step, setStep, busy, error, uncertain, uploadPercent, dirty, logs, logPage, setLogPage, search, setSearch, logLoading, logError,
    refreshLogs: () => setRefreshKey(key => key + 1), upload, configure, validate, commit, resume, refreshSession, clear, discard, download };
}
