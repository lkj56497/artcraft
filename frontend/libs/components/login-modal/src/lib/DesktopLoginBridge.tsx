import { useEffect, useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { invoke } from "@tauri-apps/api/core";
import { ArrowLeftIcon } from "lucide-react";
import type { UserInfo } from "@storyteller/api";
import { createDesktopLoginChallenge, pollDesktopLoginChallenge, cancelDesktopLoginChallenge, isDesktopLoginError, type DesktopLoginChallenge } from "./NativeLoginBridge";

const OpenUrl = (url: string) => invoke("plugin:opener|open_url", { url });

export function DesktopLoginBridge({ onSuccess, onStart, onActiveChange }: { onSuccess: (user: UserInfo) => void; onStart?: () => void; onActiveChange?: (active: boolean) => void }) {
  const [challenge, setChallenge] = useState<DesktopLoginChallenge | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [now, setNow] = useState(Date.now);
  const generation = useRef(0);
  const success = useRef(onSuccess);
  success.current = onSuccess;
  const isActive = busy || challenge !== null;

  useEffect(() => { onActiveChange?.(isActive); }, [isActive, onActiveChange]);

  useEffect(() => () => { generation.current += 1; }, []);
  useEffect(() => {
    if (!challenge) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [challenge]);

  useEffect(() => {
    if (!challenge) return;
    let active = true;
    const current = generation.current;
    let timer: ReturnType<typeof setTimeout>;
    let delay = Math.max(5, challenge.poll_interval_seconds) * 1000;
    const deadline = Date.parse(challenge.expires_at);
    const finish = (text: string) => {
      setChallenge(null);
      setMessage(text);
    };
    const poll = async () => {
      if (!active || current !== generation.current) return;
      if (Date.now() >= deadline) { finish("로그인 요청이 만료되었습니다. 새로 요청하세요."); return; }
      try {
        const result = await pollDesktopLoginChallenge(challenge.challenge_id);
        if (!active || current !== generation.current) return;
        if (result.status === "redeemed") {
          if (!result.maybe_user) throw new Error("Native session verification did not return a user");
          active = false;
          setChallenge(null);
          setMessage("로그인되었습니다.");
          success.current(result.maybe_user);
          return;
        }
        if (result.status === "failed") {
          finish(result.maybe_failure_type === "user_declined" ? "웹사이트에서 로그인이 거부되었습니다." : result.maybe_failure_type === "expired" ? "로그인 요청이 만료되었습니다. 새로 요청하세요." : "로그인 실패. 새로 요청하세요.");
          return;
        }
        if (!["pending", "approved"].includes(result.status)) {
          finish("이 로그인 요청을 완료할 수 없습니다. 새로 요청하세요.");
          return;
        }
        delay = Math.max(5, challenge.poll_interval_seconds) * 1000;
        setMessage("웹사이트에서 승인을 기다리는 중…");
      } catch (error) {
        if (!active || current !== generation.current) return;
        if (isDesktopLoginError(error) && !error.retryable) {
          finish(error.message);
          return;
        }
        delay = Math.min(delay * 2, 30_000);
        setMessage("연결이 끊겼습니다. 다시 시도 중…");
      }
      if (active) timer = setTimeout(poll, Math.min(delay, Math.max(0, deadline - Date.now())));
    };
    timer = setTimeout(poll, Math.min(delay, Math.max(0, deadline - Date.now())));
    return () => {
      active = false;
      clearTimeout(timer);
      void cancelDesktopLoginChallenge(challenge.challenge_id).catch(() => {});
    };
  }, [challenge]);

  const start = async (openBrowser: boolean) => {
    if (busy) return;
    onStart?.();
    const current = ++generation.current;
    setBusy(true);
    setMessage("");
    try {
      const created = await createDesktopLoginChallenge();
      if (current !== generation.current) {
        void cancelDesktopLoginChallenge(created.challenge_id).catch(() => {});
        return;
      }
      // Rust validates the approval URL against the configured API environment.
      setNow(Date.now());
      setChallenge(created);
      setMessage("웹사이트에서 승인을 기다리는 중…");
      if (openBrowser) await OpenUrl(created.verification_url);
    } catch (error) {
      if (current === generation.current) setMessage(isDesktopLoginError(error) ? error.message : "웹사이트 로그인을 열 수 없습니다. 다시 시도하거나 QR 코드를 스캔하세요.");
    } finally {
      if (current === generation.current) setBusy(false);
    }
  };

  const back = () => {
    generation.current += 1;
    setChallenge(null);
    setBusy(false);
    setMessage("");
  };

  const remaining = challenge ? Math.max(0, Math.ceil((Date.parse(challenge.expires_at) - now) / 1000)) : 0;
  return <section aria-label="웹사이트 로그인" className="mb-6 border border-white/15 bg-white/[0.03] p-4 text-center">
    {isActive && <div className="mb-4 text-left">
      <button type="button" className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white/60 transition-colors hover:text-white" onClick={back}>
        <ArrowLeftIcon size={16} aria-hidden="true" /> 뒤로
      </button>
    </div>}
    {challenge ? <>
      <p className="mb-3 text-sm text-white/70">휴대폰으로 스캔하거나 브라우저에서 승인하세요.</p>
      <QRCodeSVG value={challenge.verification_url} size={192} marginSize={4} title="스캔해서 데스크톱 로그인 승인" className="mx-auto" />
      <p className="my-3 font-mono text-2xl tracking-[0.2em]">{challenge.confirmation_code.slice(0, 4)}-{challenge.confirmation_code.slice(4)}</p>
      <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.12em] text-white/50">웹사이트에서 이 코드를 확인하세요. 남은 시간 {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, "0")}</p>
      <button type="button" className="h-10 rounded-[3px] border border-white/15 bg-white/5 px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10" onClick={() => OpenUrl(challenge.verification_url).catch(() => setMessage("브라우저를 열 수 없습니다. 대신 QR 코드를 스캔하세요."))}>웹사이트 열기</button>
    </> : busy ? <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-white/60" role="status">로그인 준비 중…</p> : <div className="flex flex-col gap-2">
      <button type="button" className="h-10 rounded-[3px] bg-white px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white/90" onClick={() => start(true)}>웹사이트로 로그인</button>
      <button type="button" className="h-10 rounded-[3px] border border-white/15 bg-white/5 px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10" onClick={() => start(false)}>스캔해서 로그인</button>
      <p className="text-xs text-white/50">웹사이트에 이미 로그인된 구글 등 계정을 사용하세요.</p>
    </div>}
    {message && <p className="mt-3 text-sm text-white/70" role="status">{message}</p>}
  </section>;
}
